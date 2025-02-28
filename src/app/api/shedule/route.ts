import { NextResponse } from "next/server";

const kintoneUrl: string = `https://emi-lab-osaka.cybozu.com/k/v1`;
const apiToken: string = "7szxwrgC4CdRCoABMCnXoFj7QZ9Sjtmb5QGttuin";
const appId: number = 96;
export const dynamic: string = "force-dynamic";

interface KintoneApiResponse {
  records: KintoneApiRecord[];
}

interface KintoneApiRecord {
  Record_number: { value: string };
  title: { value: string };
  task: { value: string };
  details: { value: string };
  code: { value: string };
  status: { value: string };
  startTime_date: { value: string };
  startTime_time: { value: string };
  endTime_date: { value: string };
  endTime_time: { value: string };
}

interface KintoneRecord {
  Record_number: string;
  title: string;
  task: string;
  details: string;
  code: string;
  status: string;
  startTime_date: string ;
  startTime_time: string ;
  endTime_date: string ;
  endTime_time: string ;
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
        title: record.title.value,
        task: record.task.value,
        details: record.details.value,
        code: record.code.value,
        status: record.status.value,
        startTime_date: record.startTime_date.value,
        startTime_time: record.startTime_time.value,
        endTime_date: record.endTime_date.value,
        endTime_time: record.endTime_time.value,
      })
    );

    return NextResponse.json(records);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error retrieving records" });
  }
}
