"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  ListOrdered,
  Settings,
  Utensils,
  Table,
} from "lucide-react";

interface Route {
  label: string;
  path: string;
  icon: React.ElementType;
}

const routes: Route[] = [
  { label: "Home", path: "/dashboard", icon: Home },
  { label: "Orders", path: "/dashboard/orders", icon: ListOrdered },
  { label: "Menu", path: "/dashboard/menu", icon: Utensils },
  { label: "Tables", path: "/dashboard/tables", icon: Table },
  { label: "Settings", path: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside
      className={`
        bg-white dark:bg-gray-900 
        min-h-screen 
        border-r border-gray-200 dark:border-gray-800 
        transition-all duration-300 
        relative
        ${collapsed ? "w-25" : "w-64"}
      `}
    >
      <div
        className={`p-4 flex ${collapsed ? "justify-center" : "justify-end"}`}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          className="p-1 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                collapsed
                  ? "M13 5l7 7-7 7M5 5l7 7-7 7"
                  : "M11 19l-7-7 7-7m8 14l-7-7 7-7"
              }
            />
          </svg>
        </button>
      </div>

      <ul className="mt-4 space-y-2 p-3">
        {routes.map((route) => {
          const isActive = pathname === route.path;

          return (
            <li key={route.path}>
              <button
                onClick={() => router.push(route.path)}
                className={`
                  w-full flex items-center justify-between
                  text-left 
                  px-4 py-2 
                  rounded-lg 
                  transition-colors duration-200
                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <route.icon
                    className={`h-5 w-5 ${
                      isActive
                        ? "text-white"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                  />

                  {!collapsed && (
                    <span className="font-medium whitespace-nowrap">
                      {route.label}
                    </span>
                  )}
                  {collapsed && (
                    <span className="font-medium whitespace-nowrap text-sm">
                      {route.label.charAt(0)}
                    </span>
                  )}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
