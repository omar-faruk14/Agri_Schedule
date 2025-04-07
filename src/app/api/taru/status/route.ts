import { NextResponse } from "next/server";

const kintoneUrl: string = `${process.env.NEXT_PUBLIC_KINTONE_BASE_URL}/k/v1`;
const apiToken: string = "jrmkjLUA6BqzvglXZXfHAvHGJje6bySwRv3Z4rPG";
const appId: number = 105;


interface KintoneApiResponse {
  records: KintoneApiRecord[];
}

interface KintoneApiRecord {
  Record_number: { value: string };
  container_id: { value: string };
  container_status: { value: string };
  Borrower_Information: { value: string };
  typeCode: { value: string };
}

interface KintoneRecord {
  Record_number: string;
  container_id: string;
  container_status: string;
  Borrower_Information: string;
  typeCode: string;
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
        container_id: record.container_id.value,
        container_status: record.container_status.value,
        Borrower_Information: record.Borrower_Information.value,
        typeCode: record.typeCode.value,
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
    const requiredFields: (keyof KintoneRecord)[] = [
      "container_id",
      "container_status",
       "Borrower_Information",
       "typeCode",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing field: ${field}` },
          { status: 400 }
        );
      }
    }

    const recordData = {
      app: appId,
      record: {
        container_id: { value: body.container_id },
        container_status: { value: body.container_status },
        Borrower_Information: { value: body.Borrower_Information },
        typeCode: { value: body.typeCode },
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

    if (body.container_id) {
      updateFields.container_id = { value: body.container_id };
    }
    if (body.container_status) {
      updateFields.container_status = { value: body.container_status };
    }
    if (body.Borrower_Information) {
      updateFields.Borrower_Information = { value: body.Borrower_Information };
    }
    if (body.typeCode) {
      updateFields.typeCode = { value: body.typeCode };
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

