import { NextResponse } from "next/server";

const kintoneUrl: string = `https://emi-lab-osaka.cybozu.com/k/v1`;
const apiToken: string = "G1vLZ5MToh4UJCXBaTHQTnHmRp4inKfAmHSvzymo";
const appId: number = 100;

export const dynamic: string = "force-dynamic";

interface KintoneApiResponse {
  records: KintoneApiRecord[];
}

interface KintoneApiRecord {
  Record_number: { value: string };
  yatta_date: { value: string };
  yatta_koto: { value: string };

}

interface KintoneRecord {
  Record_number: string;
  yatta_date: string;
  yatta_koto: string;
}


export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const yatta_date = searchParams.get("yatta_date");
    if (!yatta_date) {
      return NextResponse.json(
        { error: "Missing startTime_date parameter" },
        { status: 400 }
      );
    }
    const query = `(yatta_date = "${yatta_date}")`;
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
        yatta_date: record.yatta_date.value,
        yatta_koto: record.yatta_koto.value,
      })
    );

    return NextResponse.json(records);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error retrieving records" });
  }
}
