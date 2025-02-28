import { fetchData } from "@Om/app/utils/fetchdata"; // Adjust the path accordingly

export default async function Page() {
  const data = await fetchData<{ message: string }>(
    "http://localhost:3000/api/harvest"
  );
  console.log(data);

  return <div>{data.message}</div>;
}
