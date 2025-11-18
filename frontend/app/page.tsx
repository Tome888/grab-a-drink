"use client";

import { useState } from "react";
import { loginUser } from "./helpers/loginUser";
import { useRouter } from "next/navigation";
import useAdminSession from "./hooks/useAdminSession";

export default function Home() {
  const { setToken } = useAdminSession();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2 min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1>ADMIN DASHBOARD</h1>

      <form
        onSubmit={async (e) => {
          e.preventDefault();

          const success = await loginUser({ username, password }, setToken);

          if (success) {
            router.push("/dashboard");
          } else {
            alert("Invalid credentials");
          }
        }}
        className="flex flex-col"
      >
        <div className="flex flex-col gap-2 mt-2">
          <label>Username: Admin123</label>
          <input
            type="text"
            onChange={(e) => setUsername(e.target.value.trim())}
            className="bg-amber-50 text-black"
          />
        </div>

        <div className="flex flex-col gap-2 mt-2">
          <label>Password: Password123</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value.trim())}
            className="bg-amber-50 text-black"
          />
        </div>

        <button className="bg-red-500">Login</button>
      </form>
    </div>
  );
}
