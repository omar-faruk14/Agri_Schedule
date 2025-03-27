// "use client";

// import { usePathname } from "next/navigation";
// import { useState, useEffect } from "react";
// import styles from "./Sidebar2.module.css";
// import Link from "next/link";
// import "@fortawesome/fontawesome-free/css/all.min.css";

// export default function Sidebar2() {
//   const pathname = usePathname();
//   const [isSidebarVisible, setSidebarVisible] = useState<boolean>(false);

//   useEffect(() => {
//     if (window.innerWidth < 768) {
//       setSidebarVisible(false);
//     }
//   }, [pathname]);

//   const handleLinkClick = () => {
//     setSidebarVisible(false);
//   };

//   useEffect(() => {
//     const toggleButton = document.querySelector('[data-widget="pushmenu"]');
//     if (toggleButton) {
//       const handleToggleClick = () => {
//         setSidebarVisible((prev) => !prev);
//       };
//       toggleButton.addEventListener("click", handleToggleClick);
//       return () => {
//         toggleButton.removeEventListener("click", handleToggleClick);
//       };
//     }
//   }, []);

//   return (
//     <>
//       <aside
//         className={`main-sidebar sidebar-dark-primary elevation-4 overflow-auto ${
//           isSidebarVisible ? styles.sidebarVisible : styles.sidebarHidden
//         }`}
//       >
//         <Link
//           href="/container/index"
//           className={`${styles.brandLink} brand-link`}
//           onClick={handleLinkClick}
//         >
//           <div className={styles.brandTextContainer}>
//             <span className={styles.brandTextFujimi}>コン</span>
//             <span className={styles.brandTextMaas}>テナ</span>
//           </div>
//         </Link>
//         {/* Sidebar */}
//         <div className="sidebar">
//           <nav className="mt-2">
//             <ul
//               className="nav nav-pills nav-sidebar flex-column"
//               data-widget="treeview"
//               role="menu"
//               data-accordion="false"
//             >
//               <li className="nav-item">
//                 <Link
//                   href="/container/index"
//                   className={`nav-link ${
//                     pathname === "/container/index" ? `${styles.active}` : ""
//                   }`}
//                   onClick={handleLinkClick}
//                 >
//                   <i className="nav-icon fas fa-tachometer-alt"></i>
//                   <p>コンテナを登録</p>
//                 </Link>
//               </li>
//             </ul>
//           </nav>
//         </div>
//       </aside>
//     </>
//   );
// }



"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "./Sidebar2.module.css";
import Link from "next/link";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function Sidebar2() {
  const pathname = usePathname();
  const [isSidebarVisible, setSidebarVisible] = useState<boolean>(false);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarVisible(false);
    }
  }, []);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarVisible(false);
    }
  }, [pathname]);

  const handleLinkClick = () => {
    setSidebarVisible(false);
  };

  useEffect(() => {
    const toggleButton = document.querySelector('[data-widget="pushmenu"]');
    if (toggleButton) {
      const handleToggleClick = (event: Event) => {
        event.stopPropagation();
        setSidebarVisible((prev) => !prev);
      };
      toggleButton.addEventListener("click", handleToggleClick);
      return () => {
        toggleButton.removeEventListener("click", handleToggleClick);
      };
    }
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (isSidebarVisible) {
        const sidebarElement = document.querySelector("." + styles.sidebar);
        const toggleButton = document.querySelector('[data-widget="pushmenu"]');
        if (
          sidebarElement &&
          !sidebarElement.contains(event.target as Node) &&
          (!toggleButton || !toggleButton.contains(event.target as Node))
        ) {
          setSidebarVisible(false);
        }
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isSidebarVisible]);

  return (
    <>
      <aside
        className={`${styles.sidebar} ${
          isSidebarVisible ? styles.sidebarVisible : styles.sidebarHidden
        }`}
      >
        <Link
          href="/container/index"
          className={styles.brandLink}
          onClick={handleLinkClick}
        >
          <div className={styles.brandTextContainer}>
            <span className={styles.brandTextFujimi}>コン</span>
            <span className={styles.brandTextMaas}>テナ</span>
          </div>
        </Link>
        <div className={styles.sidebarContent}>
          <nav>
            <ul className={styles.navList}>
              <li>
                <Link
                  href="/container/index"
                  className={`${styles.navItem} ${
                    pathname === "/container/index" ? styles.active : ""
                  }`}
                  onClick={handleLinkClick}
                >
                  <i className="fas fa-tachometer-alt"></i>
                  <span>コンテナを登録</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}