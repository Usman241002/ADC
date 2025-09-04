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
import RentalTotal from "../components/RentalTotal";
import useRentalForm from "../app/hooks/useRentalForm";

import { useNavigate, useParams } from "react-router-dom";
import AddDateVehicleForm from "../components/AddDateVehicleForm";

export default function EditRental() {
  const [expanded, setExpanded] = useState<string | false>("panel1");
  const [completed, setCompleted] = useState({
    panel1: false,
    panel2: false,
  });

  const { rental_id } = useParams<{ rental_id?: string }>();
  const navigate = useNavigate();

  async function fetchRental() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/rentals/${rental_id}`,
      );
      const data = await response.json();
      console.log(data);
      const vehicle_id = data.vehicle_id;
      const client_id = data.client_id;
      return { vehicle_id, client_id };
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (rental_id) {
      fetchRental();
    }
  }, [rental_id]);

  const {
    setRentalDetails,
    rentalDetails,
    availableVehicles,
    handleVehicleSelection,
    handleRentalChange,
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
      <Typography id="title">Edit Rental</Typography>

      <Stack spacing={4} direction="row" justifyContent="space-between">
        <Box width="65%">
          <Box component="form" onSubmit={handleSubmit}>
            <Accordion
              expanded={expanded === "panel1"}
              onChange={handlePanelChange("panel1")}
              disableGutters
            >
              <AccordionSummary>
                <AccordionTitle
                  title="Date & Vehicle"
                  arrow={expanded === "panel1"}
                  checked={completed.panel1}
                />
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={4}>
                  <AddDateVehicleForm
                    handleVehicleSelection={handleVehicleSelection}
                    handleRentalChange={handleRentalChange}
                    rentalDetails={rentalDetails}
                    availableVehicles={availableVehicles}
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
                          setExpanded("panel2");
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
              expanded={expanded === "panel2"}
              onChange={handlePanelChange("panel2")}
              disableGutters
              disabled={!completed.panel1}
            >
              <AccordionSummary>
                <AccordionTitle
                  title="Documents"
                  arrow={expanded === "panel2"}
                  checked={completed.panel2}
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
