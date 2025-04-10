import { NextResponse } from "next/server";

const kintoneUrl: string = `${process.env.NEXT_PUBLIC_KINTONE_BASE_URL}/k/v1`;
const apiToken: string = "kIbAeZvM4Xl4PHBFWopaypU8HmZ5mBfaPFtg6hIx";
const appId: number = 106;
const limit: number = 100; 


interface KintoneApiResponse {
  records: KintoneApiRecord[];
}

interface KintoneApiRecord {
  Record_number: { value: string };
  new_container_id: { value: string };
}

interface KintoneRecord {
  Record_number: string;
  new_container_id: string;
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
          new_container_id: record.new_container_id.value,
        })
      );


      console.log(records); 
      if (records.length === 0) {
        break; 
      }

      allRecords = allRecords.concat(records);
      offset += limit; 
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
    const requiredFields: (keyof KintoneRecord)[] = ["new_container_id"];

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
        new_container_id: { value: body.new_container_id },
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