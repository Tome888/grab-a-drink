"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"

export default function useAdminSession(){
  const router = useRouter()
    const [token, setToken] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("tokenDash") || null;
    }
    return null;
  });

    useEffect(() => {
  const token = localStorage.getItem("tokenDash");
  if (!token) return;

  fetch("http://localhost:5000/api/validate-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => res.json())
    .then(data => {
      if (data.ok) {
        console.log("Token valid for user:", data.user);
      } else {
        console.log("Token invalid");
        localStorage.removeItem("tokenDash")
        setToken(null)
        router.push("/")
      }
    });
}, []);


    return {token, setToken}
}


// "use client";

// import { useEffect, useState } from "react";

// export default function useAdminSession() {
//   const [token, setToken] = useState(() => {
//     if (typeof window !== "undefined") {
//       return localStorage.getItem("tokenDash") || null;
//     }
//     return null;
//   });

//   const [valid, setValid] = useState<boolean | null>(null); // null = loading

//   useEffect(() => {
//     if (!token) {
//       setValid(false);
//       return;
//     }

//     console.log("asdasdas")
//     fetch("http://localhost:5000/api/validate-token", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     })
//       .then(res => res.json())
//       .then(data => {
//         setValid(data.ok);
//       })
//       .catch(() => setValid(false));
//   }, [token]);

//   return { token, setToken, valid };
// }
