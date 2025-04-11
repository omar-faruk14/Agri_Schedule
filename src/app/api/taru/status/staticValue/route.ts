import { NextResponse } from "next/server";

const kintoneUrl: string = `${process.env.NEXT_PUBLIC_KINTONE_BASE_URL}/k/v1`;
const apiToken: string = "jrmkjLUA6BqzvglXZXfHAvHGJje6bySwRv3Z4rPG";
const appId: number = 105;

interface KintoneApiRecord {
  Record_number: { value: string };
  container_id: { value: string };
  container_status: { value: string };
  Borrower_Information: { value: string };
  typeCode: { value: string };
}

interface KintoneApiResponse {
  records: KintoneApiRecord[];
  totalCount?: string;
}

interface KintoneRecord {
  Record_number: string;
  container_id: string;
  container_status: string;
  Borrower_Information: string;
  typeCode: string;
}

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const url = new URL(request.url);
    const page: number = parseInt(url.searchParams.get("page") || "1", 10);
    const limit: number = parseInt(url.searchParams.get("limit") || "2", 10);
    const offset: number = (page - 1) * limit;

    const { searchParams } = new URL(request.url);
    const typeCode = searchParams.get("typeCode");

    if (!typeCode) {
      return NextResponse.json(
        { error: "Missing typeCode parameter" },
        { status: 400 }
      );
    }

    let query = `(typeCode = "${typeCode}")`;
    const search = searchParams.get("search");

    if (search) {
      // Supports partial match by container_id
      query += ` and (container_id like "${search}")`;
    }

    query += ` order by Record_number desc limit ${limit} offset ${offset}`;
    // Fetch records with pagination
    const recordsResponse = await fetch(
      `${kintoneUrl}/records.json?app=${appId}&query=${encodeURIComponent(
        query
      )}`,
      {
        headers: {
          "X-Cybozu-API-Token": apiToken,
        },
      }
    );

    if (!recordsResponse.ok) {
      throw new Error("Failed to fetch records");
    }

    const recordsData: KintoneApiResponse = await recordsResponse.json();

    const records: KintoneRecord[] = recordsData.records.map((record) => ({
      Record_number: record.Record_number.value,
      container_id: record.container_id.value,
      container_status: record.container_status.value,
      Borrower_Information: record.Borrower_Information.value,
      typeCode: record.typeCode.value,
    }));

    let totalPages: number | null = null;

    // Fetch total count only on the first page request
    // if (page === 1) {
    //   const countResponse = await fetch(
    //     `${kintoneUrl}/records.json?app=${appId}&query=${encodeURIComponent(
    //       ""
    //     )}&totalCount=true`,
    //     {
    //       headers: {
    //         "X-Cybozu-API-Token": apiToken,
    //       },
    //     }
    //   );

    //   if (!countResponse.ok) {
    //     throw new Error("Failed to fetch total count");
    //   }
    // Fetch total count for the filtered records (same filter as query)
    if (page === 1) {
      let countQuery = `(typeCode = "${typeCode}")`;
      if (search) {
        countQuery += ` and (container_id like "${search}")`;
      }

      const countResponse = await fetch(
        `${kintoneUrl}/records.json?app=${appId}&query=${encodeURIComponent(
          countQuery
        )}&totalCount=true`,
        {
          headers: {
            "X-Cybozu-API-Token": apiToken,
          },
        }
      );

      if (!countResponse.ok) {
        throw new Error("Failed to fetch total count");
      }

      const countData: KintoneApiResponse = await countResponse.json();
      const totalRecords: number = parseInt(countData.totalCount || "0", 10);
      totalPages = Math.ceil(totalRecords / limit);
    }

    return NextResponse.json({ records, totalPages });
  } catch (error) {
    console.error("Error retrieving records:", error);
    return NextResponse.json(
      { error: "Error retrieving records" },
      { status: 500 }
    );
  }
}
