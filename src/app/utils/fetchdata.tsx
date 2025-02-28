export async function fetchData<T>(url: string,revalidate?: number): Promise<T> {
  try {
    const response = await fetch(url, {
      next: { revalidate: revalidate || 10 }, 
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    const data: T = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch data:", error);
    throw error;
  }
}
