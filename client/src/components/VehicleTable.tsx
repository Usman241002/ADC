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
import { useMemo } from "react";

interface VehicleTableProps {
  searchTerm: string;
}

export default function VehicleTable({ searchTerm }: VehicleTableProps) {
  const vehicles = useSelector((state: RootState) => state.vehicles);
  const navigate = useNavigate();

  const filteredVehicles = useMemo(() => {
    if (!searchTerm) return vehicles;

    return vehicles.filter((vehicle) => {
      const searchLower = searchTerm.toLowerCase();

      if (vehicle.vrm.toLowerCase().includes(searchLower)) return true;

      const vehicleName = `${vehicle.make} ${vehicle.model}`.toLowerCase();
      if (vehicleName.includes(searchLower)) return true;

      const locations =
        vehicle.council_plates
          ?.map((plate) => plate.city.toLowerCase())
          .join(" ") || "";
      if (locations.includes(searchLower)) return true;

      if (vehicle.company.toLowerCase().includes(searchLower)) return true;

      return false;
    });
  }, [vehicles, searchTerm]);

  async function handleMaintenanceToggle(id: number, status: string) {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/vehicles/maintenance/${id}`,
      {
        method: "PUT",
        body: JSON.stringify({ status }),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (response.ok) {
      window.location.reload();
    }
  }

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
          {filteredVehicles.map((vehicle) => (
            <TableRow key={vehicle.id}>
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
                <IconButton
                  onClick={() => {
                    handleMaintenanceToggle(vehicle.id, vehicle.status);
                  }}
                  disabled={vehicle.status === "Reserved"}
                >
                  <BuildCircleOutlined
                    sx={{
                      color:
                        vehicle.status === "Reserved"
                          ? "grey.400"
                          : "primary.main",
                    }}
                  />
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
