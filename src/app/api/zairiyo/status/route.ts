import { NextResponse } from "next/server";

const kintoneUrl: string = `${process.env.NEXT_PUBLIC_KINTONE_BASE_URL}/k/v1`;
const apiToken: string = "waotN4cAsMn5e6nWTm2KR1UkoPfduqfeJmlKPcTu";
const appId: number = 111;


interface KintoneApiResponse {
  records: KintoneApiRecord[];
}

// interface for records get api
interface KintoneApiResponse2 {
  records: KintoneApiRecord[];
  totalCount?: string;
}

interface KintoneApiRecord {
  Record_number: { value: string };
  ingredients_name: { value: string };
  ingredients_qrCode: { value: string };
  ingredients_Categories: { value: string };
  ingredients_unit: { value: string };
  ingredients_Registered_Date: { value: string };
  ingredients_inside_information: { value: string };
}

interface KintoneRecord {
    Record_number: string;
    ingredients_name: string;
    ingredients_qrCode: string;
    ingredients_Categories: string;
    ingredients_unit: string;
    ingredients_Registered_Date: string;
    ingredients_inside_information?: string;
}

interface RequiredKintoneRecord {
  Record_number: string;
  ingredients_name: string;
  ingredients_qrCode: string;
  ingredients_Registered_Date: string;
}

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const url = new URL(request.url);
    const page: number = parseInt(url.searchParams.get("page") || "1", 10);
    const limit: number = parseInt(url.searchParams.get("limit") || "10", 10);
    const offset: number = (page - 1) * limit;

    const { searchParams } = new URL(request.url);
    
    let query = ``;
    const search = searchParams.get("search");

    if (search) {
      // Supports partial match by container_id
      query += `(ingredients_qrCode like "${search}")`; // Wrap the condition in parentheses
    }

    query += ` order by Record_number desc limit ${limit} offset ${offset}`;
    // Fetch records with pagination
    const recordsResponse = await fetch(
      `${kintoneUrl}/records.json?app=${appId}&query=${encodeURIComponent(
        query
      )}`,
      {
        headers: {
          "X-Cybozu-API-Token": apiToken,
        },
      }
    );

    if (!recordsResponse.ok) {
      throw new Error("Failed to fetch records");
    }

    const recordsData: KintoneApiResponse = await recordsResponse.json();

    const records: KintoneRecord[] = recordsData.records.map((record) => ({
      Record_number: record.Record_number.value,
        ingredients_name: record.ingredients_name.value,
        ingredients_qrCode: record.ingredients_qrCode.value,
        ingredients_Categories: record.ingredients_Categories.value,
        ingredients_unit: record.ingredients_unit.value,
        ingredients_Registered_Date: record.ingredients_Registered_Date.value,
        ingredients_inside_information: record.ingredients_inside_information.value,
    }));

    let totalPages: number | null = null;
    if (page === 1) {
      let countQuery = ``;
      if (search) {
        countQuery += `(ingredients_qrCode like "${search}")`;
      }

      const countResponse = await fetch(
        `${kintoneUrl}/records.json?app=${appId}&query=${encodeURIComponent(
          countQuery
        )}&totalCount=true`,
        {
          headers: {
            "X-Cybozu-API-Token": apiToken,
          },
        }
      );

      if (!countResponse.ok) {
        throw new Error("Failed to fetch total count");
      }

      const countData: KintoneApiResponse2 = await countResponse.json();
      const totalRecords: number = parseInt(countData.totalCount || "0", 10);
      totalPages = Math.ceil(totalRecords / limit);
    }

    return NextResponse.json({ records, totalPages });
  } catch (error) {
    console.error("Error retrieving records:", error);
    return NextResponse.json(
      { error: "Error retrieving records" },
      { status: 500 }
    );
  }
}


export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body: KintoneRecord = await request.json();

    // Validate required fields
    const requiredFields: (keyof RequiredKintoneRecord)[] = [
        "ingredients_name",
        "ingredients_qrCode",
        "ingredients_Registered_Date",
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
    const checkQuery = `(ingredients_qrCode = "${body.ingredients_qrCode}")`;

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
      throw new Error("Failed to check for existing ingredients_qrCode");
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
        ingredients_name: { value: body.ingredients_name },
        ingredients_qrCode: { value: body.ingredients_qrCode },
        ingredients_Categories: {
          value: body.ingredients_Categories || null,
        },
        ingredients_Registered_Date: {
          value: body.ingredients_Registered_Date,
        },

        ingredients_unit: {
          value: body.ingredients_unit || null,
        },
        ingredients_inside_information: {
          value: body.ingredients_inside_information || null,
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

    if (body.ingredients_name) {
      updateFields.ingredients_name = { value: body.ingredients_name };
    }
    if (body.ingredients_qrCode) {
      updateFields.ingredients_qrCode = { value: body.ingredients_qrCode };
    }
    if (body.ingredients_Registered_Date) {
      updateFields.ingredients_Registered_Date = {
        value: body.ingredients_Registered_Date,
      };
    }
    
    if (body.ingredients_Categories !== undefined) {
      updateFields.ingredients_Categories = {
        value: body.ingredients_Categories || null, // Assign null if the value is an empty string
      };
    }
    if (body.ingredients_unit !== undefined) {
      updateFields.ingredients_unit = {
        value: body.ingredients_unit || null, // Assign null if the value is an empty string
      };
    }

     if (body.ingredients_inside_information !== undefined) {
       updateFields.ingredients_inside_information = {
         value: body.ingredients_inside_information || null, // Assign null if the value is an empty string
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

