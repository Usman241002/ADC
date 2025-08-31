import { useState, useEffect } from "react";
import type { rentalDetails, availableVehicles } from "../types/rentals";

export default function useRentalForm(
  selectedClientId: string,
  preSelectedVehicleId?: string,
) {
  const [rentalDetails, setRentalDetails] = useState<rentalDetails>(() => {
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 89);

    return {
      vehicle_id: preSelectedVehicleId || "",
      client_id: selectedClientId,
      start_date: today.toISOString().split("T")[0],
      end_date: endDate.toISOString().split("T")[0],
      duration_days: 89,
    };
  });

  useEffect(() => {
    if (selectedClientId) {
      setRentalDetails((prev) => ({
        ...prev,
        client_id: selectedClientId,
      }));
    }
  }, [selectedClientId]);

  const [availableVehicles, setAvailableVehicles] = useState<
    availableVehicles[]
  >([]);
  const [vehiclesLoaded, setVehiclesLoaded] = useState(false);

  async function fetchVehiclesForRent() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/rentals/availableVehicles`,
      );
      const data = await response.json();
      setAvailableVehicles(data);
      setVehiclesLoaded(true);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      setVehiclesLoaded(true); // Set to true even on error to prevent infinite loading
    }
  }

  useEffect(() => {
    fetchVehiclesForRent();
  }, []);

  useEffect(() => {
    if (vehiclesLoaded && preSelectedVehicleId && !rentalDetails.vehicle_id) {
      const vehicleExists = availableVehicles.find(
        (vehicle) => vehicle.id.toString() === preSelectedVehicleId,
      );

      if (vehicleExists) {
        setRentalDetails((prev) => ({
          ...prev,
          vehicle_id: preSelectedVehicleId,
        }));
      }
    }
  }, [
    vehiclesLoaded,
    preSelectedVehicleId,
    availableVehicles,
    rentalDetails.vehicle_id,
  ]);

  // Handle vehicle selection
  const handleVehicleSelection = (vehicleId: string) => {
    setRentalDetails((prev) => ({
      ...prev,
      vehicle_id: vehicleId,
    }));
  };

  function handleRentalChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    if (name === "start_date") {
      // When start date changes, keep duration and update end date
      const startDate = new Date(value);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + rentalDetails.duration_days);

      setRentalDetails({
        ...rentalDetails,
        start_date: value,
        end_date: endDate.toISOString().split("T")[0],
      });
    } else if (name === "end_date") {
      // When end date changes, calculate and update duration
      if (rentalDetails.start_date && value) {
        const startDate = new Date(rentalDetails.start_date);
        const endDate = new Date(value);
        const diffTime = endDate.getTime() - startDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        setRentalDetails({
          ...rentalDetails,
          end_date: value,
          duration_days: diffDays > 0 ? diffDays : 1,
        });
      } else {
        setRentalDetails({
          ...rentalDetails,
          end_date: value,
        });
      }
    } else if (name === "duration_days") {
      // When duration changes, update end date
      const days = parseInt(value) || 1;
      if (rentalDetails.start_date) {
        const startDate = new Date(rentalDetails.start_date);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + days);

        setRentalDetails({
          ...rentalDetails,
          duration_days: days,
          end_date: endDate.toISOString().split("T")[0],
        });
      } else {
        setRentalDetails({
          ...rentalDetails,
          duration_days: days,
        });
      }
    } else {
      setRentalDetails({
        ...rentalDetails,
        [name]: value,
      });
    }
  }

  return {
    rentalDetails,
    setRentalDetails,
    availableVehicles,
    handleVehicleSelection,
    handleRentalChange,
    vehiclesLoaded,
  };
}
