"use client";

import { useSidebar } from "./SidebarContext";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import styles from "@Om/app/(container)/container/styles/Sidebar2.module.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import menuItemsData from "@Om/app/(container)/container/component/menuItems.json"; 
// Define the interface for sub-menu items
interface SubMenuItem {
  label: string;
  href: string;
  icon: string;
}

// Define the interface for menu items (including main and sub menus)
interface MenuItem {
  key: string;
  label: string;
  icon: string;
  href: string | null; // null means this item is a parent with subMenu
  subMenu: SubMenuItem[]; // Array of sub-menu items
}

export default function Sidebar2() {
  const pathname = usePathname();
  const { isSidebarVisible, closeSidebar } = useSidebar();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Explicitly type the menuItems as an array of MenuItem
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
    const initialOpenState: Record<string, boolean> = {};
    menuItemsData.forEach((item: MenuItem) => {
      initialOpenState[item.key] = item.subMenu.some(
        (sub: SubMenuItem) => sub.href === pathname
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
            {menuItemsData.map((menu: MenuItem) => (
              <li key={menu.key}>
                {/* If the menu has a link, render it as a simple item */}
                {menu.href ? (
                  <Link
                    href={menu.href}
                    className={`${styles.navItem} ${
                      pathname === menu.href ? styles.active : ""
                    }`}
                  >
                    <i className={menu.icon}></i>
                    <span>{menu.label}</span>
                  </Link>
                ) : (
                  <>
                    {/* For items that don't have a direct link (parent menu) */}
                    <div
                      className={`${styles.navItem} ${
                        openMenus[menu.key] ? styles.active : ""
                      }`}
                      onClick={() => toggleMenu(menu.key)}
                    >
                      <i className={menu.icon}></i>
                      <span>{menu.label}</span>
                    </div>
                    {/* If this menu item is open, show its sub-menu */}
                    {openMenus[menu.key] && (
                      <ul className={styles.subMenu}>
                        {menu.subMenu.map((sub: SubMenuItem) => (
                          <li key={sub.href}>
                            <Link
                              href={sub.href}
                              className={`${styles.subMenuItem} ${
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
                  </>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
