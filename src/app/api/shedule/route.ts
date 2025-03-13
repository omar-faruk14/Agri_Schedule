import { NextResponse } from "next/server";

const kintoneUrl: string = `https://emi-lab-osaka.cybozu.com/k/v1`;
const apiToken: string = "7szxwrgC4CdRCoABMCnXoFj7QZ9Sjtmb5QGttuin";
const appId: number = 96;

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
  latiude: { value: string };
  longitude: { value: string };
  publish: { value: string };
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
  latitude: string;
  longitude: string;
  publish: string;
}

interface KintoneApiResponse {
  id: string;
  revision: string;
}

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const startTime_date = searchParams.get("startTime_date");

    if (!startTime_date) {
      return NextResponse.json(
        { error: "Missing startTime_date parameter" },
        { status: 400 }
      );
    }

    const query = `(startTime_date = "${startTime_date}")`;
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
        title: record.title.value,
        task: record.task.value,
        details: record.details.value,
        code: record.code.value,
        status: record.status.value,
        startTime_date: record.startTime_date.value,
        startTime_time: record.startTime_time.value,
        endTime_date: record.endTime_date.value,
        endTime_time: record.endTime_time.value,
        latitude: record.latiude.value,
        longitude: record.longitude.value,
        publish: record.publish.value,
      })
    );

    return NextResponse.json(records);
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
      "title",
      "task",
      "details",
      "code",
      "status",
      "startTime_date",
      "startTime_time",
      "endTime_date",
      "endTime_time",
      "latitude",
      "longitude",
      "publish",
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
        title: { value: body.title },
        task: { value: body.task },
        details: { value: body.details },
        code: { value: body.code },
        status: { value: body.status },
        startTime_date: { value: body.startTime_date },
        startTime_time: { value: body.startTime_time },
        endTime_date: { value: body.endTime_date },
        endTime_time: { value: body.endTime_time },
        latitude: { value: body.latitude },
        longitude: { value: body.longitude },
        publish: { value: body.publish},
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

