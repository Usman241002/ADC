import { Box, Stack, Typography } from "@mui/material";
import { TuneOutlined } from "@mui/icons-material";

export default function Dashboard() {
  return (
    <Stack spacing={3}>
      <Typography id="title">Dashboard</Typography>

      <Box sx={{ backgroundColor: "#FFFFFF", borderRadius: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "start",
            padding: 3,
            gap: 3,
            borderBottom: "1px solid #F0F0F0",
          }}
        >
          <Typography id="subtitle">Vehicle Status</Typography>
          <TuneOutlined sx={{ color: "#666666" }} />
        </Box>
      </Box>

      <Stack direction="row" spacing={3}>
        <Box sx={{ backgroundColor: "#FFFFFF", borderRadius: 1, flex: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "start",
              padding: 3,
              gap: 3,
              borderBottom: "1px solid #F0F0F0",
            }}
          >
            <Typography id="subtitle">Daily Plan</Typography>
            <TuneOutlined sx={{ color: "#666666" }} />
          </Box>
        </Box>

        <Box sx={{ backgroundColor: "#FFFFFF", borderRadius: 1, flex: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "start",
              padding: 3,
              gap: 3,
              borderBottom: "1px solid #F0F0F0",
            }}
          >
            <Typography id="subtitle">Revenue</Typography>
            <TuneOutlined sx={{ color: "#666666" }} />
          </Box>
        </Box>
      </Stack>
    </Stack>
  );
}
