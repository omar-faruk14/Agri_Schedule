import { NextResponse } from "next/server";

const kintoneUrl: string = `${process.env.NEXT_PUBLIC_KINTONE_BASE_URL}/k/v1`;
const apiToken: string = "waotN4cAsMn5e6nWTm2KR1UkoPfduqfeJmlKPcTu";
const appId: number = 111;


interface KintoneApiResponse {
  records: KintoneApiRecord[];
}

interface KintoneApiRecord {
  Record_number: { value: string };
  ingredients_name: { value: string };
  ingredients_qrCode: { value: string };
  ingredients_Categories: { value: string };
  ingredients_unit: { value: string };
  ingredients_Registered_Date: { value: string };
  ingredients_inside_information: { value: string };
}

interface KintoneRecord {
    Record_number: string;
    ingredients_name: string;
    ingredients_qrCode: string;
    ingredients_Categories: string;
    ingredients_unit: string;
    ingredients_Registered_Date: string;
    ingredients_inside_information: string;

}


export async function GET(request: Request): Promise<NextResponse> {
  try {
    
    const { searchParams } = new URL(request.url);
        const ingredients_qrCode = searchParams.get("ingredients_qrCode");
    
        if (!ingredients_qrCode) {
          return NextResponse.json(
            { error: "Missing bottle_QR_code parameter" },
            { status: 400 }
          );
        }
    
        const query = `(ingredients_qrCode = "${ingredients_qrCode}")`;
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
        ingredients_name: record.ingredients_name.value,
        ingredients_qrCode: record.ingredients_qrCode.value,
        ingredients_Categories: record.ingredients_Categories.value,
        ingredients_unit: record.ingredients_unit.value,
        ingredients_Registered_Date: record.ingredients_Registered_Date.value,
        ingredients_inside_information: record.ingredients_inside_information.value,
      })
    );

    return NextResponse.json(records);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error retrieving records" });
  }
}
