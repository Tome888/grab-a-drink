"use client"

interface LoginObject{
    username: string
    password: string
}
export const loginUser = async (
  creds: LoginObject,
  setTheToken: (token: string) => void
) => {
  if (!creds.username || !creds.password) return;

  try {
    const res = await fetch("http://localhost:5000/api/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(creds),
    });

    const data = await res.json();
 
    if (!res.ok) {
      console.error("Login failed:", data.message || data.error);
      return false;
    }
    localStorage.setItem("tokenDash", data.token)
    setTheToken(data.token);
    return true;
  } catch (err) {
    console.error("Login error:", err);
    return false;
  }
};
