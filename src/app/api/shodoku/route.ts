import { NextResponse } from "next/server";

const kintoneUrl: string = `https://emi-lab-osaka.cybozu.com/k/v1`;
const apiToken: string = "mtKb7kFALxvN1UYBxl7JJSYS3UKPRAnGeVfrRkVA";
const appId: number = 99;

export const dynamic: string = "force-dynamic";

interface KintoneApiResponse {
  records: KintoneApiRecord[];
}

interface KintoneApiRecord {
  Record_number: { value: string };
  itsu: { value: string };
  tenki: { value: string };
  nichi: { value: string };
  ji: { value: string };
  byoki: { value: string };
  mushi: { value: string };
  kakunin: { value: string };
  column_code: { value: string };
}

interface KintoneRecord {
  Record_number: string;
  itsu: string;
  tenki: string;
  nichi: string;
  ji: string;
  byoki: string;
  mushi: string;
  kakunin: string;
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
        itsu: record.itsu.value,
        tenki: record.tenki.value,
        nichi: record.nichi.value,
        ji: record.ji.value,
        byoki: record.byoki.value,
        mushi: record.mushi.value,
        kakunin: record.kakunin.value,
        column_code: record.column_code.value,
      })
    );

    return NextResponse.json(records);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error retrieving records" });
  }
}
