import {
  Stack,
  Typography,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import { TuneOutlined } from "@mui/icons-material";
import VehicleTable from "./VehicleTable";

export default function VehicleStatusCard() {
  return (
    <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="start"
          alignItems="center"
          spacing={3}
          sx={{
            px: 1,
            paddingBottom: 1,
            borderBottom: "1px solid #F0F0F0",
          }}
        >
          <Typography id="subtitle">Vehicle Status</Typography>
          <IconButton size="small">
            <TuneOutlined sx={{ color: "#666666" }} />
          </IconButton>
        </Stack>

        <VehicleTable />
      </CardContent>
    </Card>
  );
}
