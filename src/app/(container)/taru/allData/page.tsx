"use client";

import { useState, useEffect } from "react";
import Header2 from "@Om/app/(container)/clist/component/Header2";
import Sidebar2 from "@Om/app/(container)/clist/component/Sidebar2";
import LoadingSpinner from "@Om/app/(container)/clist/component/LoadingFile";
import * as styles from "@Om/app/(container)/clist/styles/pageh.css";


type ContainerData = {
  Record_number: string;
  container_id: string;
  container_status: string;
  Borrower_Information: string;
  typeCode: string;
};

const TableComponent = () => {
  const [data, setData] = useState<ContainerData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const limit: number = 10; // Matches backend limit
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [search, setSearch] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>(""); // for controlled input

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/taru/status/staticValue?page=${page}&limit=${limit}&typeCode=taru&search=${encodeURIComponent(
            search
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
  }, [page, search]);
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
                  <h2 className={`${styles.h2_map}`}>樽一覧</h2>
                </div>
              </div>
            </div>
            <div className={styles.searchWrapper}>
              <div className={styles.searchBox}>
                <span className={styles.searchIcon}>🔍</span>
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="樽 QRコードで検索..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const trimmed = inputValue.trim();
                      if (trimmed === "") return;
                      if (trimmed !== search) {
                        setSearch(trimmed);
                        setPage(1);
                      }
                    }
                  }}
                />

                {inputValue && (
                  <button
                    className={styles.clearButton}
                    onClick={() => {
                      if (search !== "") {
                        setSearch("");
                        setPage(1);
                      }
                      setInputValue("");
                    }}
                    type="button"
                  >
                    ✖
                  </button>
                )}

                <button
                  className={styles.searchButton}
                  onClick={() => {
                    const trimmed = inputValue.trim();
                    if (trimmed === "") return; // ✅ extra safety
                    if (trimmed !== search) {
                      setSearch(trimmed);
                      setPage(1);
                    }
                  }}
                  disabled={inputValue.trim() === ""}
                >
                  検索
                </button>
              </div>
            </div>

            {loading && <LoadingSpinner />}
            {error && <p className="text-danger">Error: {error}</p>}
            {!loading && !error && (
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>樽 QRコード</th>
                    <th>樽のステータス</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => (
                    <tr key={item.Record_number}>
                      <td>
                        <a href={`/taru/qrDisplayKanri/${item.container_id}`}>
                          {item.container_id}
                        </a>
                      </td>
                      <td>{item.container_status}</td>
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

export default TableComponent;

