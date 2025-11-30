interface validLocP {
  setTheToken?: (token: string) => void;
  tableId: string;
}

export const validateLocation = async ({ setTheToken, tableId }: validLocP) => {
  if (!("geolocation" in navigator)) {
    console.warn("Geolocation is not supported by this browser");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const coords = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        tableId: tableId,
      };


      try {
        const res = await fetch("http://localhost:5000/api/validate-location", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ location: coords }),
        });

        const data = await res.json();

        if (res.ok && data.token) {
          localStorage.setItem("orderToken", data.token);
          setTheToken?.(data.token);
        } else {
          console.warn(
            "Location invalid:",
            data.message || "No token returned"
          );
          alert(data.message || "Location not valid");
        }
      } catch (err) {
        console.error("Error contacting server:", err);
        alert("Failed to validate location");
      }
    },
    (error) => {
      console.error("Error getting location:", error);
      alert("Unable to get your location");
    },
    { enableHighAccuracy: true }
  );
};
