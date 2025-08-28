import {
  Box,
  Paper,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import { TuneOutlined } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { formatDateToDDMMYYYY } from "../app/utils.ts";
import type { RootState } from "../app/store";

export default function Dashboard() {
  const vehicles = useSelector((state: RootState) => state.vehicles);

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

        {/** Replace with appropriate code */}
        {/*Add Filtering */}
        <TableContainer component={Paper} sx={{ px: 3, py: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>VRM</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Mileage</TableCell>
                <TableCell>MOT</TableCell>
                <TableCell>Road Tax</TableCell>
                <TableCell>Council Plate</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Status</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vehicles.map((vehicle) => (
                <TableRow
                  key={vehicle.vrm}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{vehicle.vrm}</TableCell>
                  <TableCell>{`${vehicle.make} ${vehicle.model}`}</TableCell>
                  <TableCell>{vehicle.mileage}</TableCell>
                  <TableCell>
                    {formatDateToDDMMYYYY(vehicle.mot_expiry_date)}
                  </TableCell>
                  <TableCell>
                    {formatDateToDDMMYYYY(vehicle.road_tax_expiry_date)}
                  </TableCell>
                  <TableCell>
                    {vehicle.council_plates
                      ?.map((plate) => plate.city)
                      .join(", ") || "No plates"}
                  </TableCell>
                  <TableCell>{vehicle.company}</TableCell>
                  <TableCell
                    sx={{
                      color: {
                        Available: "success.main",
                        Reserved: "warning.main",
                        Maintenance: "error.main",
                      }[vehicle.status],
                    }}
                  >
                    {vehicle.status}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        color: "primary.main",
                        backgroundColor: "#FFFFFF",
                        textTransform: "none",
                      }}
                      disabled={vehicle.status === "Available" ? false : true}
                    >
                      Add Rental
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
