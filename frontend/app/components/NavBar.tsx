"use client"

import { useRouter } from "next/navigation";
import useAdminSession from "../hooks/useAdminSession";

export default function NavBar() {
  const { setToken } = useAdminSession();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("tokenDash");
    setToken("");
    router.push("/");
  };

  return (
    <nav className="w-full flex justify-between items-center px-6 py-4 bg-gray-800 text-white shadow-md">
      <h3 className="text-lg font-semibold">Admin123</h3>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 transition-colors px-4 py-2 rounded"
      >
        Log Out
      </button>
    </nav>
  );
}
