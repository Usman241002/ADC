import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AccordionTitle from "../components/AccordionTitle";
import { useState } from "react";
import AddVehicleInput from "../components/AddVehicleInput";

export default function AddVehicle() {
  const [expanded, setExpanded] = useState<string | false>("panel1");

  const handlePanelChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  return (
    <Stack spacing={3}>
      <Typography id="title">Add Vehicle</Typography>

      <Box>
        <Accordion
          expanded={expanded === "panel1"}
          onChange={handlePanelChange("panel1")}
          disableGutters
        >
          <AccordionSummary>
            <AccordionTitle icon="1" title="Specifications" />
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={4}>
              <AddVehicleInput size={4} label="VRM" />
              <AddVehicleInput size={4} label="Make" />
              <AddVehicleInput size={4} label="Model" />
              <AddVehicleInput size={4} label="Mileage" />
              <AddVehicleInput size={4} label="MOT Expiry" />
              <AddVehicleInput size={4} label="Road Tax Expiry" />
            </Grid>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel2"}
          onChange={handlePanelChange("panel2")}
          disableGutters
        >
          <AccordionSummary>
            <AccordionTitle icon="2" title="Taxi Details" />
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={4}>
              <AddVehicleInput size={3} label="Council Plate Number" />
              <AddVehicleInput size={3} label="Renewal Date" />
            </Grid>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel3"}
          onChange={handlePanelChange("panel3")}
          disableGutters
        >
          <AccordionSummary>
            <AccordionTitle icon="3" title="Rental Information" />
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={4}>
              <AddVehicleInput size={3} label="Company" />
              <AddVehicleInput size={3} label="Weekly Rent" />
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Stack>
  );
}
