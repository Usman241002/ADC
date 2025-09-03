import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Stack,
} from "@mui/material";
import { TuneOutlined } from "@mui/icons-material";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";

export default function DailyPlanCard() {
  const vehicles = useSelector((state: RootState) => state.vehicles);

  const dailyPlanData = [
    {
      label: "Available",
      value: vehicles.filter((v) => v.status === "Available").length,
      color: "success.main",
    }, // green
    {
      label: "Awaiting Return from Rental",
      value: vehicles.filter((v) => v.status === "Reserved").length,
      color: "warning.main",
    }, // yellow
    {
      label: "Awaiting Return from Maintenance",
      value: vehicles.filter((v) => v.status === "Maintenance").length,
      color: "error.main",
    }, // red
  ];
  // Compute total for scaling progress bar
  const total = dailyPlanData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card sx={{ borderRadius: 2, boxShadow: 3, flex: 1, px: 1 }}>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="start"
          alignItems="center"
          spacing={3}
          sx={{
            paddingBottom: 1,
            borderBottom: "1px solid #F0F0F0",
          }}
        >
          <Typography id="subtitle">Daily Plan</Typography>
          <IconButton size="small">
            <TuneOutlined sx={{ color: "#666666" }} />
          </IconButton>
        </Stack>

        {/* Multi-colored progress bar */}
        <Box
          sx={{
            display: "flex",
            height: 12,
            borderRadius: 5,
            overflow: "hidden",
            marginBottom: 3,
            marginTop: 2,
          }}
        >
          {dailyPlanData.map((item, idx) => (
            <Box
              key={idx}
              sx={{
                width: `${(item.value / total) * 100}%`,
                backgroundColor: item.color,
              }}
            />
          ))}
        </Box>

        {/* List */}
        <Stack spacing={2}>
          {dailyPlanData.map((item, idx) => (
            <Stack
              key={idx}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="body2">{item.label}</Typography>
              <Typography variant="body2" fontWeight="bold">
                {item.value.toString()}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
