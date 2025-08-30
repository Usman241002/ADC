import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Input from "../components/Input";
import { useState } from "react";
import AccordionTitle from "../components/AccordionTitle";
import AddClientForm from "../components/AddClientForm";
import useClientForm from "../app/hooks/useClientForm";
import useRentalForm from "../app/hooks/useRentalForm";

export default function AddRental() {
  const [expanded, setExpanded] = useState<string | false>("panel1");
  const [completed, setCompleted] = useState({
    panel1: false,
    panel2: false,
    panel3: false,
    panel4: false,
  });

  const clientFormData = useClientForm();
  const { selectedClientId } = clientFormData;

  const {
    rentalDetails,
    setRentalDetails,
    availableVehicles,
    handleVehicleSelection,
    handleRentalChange,
  } = useRentalForm(selectedClientId);

  const handlePanelChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  const selectedVehicle = availableVehicles.find(
    (vehicle) => vehicle.id.toString() === rentalDetails.vehicle_id,
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Typography id="title">Add Reservation</Typography>
      <Stack spacing={4} direction="row" justifyContent="space-between">
        <Box width="65%">
          <Accordion
            expanded={expanded === "panel1"}
            onChange={handlePanelChange("panel1")}
            disableGutters
          >
            <AccordionSummary>
              <AccordionTitle
                title="Customer"
                arrow={expanded === "panel1"}
                checked={completed.panel1}
              />
            </AccordionSummary>
            <AccordionDetails
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <AddClientForm
                clientFormData={clientFormData}
                setRentalDetails={setRentalDetails}
              />
              <Button
                variant="contained"
                sx={{ color: "#FFFFFF" }}
                onClick={() => {
                  if (selectedClientId) {
                    setExpanded("panel2");
                    setCompleted((prev) => ({
                      ...prev,
                      panel1: true,
                    }));
                  }
                }}
                disabled={!selectedClientId}
              >
                Next Step
              </Button>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === "panel2"}
            onChange={handlePanelChange("panel2")}
            disableGutters
            disabled={!completed.panel1}
          >
            <AccordionSummary>
              <AccordionTitle
                title="Date & Vehicle"
                arrow={expanded === "panel2"}
                checked={completed.panel2}
              />
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={4}>
                <Grid container spacing={4}>
                  <Input
                    size={4}
                    label="Start Date"
                    name="start_date"
                    value={rentalDetails.start_date}
                    type="Date"
                    handleChange={handleRentalChange}
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
                    value={rentalDetails.duration_days.toString()}
                    type="number"
                    handleChange={handleRentalChange}
                  />
                </Grid>
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
                                  vehicle.id.toString() ===
                                  rentalDetails.vehicle_id
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
                              {rentalDetails.start_date &&
                              rentalDetails.end_date
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
                </Box>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    sx={{ color: "#FFFFFF" }}
                    onClick={() => {
                      if (
                        rentalDetails.client_id &&
                        rentalDetails.vehicle_id &&
                        rentalDetails.start_date &&
                        rentalDetails.end_date &&
                        rentalDetails.duration_days
                      ) {
                        setExpanded("panel3");
                        setCompleted((prev) => ({
                          ...prev,
                          panel2: true,
                        }));
                      }
                    }}
                    disabled={
                      !rentalDetails.client_id ||
                      !rentalDetails.vehicle_id ||
                      !rentalDetails.start_date ||
                      !rentalDetails.end_date ||
                      !rentalDetails.duration_days
                    }
                  >
                    Next Step
                  </Button>
                </Box>
              </Stack>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === "panel3"}
            onChange={handlePanelChange("panel3")}
            disableGutters
            disabled={!completed.panel1 || !completed.panel2}
          >
            <AccordionSummary>
              <AccordionTitle
                title="Payment"
                arrow={expanded === "panel3"}
                checked={completed.panel3}
              />
            </AccordionSummary>
            <AccordionDetails></AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === "panel4"}
            onChange={handlePanelChange("panel4")}
            disableGutters
            disabled={
              !completed.panel1 || !completed.panel2 || !completed.panel3
            }
          >
            <AccordionSummary>
              <AccordionTitle
                title="Documents"
                arrow={expanded === "panel4"}
                checked={completed.panel4}
              />
            </AccordionSummary>
            <AccordionDetails></AccordionDetails>
          </Accordion>
        </Box>

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
              <TableRow>
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
                  £{" "}
                  {(
                    (selectedVehicle.weekly_rent *
                      rentalDetails.duration_days) /
                    7
                  ).toFixed(2)}
                </TableCell>
              </TableRow>
            )}
            {rentalDetails.duration_days && selectedVehicle && (
              <TableRow>
                <TableCell>Deposit:</TableCell>
                <TableCell
                  sx={{
                    fontSize: "1rem",
                    textAlign: "end",
                    fontWeight: "bold",
                  }}
                >
                  £ 250.00
                </TableCell>
              </TableRow>
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
                  Due Balance:
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "1rem",
                    textAlign: "end",
                    fontWeight: "bold",
                    color: "primary.main",
                  }}
                >
                  £{" "}
                  {(
                    (selectedVehicle.weekly_rent *
                      rentalDetails.duration_days) /
                      7 +
                    250
                  ).toFixed(2)}
                </TableCell>
              </TableRow>
            )}
          </Table>
        </Paper>
      </Stack>
    </Box>
  );
}
