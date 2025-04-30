"use client";

import { useSidebar } from "./SidebarContext";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import styles from "@Om/app/(container)/clist/styles/Sidebar2.module.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import menuItemsData from "@Om/app/(container)/clist/component/menuItems.json"; // Adjust the path as necessary
import Image from "next/image";
interface SubMenuItem {
  label: string;
  href: string;
  icon: string;
}


interface MenuItem {
  key: string;
  label: string;
  icon: string;
  href: string | null; 
  subMenu: SubMenuItem[]; 
}

export default function Sidebar2() {
  const pathname = usePathname();
  const { isSidebarVisible, closeSidebar } = useSidebar();
  const sidebarRef = useRef<HTMLDivElement>(null);

  
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


  const handleLinkClick = () => {
    if (window.innerWidth < 992) {
      closeSidebar();
    }
  };
  

  return (
    <aside
      ref={sidebarRef}
      className={`${styles.sidebar} ${
        isSidebarVisible ? styles.sidebarVisible : styles.sidebarHidden
      }`}
    >
      <Link href="/dashboard" className={styles.brandLink}>
        <div className={styles.logoContainer}>
          <Image
            src="/img/logo.webp"
            alt="在庫管理ロゴ"
            width={160}
            height={40}
            className={styles.logoImage}
            priority // Makes it load faster
          />
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
                              onClick={handleLinkClick}
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
