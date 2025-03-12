import { NextResponse } from "next/server";

const kintoneUrl: string = `https://emi-lab-osaka.cybozu.com/k/v1`;
const apiToken: string = "SQeZ9iHJOUipZ2vyCVXJIGL6rjysfWqeS7HSkWN4";
const appId: number = 101;

interface KintoneApiResponse {
  records: KintoneApiRecord[];
}

interface KintoneApiRecord {
  Record_number: { value: string };
  code: { value: string };
  task: { value: string };
  status: { value: string };
  latitude: { value: string };
  longitude: { value: string };
}

interface KintoneRecord {
  Record_number: string;
  code: string;
  task: string;
  status: string;
  latitude: string;
  longitude: string;
}

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const task = searchParams.get("task");
    if (!task) {
      return NextResponse.json(
        { error: "Missing task parameter" },
        { status: 400 }
      );
    }
    const query = `(task = "${task}")`;
    const response = await fetch(
      `${kintoneUrl}/records.json?app=${appId}&query=${encodeURIComponent(
        query
      )}`,
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
        code: record.code.value,
        task: record.task.value,
        status: record.status.value,
        latitude: record.latitude.value,
        longitude: record.longitude.value,
      })
    );

    return NextResponse.json(records);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error retrieving records" });
  }
}
