import { NextResponse } from "next/server";

const kintoneUrl: string = "https://emi-lab-osaka.cybozu.com/k/v1";
const apiToken: string = "J8L0bzkzlNqflDQhhhpvR5LuryHyoZunzpQX5c7M";
const appId: number = 103;
const limit: number = 100; 

interface KintoneApiResponse {
  records: KintoneApiRecord[];
}

interface KintoneApiRecord {
  Record_number: { value: string };
  longitude: { value: string };
  latitude: { value: string };
  code: { value: string };
  comment_2: { value: string };
}

interface KintoneRecord {
  Record_number: string;
  longitude: string;
  latitude: string;
  code: string;
  comment_2: string;
}
export const dynamic = "force-dynamic";
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
          longitude: record.longitude.value,
          latitude: record.latitude.value,
          code: record.code.value,
          comment_2: record.comment_2.value,
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
