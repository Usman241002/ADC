import { Paper, Typography, Table, TableRow, TableCell } from "@mui/material";
import type { rentalDetails, availableVehicles } from "../app/types/rentals";

type RentalTotal = {
  completed: {
    panel1: boolean;
    panel2: boolean;
    panel3: boolean;
  };
  rentalDetails: rentalDetails;
  selectedVehicle: availableVehicles | undefined;
};

export default function RentalTotal({
  completed,
  rentalDetails,
  selectedVehicle,
}: RentalTotal) {
  const rentalCost = selectedVehicle
    ? (selectedVehicle.weekly_rent * rentalDetails.duration_days) / 7
    : 0;

  const totalCost = rentalCost + selectedVehicle?.deposit_amount || 0;
  return (
    <Paper
      sx={{
        display: "flex",
        width: "35%",
        backgroundColor: "#FFFFFF",
        borderRadius: 1,
        height: "fit-content",
        flexDirection: "column",
      }}
    >
      <Typography
        sx={{
          backgroundColor: "primary.main",
          color: "#FFFFFF",
          fontSize: "1.25rem",
          p: 1.5,
        }}
      >
        Total
      </Typography>
      <Table>
        {completed.panel1 && rentalDetails.duration_days && (
          <TableRow sx={{ backgroundColor: "#ECECEC" }}>
            <TableCell>Rental Period:</TableCell>
            <TableCell
              sx={{
                fontSize: "1rem",
                textAlign: "end",
                fontWeight: "bold",
              }}
            >{`${rentalDetails.duration_days} days`}</TableCell>
          </TableRow>
        )}
        {selectedVehicle && (
          <>
            <TableRow sx={{ backgroundColor: "#ECECEC" }}>
              <TableCell>Weekly Rent</TableCell>
              <TableCell
                sx={{
                  fontSize: "1rem",
                  textAlign: "end",
                  fontWeight: "bold",
                }}
              >
                £{selectedVehicle.weekly_rent}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                {`${selectedVehicle.vrm} ${selectedVehicle.make} ${selectedVehicle.model}`}
              </TableCell>
              <TableCell
                sx={{
                  fontSize: "1rem",
                  textAlign: "end",
                  fontWeight: "bold",
                }}
              >
                £{rentalCost.toFixed(2)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Deposit:</TableCell>
              <TableCell
                sx={{
                  fontSize: "1rem",
                  textAlign: "end",
                  fontWeight: "bold",
                }}
              >
                £{selectedVehicle.deposit_amount.toFixed(2)}
              </TableCell>
            </TableRow>
          </>
        )}
        {rentalDetails.duration_days && selectedVehicle && (
          <TableRow>
            <TableCell
              sx={{
                fontSize: "1rem",
                color: "primary.main",
                fontWeight: "bold",
              }}
            >
              Outstanding Balance:
            </TableCell>
            <TableCell
              sx={{
                fontSize: "1rem",
                textAlign: "end",
                fontWeight: "bold",
                color: "primary.main",
              }}
            >
              £{Math.max(totalCost).toFixed(2)}
            </TableCell>
          </TableRow>
        )}
      </Table>
    </Paper>
  );
}
