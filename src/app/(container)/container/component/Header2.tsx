"use client";

import { useSidebar } from "./SidebarContext";
import { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import styles from "./Header2.module.css";

export default function Header2() {
  const { toggleSidebar } = useSidebar();
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  return (
    <nav className={`main-header navbar navbar-expand ${styles.navbar}`}>
      <ul className="navbar-nav">
        <li className="nav-item d-block d-lg-none">
          <button
            className={`nav-link ${styles.menuButton}`}
            onClick={toggleSidebar}
          >
            <i className="fas fa-bars" />
          </button>
        </li>

        <li className="nav-item d-none d-sm-inline-block">
          <a href="/" className={`nav-link ${styles.navLink}`}>
            ホーム
          </a>
        </li>
      </ul>

      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <button
            className={`nav-link ${styles.fullScreen}`}
            onClick={handleFullScreen}
          >
            <i
              className={
                isFullScreen ? "fas fa-compress" : "fas fa-expand-arrows-alt"
              }
            />
          </button>
        </li>
      </ul>
    </nav>
  );
}
