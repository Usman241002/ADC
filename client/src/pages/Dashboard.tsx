import { Stack, Typography } from "@mui/material";
import RevenueCard from "../components/RevenueCard";
import DailyPlanCard from "../components/DailyPlanCard";
import VehicleStatusCard from "../components/VehicleStatusCard";
import { useDispatch } from "react-redux";
import { setVehicles } from "../features/vehiclesSlice";
import { useEffect } from "react";

export default function Dashboard() {
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchCarData() {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/vehicles`,
      );
      const data = await response.json();
      dispatch(setVehicles(data));
    }
    fetchCarData();
  }, [dispatch]);

  return (
    <Stack spacing={3}>
      <Typography id="title">Dashboard</Typography>

      <VehicleStatusCard />

      <Stack direction="row" spacing={3}>
        <DailyPlanCard />
        <RevenueCard />
      </Stack>
    </Stack>
  );
}
