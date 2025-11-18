"use client";

import useAdminSession from "@/app/hooks/useAdminSession";
import { useState } from "react";

interface Option {
  label: string;
  key: "username" | "password";
}
const options: Option[] = [
  { label: "Change Username", key: "username" },
  { label: "Change Password", key: "password" },
];

export default function Settings() {
  const { token } = useAdminSession();

  const [active, setActive] = useState<"username" | "password" | "">("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const [success, setSuccess] = useState("");

  const handleToggle = (key: "username" | "password") => {
    setErrors({});
    setSuccess("");
    setActive(active === key ? "" : key);
  };

  const updateField = async (field: "username" | "password", value: string) => {
    if (!token) return setErrors({ [field]: "Not authenticated" });

    try {
      const res = await fetch(`http://localhost:5000/api/update-creds/${field}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [field]: value }),
      });

      const data = await res.json();

      if (!data.ok) {
        setErrors({ [field]: data.message });
        return;
      }

      setSuccess(data.message);
    } catch (err) {
      console.error(err);
      setErrors({ [field]: "Server error" });
    }
  };

  const handleSubmitUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");

    if (username.trim().length < 3) {
      setErrors({ username: "Username must be at least 3 characters" });
      return;
    }

    await updateField("username", username);
    setUsername("");
    setActive("");
  };

  const handleSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");

    if (password.length < 8) {
      setErrors({ password: "Password must be at least 8 characters" });
      return;
    }

    if (password !== confirmPassword) {
      setErrors({ password: "Passwords do not match" });
      return;
    }

    await updateField("password", password);
    setPassword("");
    setConfirmPassword("");
    setActive("");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
        Update Settings
      </h2>

      <div className="flex flex-col gap-3">
        {options.map((option) => (
          <div key={option.key} className="border border-gray-300 dark:border-gray-700 rounded">
            <button
              type="button"
              onClick={() => handleToggle(option.key)}
              className="w-full px-4 py-2 text-left bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 flex justify-between items-center"
            >
              {option.label}
              <span>{active === option.key ? "-" : "+"}</span>
            </button>

            {active === option.key && option.key === "username" && (
              <form onSubmit={handleSubmitUsername} className="flex flex-col gap-3 p-4 bg-gray-50 dark:bg-gray-700">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="New Username"
                  className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-black dark:text-white"
                />
                {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Update Username
                </button>
              </form>
            )}

            {active === option.key && option.key === "password" && (
              <form onSubmit={handleSubmitPassword} className="flex flex-col gap-3 p-4 bg-gray-50 dark:bg-gray-700">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New Password"
                  className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-black dark:text-white"
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-black dark:text-white"
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Update Password
                </button>
              </form>
            )}
          </div>
        ))}
      </div>

      {success && <p className="text-green-500 mt-4">{success}</p>}
    </div>
  );
}
