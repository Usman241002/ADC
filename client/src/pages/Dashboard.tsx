import { Stack, Typography } from "@mui/material";
import RevenueCard from "../components/RevenueCard";
import DailyPlanCard from "../components/DailyPlanCard";
import VehicleStatusCard from "../components/VehicleStatusCard";

export default function Dashboard() {
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
