import React from "react";
import Header2 from "@Om/app/(container)/clist/component/Header2";
import Sidebar2 from "@Om/app/(container)/clist/component/Sidebar2";
import Footer2 from "@Om/app/(container)/clist/component/Footer";
import * as styles from "@Om/app/(container)/clist/styles/pageh.css";

const Dashboard: React.FC = () => {
  return (
    <>
      <Header2 />
      <Sidebar2 />
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col">
                  <h2 className={`${styles.h2_map}`}>ダッシュボード</h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="content">
          <div className="container-fluid">
            {/* Taru Section */}
            <div className="row">
              <div className="col-12">
                <h4 className="mb-3">
                  <i className="fas fa-boxes mr-2" />
                  樽管理
                </h4>
              </div>

              <div className="col-md-4">
                <div className="small-box bg-danger">
                  <div className="inner">
                    <h4>樽の登録</h4>
                    <p>新しい樽を登録</p>
                  </div>
                  <div className="icon">
                    <i className="fas fa-plus-circle" />
                  </div>
                  <a href="/taru/index" className="small-box-footer">
                    移動 <i className="fas fa-arrow-circle-right" />
                  </a>
                </div>
              </div>

              <div className="col-md-4">
                <div className="small-box bg-success">
                  <div className="inner">
                    <h4>ステータス管理</h4>
                    <p>登録された樽の状況を確認</p>
                  </div>
                  <div className="icon">
                    <i className="fas fa-tasks" />
                  </div>
                  <a href="/taru/status" className="small-box-footer">
                    移動 <i className="fas fa-arrow-circle-right" />
                  </a>
                </div>
              </div>

              <div className="col-md-4">
                <div className="small-box bg-warning">
                  <div className="inner">
                    <h4>情報一覧</h4>
                    <p>すべての樽情報の確認・編集・QRコード生成が可能</p>
                  </div>
                  <div className="icon">
                    <i className="fas fa-list" />
                  </div>
                  <a href="/taru/allData" className="small-box-footer">
                    移動 <i className="fas fa-arrow-circle-right" />
                  </a>
                </div>
              </div>
            </div>

            {/* Container Section */}
            <div className="row mt-5">
              <div className="col-12">
                <h4 className="mb-3">
                  <i className="fas fa-cube mr-2" />
                  コンテナ管理
                </h4>
              </div>

              <div className="col-md-4">
                <div className="small-box bg-primary">
                  <div className="inner">
                    <h4>コンテナの登録</h4>
                    <p>新しいコンテナを登録</p>
                  </div>
                  <div className="icon">
                    <i className="fas fa-plus-square" />
                  </div>
                  <a href="/container/index" className="small-box-footer">
                    移動 <i className="fas fa-arrow-circle-right" />
                  </a>
                </div>
              </div>

              <div className="col-md-4">
                <div className="small-box bg-success">
                  <div className="inner">
                    <h4>ステータス管理</h4>
                    <p>登録されたコンテナの状況を確認</p>
                  </div>
                  <div className="icon">
                    <i className="fas fa-clipboard-list" />
                  </div>
                  <a href="/container/status" className="small-box-footer">
                    移動 <i className="fas fa-arrow-circle-right" />
                  </a>
                </div>
              </div>

              <div className="col-md-4">
                <div className="small-box bg-warning">
                  <div className="inner">
                    <h4>情報一覧</h4>
                    <p>すべてのコンテナ情報の確認・編集・QRコード生成が可能</p>

                  </div>
                  <div className="icon">
                    <i className="fas fa-list" />
                  </div>
                  <a href="/container/allData" className="small-box-footer">
                    移動 <i className="fas fa-arrow-circle-right" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer2 />
    </>
  );
};

export default Dashboard;
