import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import { formatDateToDDMMYYYY } from "../app/utils.ts";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store.ts";
import { useNavigate } from "react-router-dom";
import { EditOutlined, BuildCircleOutlined } from "@mui/icons-material";

export default function VehicleTable() {
  const vehicles = useSelector((state: RootState) => state.vehicles);
  const navigate = useNavigate();
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Vehicle</TableCell>
            <TableCell>Mileage</TableCell>
            <TableCell>MOT</TableCell>
            <TableCell>Road Tax</TableCell>
            <TableCell>Council Plate</TableCell>
            <TableCell>Company</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow>
              <TableCell>
                <Typography variant="body1" color="#999999">
                  {vehicle.vrm}
                </Typography>
                <Typography variant="body1">{`${vehicle.make} ${vehicle.model}`}</Typography>
              </TableCell>
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
                <IconButton
                  onClick={() => navigate(`/vehicles/edit/${vehicle.id}`)}
                >
                  <EditOutlined color="primary" />
                </IconButton>
                <IconButton>
                  <BuildCircleOutlined color="primary" />
                </IconButton>
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
                  onClick={() => {
                    navigate(`/rentals/add/${vehicle.id}`);
                  }}
                >
                  Add Rental
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
