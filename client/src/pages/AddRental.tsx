import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";
import AccordionTitle from "../components/AccordionTitle";
import AddClientForm from "../components/AddClientForm";
import useClientForm from "../app/hooks/useClientForm";
import RentalTotal from "../components/RentalTotal";
import useRentalForm from "../app/hooks/useRentalForm";

import { useNavigate, useParams } from "react-router-dom";
import AddDateVehicleForm from "../components/AddDateVehicleForm";

export default function AddRental() {
  const [expanded, setExpanded] = useState<string | false>("panel1");
  const [completed, setCompleted] = useState({
    panel1: false,
    panel2: false,
    panel3: false,
  });

  const { vehicle_id } = useParams<{ vehicle_id?: string }>();
  const navigate = useNavigate();

  const clientFormData = useClientForm();
  const { selectedClientId } = clientFormData;

  const {
    rentalDetails,
    setRentalDetails,
    availableVehicles,
    handleVehicleSelection,
    handleRentalChange,
    handleWeeklyRentChange,
    vehiclesLoaded,
    handleSubmit,
  } = useRentalForm(selectedClientId, vehicle_id);

  useEffect(() => {
    if (vehicle_id && vehiclesLoaded) {
      const preSelectedVehicle = availableVehicles.find(
        (vehicle) => vehicle.id.toString() === vehicle_id,
      );

      if (preSelectedVehicle) {
        console.log("Vehicle pre-selected successfully");
      } else {
        console.warn(
          `Vehicle with ID ${vehicle_id} not found or not available`,
        );
        navigate("/vehicles");
      }
    }
  }, [vehicle_id, availableVehicles, vehiclesLoaded, navigate]);

  const handlePanelChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  const selectedVehicle = availableVehicles.find(
    (vehicle) => vehicle.id.toString() === rentalDetails.vehicle_id,
  );

  return (
    <Stack spacing={3}>
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
          <Box component="form" onSubmit={handleSubmit}>
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
                  <AddDateVehicleForm
                    handleVehicleSelection={handleVehicleSelection}
                    handleRentalChange={handleRentalChange}
                    rentalDetails={rentalDetails}
                    availableVehicles={availableVehicles}
                    onWeeklyRentChange={handleWeeklyRentChange}
                  />
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
                  title="Documents"
                  arrow={expanded === "panel3"}
                  checked={completed.panel3}
                />
              </AccordionSummary>
              <AccordionDetails>
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
                    type="submit"
                  >
                    Submit Reservation
                  </Button>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Box>

        <RentalTotal
          completed={completed}
          rentalDetails={rentalDetails}
          selectedVehicle={selectedVehicle}
        />
      </Stack>
    </Stack>
  );
}
