import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import { formatDateToDDMMYYYY } from "../app/utils.ts";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store.ts";

export default function VehicleTable() {
  const vehicles = useSelector((state: RootState) => state.vehicles);
  return (
    <TableContainer>
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
  );
}
