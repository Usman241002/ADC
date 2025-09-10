import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";
import AccordionTitle from "../components/AccordionTitle";
import AddDateVehicleForm from "../components/AddDateVehicleForm";
import RentalTotal from "../components/RentalTotal";
import useRentalForm from "../app/hooks/useRentalForm";
import { useState, useEffect } from "react";
import type { rentalDetails } from "../app/types/rentals";
import { useParams } from "react-router-dom";

export default function EditRental() {
  //Grab id from url
  const { rental_id } = useParams();

  //Accordion Setup
  const [expanded, setExpanded] = useState<string | false>("panel1");
  const [completed, setCompleted] = useState({
    panel1: false,
    panel2: false,
    panel3: false,
  });

  //Fetch Rental Data states
  const [fetchData, setFetchData] = useState<rentalDetails | null>(null);

  //Set Loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRentalData() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/rentals/${rental_id}`,
        );
        const data = await response.json();

        //Remove this
        console.log("Data being fetched", data);
        if (data) {
          setFetchData({
            ...data,
            rental_id: rental_id,
            vehicle_id: data.vehicle_id.toString(),
            client_id: data.client_id.toString(),
            start_date: data.start_date,
            end_date: data.end_date,
            weekly_rent: data.applied_weekly_rent || data.weekly_rent || 0, // Use applied_weekly_rent if available
          });
          console.log(fetchData);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchRentalData();
  }, [rental_id]);

  const {
    handleVehicleSelection,
    handleRentalChange,
    handleWeeklyRentChange,
    rentalDetails,
    availableVehicles,
    handleSubmit,
  } = useRentalForm(fetchData?.client_id, fetchData?.vehicle_id, fetchData);

  const handlePanelChange =
    (panel: string) => (_event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  const selectedVehicle = availableVehicles.find(
    (vehicle) => vehicle.id.toString() === rentalDetails.vehicle_id,
  );

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Stack spacing={3}>
      <Typography id="title">Edit Reservation</Typography>
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
                    editRental={true}
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
                          setExpanded("panel2");
                          setCompleted((prev) => ({
                            ...prev,
                            panel1: true,
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
                    Update Reservation
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
