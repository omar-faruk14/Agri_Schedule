import { NextResponse } from "next/server";

const kintoneUrl: string = `${process.env.NEXT_PUBLIC_KINTONE_BASE_URL}/k/v1`;
const apiToken: string = "DvX30PeTEegE0z6rsseSivDDnUPijzuuXPQVeYPz";
const appId: number = 108;


interface KintoneApiResponse {
  records: KintoneApiRecord[];
}

interface KintoneApiRecord {
  Record_number: { value: string };
  bottle_QR_code: { value: string };
  barrel_used: { value: string };
  bottle_status: { value: string };
  bottle_type_information: { value: string };
}

interface KintoneRecord {
    Record_number: string;
    bottle_QR_code: string;
    barrel_used: string;
    bottle_status: string;
    bottle_type_information: string;
}

interface RequiredKintoneRecord {
  Record_number: string;
  bottle_QR_code: string;
  barrel_used: string;
  bottle_status: string;
}


export async function GET(request: Request): Promise<NextResponse> {
  try {
    
    const { searchParams } = new URL(request.url);
        const container_id = searchParams.get("container_id");
    
        if (!container_id) {
          return NextResponse.json(
            { error: "Missing container_id parameter" },
            { status: 400 }
          );
        }
    
        const query = `(container_id = "${container_id}")`;
        const response = await fetch(
          `${kintoneUrl}/records.json?app=${appId}&query=${encodeURIComponent(
            query
          )}`,{
      headers: {
        "X-Cybozu-API-Token": apiToken,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch records");
    }
    const data: KintoneApiResponse = await response.json();

    const records: KintoneRecord[] = data.records.map(
      (record: KintoneApiRecord) => ({
        Record_number: record.Record_number.value,
        bottle_QR_code: record.bottle_QR_code.value,
        barrel_used: record.barrel_used.value,
        bottle_status: record.bottle_status.value,
        bottle_type_information: record.bottle_type_information.value,
      })
    );

    return NextResponse.json(records);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error retrieving records" });
  }
}


export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body: KintoneRecord = await request.json();

    // Validate required fields
    const requiredFields: (keyof RequiredKintoneRecord)[] = [
      "bottle_QR_code",
      "barrel_used",
      "bottle_status",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Check if a record with the same container_id exists
    const checkQuery = `(bottle_QR_code = "${body.bottle_QR_code}")`;

    const checkResponse = await fetch(
      `${kintoneUrl}/records.json?app=${appId}&query=${encodeURIComponent(
        checkQuery
      )}`,
      {
        headers: {
          "X-Cybozu-API-Token": apiToken,
        },
      }
    );

    if (!checkResponse.ok) {
      throw new Error("Failed to check for existing container_id");
    }

    const checkData: KintoneApiResponse = await checkResponse.json();

    if (checkData.records.length > 0) {
      return NextResponse.json(
        { error: "この QRコード は既に存在します。" },
        { status: 400 }
      );
    }

    const recordData = {
      app: appId,
      record: {
        bottle_QR_code: { value: body.bottle_QR_code },
        barrel_used: { value: body.barrel_used },
        bottle_status: { value: body.bottle_status },

        bottle_type_information: {
          value: body.bottle_type_information || null,
        },
      },
    };

    const response = await fetch(`${kintoneUrl}/record.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Cybozu-API-Token": apiToken,
      },
      body: JSON.stringify(recordData),
    });

    if (!response.ok) {
      throw new Error("Failed to create record");
    }

    const data: KintoneApiResponse = await response.json();
    return NextResponse.json({
      message: "Record created successfully",
      record: data,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error creating record" },
      { status: 500 }
    );
  }
}


export async function PUT(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();

    const recordId = body.Record_number; // rename this to actual "id" if needed

    if (!recordId) {
      return NextResponse.json(
        { error: "Missing Record_number" },
        { status: 400 }
      );
    }

    // Prepare update fields with a more specific type
    const updateFields: Record<
      string,
      { value: string | number | boolean | null }
    > = {};

    if (body.bottle_QR_code) {
      updateFields.bottle_QR_code = { value: body.bottle_QR_code };
    }
    if (body.barrel_used) {
      updateFields.barrel_used = { value: body.barrel_used };
    }
    if (body.bottle_status) {
      updateFields.bottle_status = { value: body.bottle_status };
    }
    if (body.bottle_type_information !== undefined) {
      updateFields.bottle_type_information = {
        value: body.bottle_type_information || null, // Assign null if the value is an empty string
      };
    }


    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json(
        { error: "No updatable fields provided" },
        { status: 400 }
      );
    }

    // 🔍 Get current record revision
    const revisionResponse = await fetch(
      `${kintoneUrl}/record.json?app=${appId}&id=${recordId}`,
      {
        headers: {
          "X-Cybozu-API-Token": apiToken,
        },
      }
    );

    if (!revisionResponse.ok) {
      const err = await revisionResponse.json();
      return NextResponse.json(
        { error: "Failed to get revision", details: err },
        { status: 500 }
      );
    }

    const revisionData = await revisionResponse.json();
    const revision = revisionData.record.$revision.value;

    // ✅ Prepare update data using ID and revision
    const updateData = {
      app: appId,
      id: recordId,
      revision,
      record: updateFields,
    };

    console.log("Sending update to Kintone:", updateData);

    const response = await fetch(`${kintoneUrl}/record.json`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Cybozu-API-Token": apiToken,
      },
      body: JSON.stringify(updateData),
    });

    const kintoneResult = await response.json();

    if (!response.ok) {
      console.error("Kintone PUT error response:", kintoneResult);
      return NextResponse.json(
        { error: "Kintone update failed", details: kintoneResult },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Record updated successfully",
      record: kintoneResult,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Unexpected error in PUT handler:", error.message);
      return NextResponse.json(
        { error: "Unexpected error", message: error.message },
        { status: 500 }
      );
    }

    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Unexpected error", message: "An unknown error occurred" },
      { status: 500 }
    );
  }
}

