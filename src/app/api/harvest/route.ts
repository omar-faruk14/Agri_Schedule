import { NextResponse } from "next/server";

const kintoneUrl: string = `https://emi-lab-osaka.cybozu.com/k/v1`;
const apiToken: string = "c9sYkk9S02uDQzYX9AqsLQSIH3gLYxzSSh1xQXvW";
const appId: number = 97;

export const dynamic = 'force-dynamic';
interface KintoneApiResponse {
  records: KintoneApiRecord[];
}

interface KintoneApiRecord {
  Record_number: { value: string };
  harvest_start_date: { value: string };
  harvest_start_time: { value: string };
  harvest_end_date: { value: string };
  harvest_end_time: { value: string };
  column_code: { value: string };
}

interface KintoneRecord {
  Record_number: string;
  harvest_start_date: string;
  harvest_start_time: string;
  harvest_end_date: string;
  harvest_end_time: string;
  column_code: string;
}

export async function GET(): Promise<NextResponse> {
  try {
    const response = await fetch(`${kintoneUrl}/records.json?app=${appId}`, {
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
        harvest_start_date: record.harvest_start_date.value,
        harvest_start_time: record.harvest_start_time.value,
        harvest_end_date: record.harvest_end_date.value,    
        harvest_end_time: record.harvest_end_time.value,
        column_code: record.column_code.value,
      })
    );

    return NextResponse.json(records);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error retrieving records" });
  }
}
