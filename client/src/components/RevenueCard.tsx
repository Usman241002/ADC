import {
  Box,
  Card,
  CardContent,
  IconButton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import TuneOutlined from "@mui/icons-material/TuneOutlined";
import { useState } from "react";

export default function RevenueCard() {
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>("weekly");

  return (
    <Card sx={{ borderRadius: 2, boxShadow: 3, flex: 1, px: 1 }}>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={3}
          sx={{
            paddingBottom: 1,
            borderBottom: "1px solid #F0F0F0",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "start",
              alignItems: "center",
              gap: 3,
            }}
          >
            <Typography id="subtitle">Revenue</Typography>
            <IconButton size="small">
              <TuneOutlined sx={{ color: "#666666" }} />
            </IconButton>
          </Box>
          <ToggleButtonGroup
            value={selectedPeriod}
            onChange={(event, value) => setSelectedPeriod(value)}
            exclusive
          >
            <ToggleButton
              value="weekly"
              size="small"
              sx={{
                color: "primary.main",
                textTransform: "none",
                "&.Mui-selected": { color: "primary.main" },
              }}
            >
              Weekly
            </ToggleButton>
            <ToggleButton
              value="monthly"
              size="small"
              sx={{
                color: "primary.main",
                textTransform: "none",
                "&.Mui-selected": { color: "primary.main" },
              }}
            >
              Monthly
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </CardContent>
    </Card>
  );
}
