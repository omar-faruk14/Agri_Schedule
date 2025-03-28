"use client";

import { useSidebar } from "./SidebarContext";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import styles from "./Sidebar2.module.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function Sidebar2() {
  const pathname = usePathname();
  const { isSidebarVisible, closeSidebar } = useSidebar();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Define all menu items with submenus
  const menuItems = [
    {
      key: "container",
      label: "コンテナ管理",
      icon: "fas fa-boxes",
      subMenu: [
        {
          label: "コンテナ登録",
          href: "/container/index",
          icon: "fas fa-archive",
        },
        {
          label: "ステータス管理",
          href: "/container/status",
          icon: "fas fa-clipboard-list",
        },
      ],
    },
    {
      key: "settings",
      label: "1",
      icon: "fas fa-cog",
      subMenu: [
        { label: "アカウント", href: "/settings/account", icon: "fas fa-user" },
        { label: "通知", href: "/settings/notifications", icon: "fas fa-bell" },
      ],
    },
  ];

  // State to track which submenus are open
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
    const initialOpenState: Record<string, boolean> = {};
    menuItems.forEach((item) => {
      // Keep open if the current path matches any submenu
      initialOpenState[item.key] = item.subMenu.some(
        (sub) => sub.href === pathname
      );
    });
    return initialOpenState;
  });

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        isSidebarVisible &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        closeSidebar();
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isSidebarVisible, closeSidebar]);

  // Function to toggle submenus
  const toggleMenu = (key: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <aside
      ref={sidebarRef}
      className={`${styles.sidebar} ${
        isSidebarVisible ? styles.sidebarVisible : styles.sidebarHidden
      }`}
    >
      <Link href="/container/index" className={styles.brandLink}>
        <div className={styles.brandTextContainer}>
          <span className={styles.brandTextFujimi}>在庫</span>
          <span className={styles.brandTextMaas}>管理</span>
        </div>
      </Link>
      <div className={styles.sidebarContent}>
        <nav>
          <ul className={styles.navList}>
            {menuItems.map((menu) => (
              <li key={menu.key}>
                {/* Parent Menu Item */}
                <div
                  className={`${styles.navItem} ${
                    openMenus[menu.key] ? styles.active : ""
                  }`}
                  onClick={() => toggleMenu(menu.key)}
                >
                  <i className={menu.icon}></i>
                  <span>{menu.label}</span>
                </div>

                {/* Submenu */}
                {openMenus[menu.key] && (
                  <ul className={styles.subNavList}>
                    {menu.subMenu.map((sub) => (
                      <li key={sub.href}>
                        <Link
                          href={sub.href}
                          className={`${styles.navItem} ${
                            pathname === sub.href ? styles.active : ""
                          }`}
                        >
                          <i className={sub.icon}></i>
                          <span>{sub.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}

            {/* Example of a menu without submenus */}
            <li>
              <Link
                href="/container/2"
                className={`${styles.navItem} ${
                  pathname === "/container/2" ? styles.active : ""
                }`}
              >
                <i className="fas fa-archive"></i>
                <span>2</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}
