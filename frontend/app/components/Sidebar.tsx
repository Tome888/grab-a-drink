"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

interface Route {
  label: string;
  path: string;
}

const routes: Route[] = [
  { label: "Home", path: "/dashboard" },
  { label: "Orders", path: "/dashboard/orders" },
  { label: "Settings", path: "/dashboard/settings" },
  { label: "Menu", path: "/dashboard/menu" },
  { label: "Tables", path: "/dashboard/tables" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside
      className={`bg-gray-200 dark:bg-gray-900 min-h-screen transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Toggle button */}
      <div className="flex justify-end p-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition"
        >
          {collapsed ? "➡️" : "⬅️"}
        </button>
      </div>

      {/* Routes */}
      <ul className="mt-4 space-y-2">
        {routes.map((route) => {
          const isActive = pathname === route.path;
          return (
            <li key={route.path}>
              <button
                onClick={() => router.push(route.path)}
                className={`w-full flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-800 dark:text-gray-200 hover:bg-blue-500 hover:text-white"
                }`}
              >
                {/* Show full label if expanded, else first letter */}
                <span className="font-semibold">
                  {collapsed ? route.label.charAt(0) : route.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
