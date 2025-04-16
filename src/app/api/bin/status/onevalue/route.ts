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


export async function GET(request: Request): Promise<NextResponse> {
  try {
    
    const { searchParams } = new URL(request.url);
        const bottle_QR_code = searchParams.get("bottle_QR_code");
    
        if (!bottle_QR_code) {
          return NextResponse.json(
            { error: "Missing bottle_QR_code parameter" },
            { status: 400 }
          );
        }
    
        const query = `(bottle_QR_code = "${bottle_QR_code}")`;
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
