"use client";

import { useState, useEffect } from "react";
import LoadingSpinner from "@Om/app/(container)/clist/component/LoadingFile";
import * as styles from "@Om/app/(container)/clist/styles/pageh.css";
import Swal from "sweetalert2";
import Header2 from "@Om/app/(container)/clist/component/Header2";
import Sidebar2 from "@Om/app/(container)/clist/component/Sidebar2";

type ContainerData = {
  Record_number: string;
  container_id: string;
};

const ContainerRegisterTable = () => {
  const [data, setData] = useState<ContainerData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const limit: number = 10; // Matches backend limit
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // 500ms delay for debounce

    return () => clearTimeout(timer); // Cleanup on each search change
  }, [search]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/taru/register/DynamicRegister?page=${page}&limit=${limit}&typeCode=container&search=${encodeURIComponent(
            debouncedSearch
          )}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setData(result.records);
        if (result.totalPages !== undefined) {
          setTotalPages(result.totalPages);
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, debouncedSearch]);


  const handleDelete = async (recordId: string) => {
    const result = await Swal.fire({
      title: "削除してもよろしいですか？",
      html: "この操作は元に戻せません！<br>この画面から削除しても、「樽登録」セクションからのみ削除されます。すでに使用中のステータスになっている樽には影響しません。",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "はい、削除します",
      cancelButtonText: "キャンセル",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(
          `/api/taru/register/DynamicRegister?Record_number=${recordId}`,
          {
            method: "DELETE",
          }
        );

        if (!res.ok) {
          throw new Error("削除に失敗しました");
        }

        Swal.fire("削除成功", "レコードは削除されました。", "success");

        // Remove the deleted item from state
        setData((prev) =>
          prev.filter((item) => item.Record_number !== recordId)
        );
      } catch (err) {
        console.error("削除エラー:", err);
        Swal.fire("エラー", "レコード削除中にエラーが発生しました。", "error");
      }
    }
  };

  return (
    <>
      <Header2 />
      <Sidebar2 />
      <div className="content-wrapper overflow-x-hidden overflow-y-auto">
        <div className="card">
          <div className="card-body">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col">
                  <h2 className={`${styles.h2_map}`}>樽を登録一覧</h2>
                </div>
              </div>
            </div>
            <input
              type="text"
              className="form-control"
              placeholder="樽 QRコードで検索..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />

            {loading && <LoadingSpinner />}
            {error && <p className="text-danger">Error: {error}</p>}
            {!loading && !error && (
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>樽QRコード</th>
                    <th>行動</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => (
                    <tr key={item.Record_number}>
                      <td>{item.container_id}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(item.Record_number)}
                        >
                          削除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {/* Pagination Controls */}
            <div className="d-flex justify-content-center mt-3">
              <button
                className="btn btn-primary mx-2"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
              >
                前へ
              </button>
              <span>
                ページ {page} {totalPages ? `／ ${totalPages}` : ""}
              </span>
              <button
                className="btn btn-primary mx-2"
                onClick={() =>
                  setPage((prev) =>
                    totalPages ? Math.min(prev + 1, totalPages) : prev + 1
                  )
                }
                disabled={totalPages !== null && page >= totalPages}
              >
                次へ
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContainerRegisterTable;
