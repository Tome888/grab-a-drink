export const updateOrderSeen = async (
  orderId: number,
  seen: boolean,
  token: string
) => {
  try {
    const res = await fetch(`http://localhost:5000/api/put-seen/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ seen }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to update order seen status");
    }

    return data;
  } catch (err) {
    console.error("Error updating order seen:", err);
    throw err;
  }
};
