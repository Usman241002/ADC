import {
  FileUploadOutlined,
  SearchOutlined,
  TuneOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  InputAdornment,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { formatDateToDDMMYYYY } from "../app/utils.ts";
import type { RootState } from "../app/store";

export default function Vehicles() {
  const vehicles = useSelector((state: RootState) => state.vehicles);

  return (
    <Stack spacing={3}>
      <Typography id="title">Vehicles</Typography>

      <Box sx={{ backgroundColor: "#FFFFFF", borderRadius: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "start",
            px: 3,
            py: 2,
            borderBottom: "1px solid #F0F0F0",
          }}
        >
          <Toolbar
            sx={{ width: "100%", justifyContent: "space-between" }}
            disableGutters
          >
            <TextField
              size="small"
              variant="outlined"
              placeholder="Search by VRM, Vehicle or Location"
              sx={{ width: "22rem", fontSize: "0.875rem" }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchOutlined />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Toolbar>
          <Stack spacing={4} direction="row" width="75%" justifyContent="end">
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#FFFFFF",
                color: "#999999",
                textTransform: "none",
                gap: 1,
              }}
            >
              <TuneOutlined sx={{ color: "#999999" }} />
              Filters
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#FFFFFF",
                color: "#999999",
                textTransform: "none",
                gap: 1,
              }}
            >
              <FileUploadOutlined sx={{ color: "#999999" }} />
              Export
            </Button>
            <Button
              variant="contained"
              size="medium"
              component={Link}
              to="/vehicles/add"
              sx={{
                display: "flex",
                fontSize: "1rem",
                textTransform: "none",
                backgroundColor: "success.main",
                color: "#FFFFFF",
                textAlign: "center",
              }}
            >
              Add Vehicle
            </Button>
            <Button
              variant="contained"
              size="medium"
              sx={{
                display: "flex",
                fontSize: "1rem",
                textTransform: "none",
                backgroundColor: "error.main",
                color: "#FFFFFF",
                textAlign: "center",
              }}
            >
              Remove Vehicle
            </Button>
          </Stack>
        </Box>

        {/*Add Filtering */}
        <Stack spacing={1} sx={{ px: 3, py: 2 }}>
          <Typography id="title">List of Vehicles</Typography>
          <TableContainer sx={{ p: 0 }}>
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
                      {" "}
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
                        component={Link}
                        to={`/rentals/add/${vehicle.id}`}
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
        </Stack>
      </Box>
    </Stack>
  );
}
