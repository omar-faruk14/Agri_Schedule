import { NextResponse } from "next/server";

const kintoneUrl: string = `${process.env.NEXT_PUBLIC_KINTONE_BASE_URL}/k/v1`;
const apiToken: string = "xhCmByL6GxBm1SxQ8uYXJzQVTYd2eM5kuGSADFJM";
const appId: number = 104;
const limit: number = 100; 


interface KintoneApiResponse {
  records: KintoneApiRecord[];
}

interface KintoneApiRecord {
  Record_number: { value: string };
  container_id: { value: string };
  container_status: { value: string };
}

interface KintoneRecord {
  Record_number: string;
  container_id: string;
  container_status: string;
}


export async function GET(): Promise<NextResponse> {
  let allRecords: KintoneRecord[] = [];
  let offset: number = 0;

  try {
    while (true) {
      const response = await fetch(
        `${kintoneUrl}/records.json?app=${appId}&query=limit ${limit} offset ${offset}`,
        {
          headers: {
            "X-Cybozu-API-Token": apiToken,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch records");
      }

      const data: KintoneApiResponse = await response.json();
      const records: KintoneRecord[] = data.records.map(
        (record: KintoneApiRecord) => ({
          Record_number: record.Record_number.value,
          container_id: record.container_id.value,
          container_status: record.container_status.value,
        })
      );

      if (records.length === 0) {
        break; // Exit loop when no more records are returned
      }

      allRecords = allRecords.concat(records);
      offset += limit; // Update offset for next batch
    }

    allRecords.sort(
      (a, b) => parseInt(a.Record_number) - parseInt(b.Record_number)
    );
    return NextResponse.json(allRecords);
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