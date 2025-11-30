"use client";

import { useState } from "react";
import { UserCog, Lock, LogIn, Loader2 } from "lucide-react"; 

import { loginUser } from "./helpers/loginUser";
import { useRouter } from "next/navigation";
import { useAdminSessionContext } from "./context/AdminSessionContext";

export default function Home() {
  const { setToken } = useAdminSessionContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); 
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 font-sans p-4">
      
      <div className="w-full max-w-sm bg-white dark:bg-gray-800 shadow-xl rounded-xl p-8 space-y-8 border border-gray-200 dark:border-gray-700">
        
        <div className="text-center">
          <UserCog className="mx-auto h-12 w-12 text-blue-600 dark:text-blue-400 stroke-[1.5]" />
          <h1 className="mt-4 text-3xl font-extrabold text-gray-900 dark:text-white">
            ADMIN DASHBOARD
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to manage your application.
          </p>
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setIsLoading(true); 

            const success = await loginUser({ username, password }, setToken);

            setIsLoading(false); 

            if (success) {
              router.push("/dashboard");
            } else {
              alert("Invalid credentials");
            }
          }}
          className="space-y-6"
        >
          
          <div>
            <label 
              htmlFor="username" 
              className="text-sm font-medium text-gray-700 dark:text-gray-300 flex justify-between"
            >
              Username
              <span className="text-xs font-normal text-blue-500 dark:text-blue-400">
                user: Admin123
              </span>
            </label>
            <div className="mt-1 relative rounded-lg shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserCog className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                disabled={isLoading}
                onChange={(e) => setUsername(e.target.value.trim())}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter your username"
              />
            </div>
          </div>

          <div>
            <label 
              htmlFor="password" 
              className="text-sm font-medium text-gray-700 dark:text-gray-300 flex justify-between"
            >
              Password
              <span className="text-xs font-normal text-blue-500 dark:text-blue-400">
                pass: Password123
              </span>
            </label>
            <div className="mt-1 relative rounded-lg shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                disabled={isLoading}
                onChange={(e) => setPassword(e.target.value.trim())}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out 
                ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-3 h-5 w-5" />
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" />
                  Log In
                </>
              )}
            </button>
          </div>
        </form>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-700">
          For internal use only.
        </p>
      </div>
    </div>
  );
}