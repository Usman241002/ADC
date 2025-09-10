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
  TextField,
} from "@mui/material";
import Input from "../components/Input";
import type { rentalDetails, availableVehicles } from "../app/types/rentals";

type props = {
  handleVehicleSelection: (vehicle_id: string) => void;
  handleRentalChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rentalDetails: Omit<rentalDetails, "rental_id">;
  availableVehicles: availableVehicles[];
  editRental?: boolean;
  onWeeklyRentChange?: (vehicleId: string, newWeeklyRent: number) => void;
};

export default function AddDateVehicleForm({
  handleVehicleSelection,
  handleRentalChange,
  rentalDetails,
  availableVehicles,
  editRental = false,
  onWeeklyRentChange,
}: props) {
  console.log(rentalDetails);

  const handleWeeklyRentChange = (vehicleId: string, value: string) => {
    const numericValue = parseFloat(value) || 0;
    if (onWeeklyRentChange) {
      onWeeklyRentChange(vehicleId, numericValue);
    }
  };

  const getVehicleWeeklyRent = (vehicle: availableVehicles) => {
    // If this vehicle is selected, use the rental details weekly_rent if available
    if (
      vehicle.id.toString() === rentalDetails.vehicle_id &&
      rentalDetails.weekly_rent
    ) {
      return rentalDetails.weekly_rent;
    }
    // Otherwise use the vehicle's default weekly_rent
    return vehicle.weekly_rent;
  };

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
                {availableVehicles.map((vehicle) => {
                  const isSelected =
                    vehicle.id.toString() === rentalDetails.vehicle_id;
                  const currentWeeklyRent = getVehicleWeeklyRent(vehicle);

                  return (
                    <TableRow key={vehicle.id}>
                      <TableCell>
                        <Checkbox
                          checked={isSelected}
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
                      <TableCell>
                        {isSelected ? (
                          <TextField
                            value={currentWeeklyRent}
                            onChange={(e) =>
                              handleWeeklyRentChange(
                                vehicle.id.toString(),
                                e.target.value,
                              )
                            }
                            type="number"
                            size="small"
                            variant="outlined"
                            InputProps={{
                              startAdornment: <Typography>£</Typography>,
                            }}
                            sx={{ width: 100 }}
                          />
                        ) : (
                          `£ ${vehicle.weekly_rent}`
                        )}
                      </TableCell>
                      <TableCell>
                        £{" "}
                        {rentalDetails.start_date && rentalDetails.end_date
                          ? (
                              (currentWeeklyRent *
                                rentalDetails.duration_days) /
                              7
                            ).toFixed(2)
                          : "0.00"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </>
  );
}
