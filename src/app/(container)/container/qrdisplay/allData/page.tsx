// components/TableComponent.tsx
"use client";
import Header2 from "@Om/app/(container)/container/component/Header2";
import Sidebar2 from "@Om/app/(container)/container/component/Sidebar2";
type ContainerData = {
  container_id: string;
  container_status: string;
};

const generateDummyData = (): ContainerData[] => {
  return Array.from({ length: 5000 }, (_, index) => ({
    container_id: `ID-${index + 1}`,
    container_status: index % 2 === 0 ? "貸出中" : "返却済み",
  }));
};

const TableComponent = () => {
  const data = generateDummyData();

  return (
    <>
      <Header2 />
      <Sidebar2 />
      <div className="content-wrapper overflow-x-hidden overflow-y-auto">
        <div className="card">
          <div className="card-body">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>コンテナ QRコード</th>
                  <th>コンテナのステータス</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index}>
                    <td>{item.container_id}</td>
                    <td>{item.container_status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default TableComponent;
