interface ValidateTokenProps {
  token: string;
  tableId: number | string;
  setTheToken?: (token: string) => void;
}

interface ValidateTokenResponse {
  token?: string;
  message?: string;
}

export const validateOrderToken = async ({
  token,
  tableId,
  setTheToken,
}: ValidateTokenProps): Promise<ValidateTokenResponse> => {
  try {
    const res = await fetch("http://localhost:5000/api/validate-order-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ tableId }),
    });

    const data = await res.json();

    if (res.ok && data.token) {
      setTheToken?.(data.token);
      return { token: data.token };
    } else {
      localStorage.removeItem("orderToken");
      return { message: data.message || "Token invalid" };
    }
  } catch (err) {
    console.error("Error validating token:", err);
    return { message: "Failed to contact server" };
  }
};
