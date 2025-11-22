"use client";

import { useState, useEffect } from "react";
import { useAdminSessionContext } from "@/app/context/AdminSessionContext";

interface LocationData {
  lat: number;
  lon: number;
  radius: number;
}

export function useSettings() {
  const { token } = useAdminSessionContext();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ username?: string; password?: string; location?: string }>({});
  const [successCreds, setSuccessCreds] = useState("");
  const [successLocation, setSuccessLocation] = useState("");

  const [location, setLocation] = useState<LocationData>({ lat: 0, lon: 0, radius: 100 });
  const [locationLoading, setLocationLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchLocation = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/get-location", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.ok) {
          setLocation({ lat: data.lat, lon: data.lon, radius: data.radius });
        } else {
          setErrors((prev) => ({ ...prev, location: data.message }));
        }
      } catch (err) {
        setErrors((prev) => ({ ...prev, location: "Failed to fetch location" }));
      } finally {
        setLocationLoading(false);
      }
    };

    fetchLocation();
  }, [token]);

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
      if (!data.ok) return setErrors({ [field]: data.message });

      setSuccessCreds(data.message);
      setErrors({});
    } catch (err) {
      console.error(err);
      setErrors({ [field]: "Server error" });
    }
  };

  const updateLocation = async (lat: number, lon: number, radius: number) => {
    if (!token) return setErrors({ location: "Not authenticated" });

    try {
      const res = await fetch("http://localhost:5000/api/update-location", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ lat, lon, radius }),
      });

      const data = await res.json();
      if (!data.ok) return setErrors({ location: data.message });

      setLocation({ lat, lon, radius });
      setSuccessLocation(data.message);
      setErrors({});
    } catch (err) {
      console.error(err);
      setErrors({ location: "Server error" });
    }
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    errors,
    successCreds,
    successLocation,
    location,
    setLocation,
    locationLoading,
    updateField,
    updateLocation,
    setErrors,
    setSuccessCreds,
    setSuccessLocation,
  };
}
