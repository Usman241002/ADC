import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Stack,
  Typography,
} from "@mui/material";
import AccordionTitle from "../components/AccordionTitle";
import { useState } from "react";

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
          <AccordionDetails></AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel2"}
          onChange={handlePanelChange("panel2")}
          disableGutters
        >
          <AccordionSummary>
            <AccordionTitle icon="1" title="Specifications" />
          </AccordionSummary>
          <AccordionDetails></AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel3"}
          onChange={handlePanelChange("panel3")}
          disableGutters
        >
          <AccordionSummary>
            <AccordionTitle icon="1" title="Specifications" />
          </AccordionSummary>
          <AccordionDetails></AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel4"}
          onChange={handlePanelChange("panel4")}
          disableGutters
        >
          <AccordionSummary>
            <AccordionTitle icon="1" title="Specifications" />
          </AccordionSummary>
          <AccordionDetails></AccordionDetails>
        </Accordion>
      </Box>
    </Stack>
  );
}
