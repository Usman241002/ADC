// hooks/useVehicleLookup.ts
import { useState } from "react";

interface VehicleData {
  make?: string;
  model?: string;
  colour?: string;
  fuelType?: string;
  motExpiryDate?: string;
  taxDueDate?: string;
}

export const useVehicleLookup = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const lookupVehicle = async (
    registrationNumber: string,
  ): Promise<VehicleData | null> => {
    if (!registrationNumber || registrationNumber.length < 2) {
      setError("Please enter a valid registration number");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Point to your Express server
      const response = await fetch(
        `${(import.meta as any).env.VITE_API_URL || "http://localhost:8000"}/api/vehicle/lookup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            registrationNumber: registrationNumber
              .replace(/\s/g, "")
              .toUpperCase(),
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch vehicle data");
      }

      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { lookupVehicle, loading, error };
};
