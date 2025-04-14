import { NextResponse } from "next/server";

const kintoneUrl: string = `${process.env.NEXT_PUBLIC_KINTONE_BASE_URL}/k/v1`;
const apiToken: string = "xhCmByL6GxBm1SxQ8uYXJzQVTYd2eM5kuGSADFJM";
const appId: number = 104;

interface KintoneApiRecord {
  Record_number: { value: string };
  container_id: { value: string };
}

interface KintoneApiResponse {
  records: KintoneApiRecord[];
  totalCount?: string;
}

interface KintoneRecord {
  Record_number: string;
  container_id: string;
}
export const dynamic = "force-dynamic";
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const url = new URL(request.url);
    const page: number = parseInt(url.searchParams.get("page") || "1", 10);
    const limit: number = parseInt(url.searchParams.get("limit") || "2", 10);
    const offset: number = (page - 1) * limit;

    const { searchParams } = new URL(request.url);
    let query = ``;
    const search = searchParams.get("search");

    if (search) {
      // Supports partial match by new_container_id
      query += `and (container_id like "${search}")`;
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
      let countQuery = ``;
      if (search) {
        countQuery += `and (container_id like "${search}")`;
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


export async function DELETE(request: Request): Promise<NextResponse> {
  try {
    const url = new URL(request.url);
    const recordId = url.searchParams.get("Record_number");

    if (!recordId) {
      console.error("Record_number パラメータが見つかりません。");
      return NextResponse.json(
        { error: "Record_number パラメータが必要です。" },
        { status: 400 }
      );
    }

    console.log("削除対象のレコードID:", recordId);

    const res = await fetch(`${kintoneUrl}/records.json`, {
      method: "DELETE",
      headers: {
        "X-Cybozu-API-Token": apiToken,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        app: appId,
        ids: [recordId],
      }),
    });


    if (!res.ok) {
      const errorData = await res.json();
      console.error("レコード削除エラー:", errorData);
      return NextResponse.json(
        { error: "レコード削除中にエラーが発生しました。" },
        { status: res.status }
      );
    }

    const data = await res.json();

    console.log("レコードの削除に成功しました。");

    return NextResponse.json({
      message: "削除に成功しました。",
      response: data,
    });
  } catch (error) {
    console.error("レコード削除中に予期しないエラーが発生しました:", error);
    return NextResponse.json(
      { error: "レコード削除中に予期しないエラーが発生しました。" },
      { status: 500 }
    );
  }
}
