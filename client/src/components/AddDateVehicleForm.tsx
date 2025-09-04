import {
  Box,
  Checkbox,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Input from "../components/Input";
import type { rentalDetails, availableVehicles } from "../app/types/rentals";

type props = {
  handleVehicleSelection: (vehicle_id: string) => void;
  handleRentalChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rentalDetails: Omit<rentalDetails, "rental_id">;
  availableVehicles: availableVehicles[];
  editRental?: boolean;
};

export default function AddDateVehicleForm({
  handleVehicleSelection,
  handleRentalChange,
  rentalDetails,
  availableVehicles,
  editRental = false,
}: props) {
  console.log(rentalDetails);
  return (
    <>
      <Grid container spacing={4}>
        <Input
          size={4}
          label="Start Date"
          name="start_date"
          value={rentalDetails.start_date}
          type="Date"
          handleChange={handleRentalChange}
          disabled={editRental}
        />

        <Input
          size={4}
          label="End Date"
          name="end_date"
          value={rentalDetails.end_date}
          type="Date"
          handleChange={handleRentalChange}
        />
        <Input
          size={4}
          label="Duration (days)"
          name="duration_days"
          value={
            rentalDetails.duration_days
              ? rentalDetails.duration_days.toString()
              : "0"
          }
          type="number"
          handleChange={handleRentalChange}
        />
      </Grid>

      {!editRental && (
        <>
          <Box>
            <Typography
              sx={{
                color: "primary.main",
                fontSize: "1.25rem",
              }}
            >
              Found {availableVehicles.length} Vehicle
              {availableVehicles.length > 1 ? "s" : ""}
            </Typography>
          </Box>
          <TableContainer sx={{ p: 0 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Vehicle</TableCell>
                  <TableCell>VRM</TableCell>
                  <TableCell>Mileage</TableCell>
                  <TableCell>Price per/week</TableCell>
                  <TableCell>Total Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {availableVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell>
                      <Checkbox
                        checked={
                          vehicle.id.toString() === rentalDetails.vehicle_id
                        }
                        onChange={() =>
                          handleVehicleSelection(vehicle.id.toString())
                        }
                      />
                    </TableCell>
                    <TableCell>
                      {vehicle.make} {vehicle.model}
                    </TableCell>
                    <TableCell>{vehicle.vrm}</TableCell>
                    <TableCell>{vehicle.mileage} mi</TableCell>
                    <TableCell>£ {vehicle.weekly_rent}</TableCell>
                    <TableCell>
                      £{" "}
                      {rentalDetails.start_date && rentalDetails.end_date
                        ? (
                            (vehicle.weekly_rent *
                              rentalDetails.duration_days) /
                            7
                          ).toFixed(2)
                        : "0.00"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </>
  );
}
