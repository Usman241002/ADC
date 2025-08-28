import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import AccordionTitle from "../components/AccordionTitle";

export default function AddRental() {
  const [expanded, setExpanded] = useState<string | false>("panel1");

  const handlePanelChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };
  return (
    <Stack direction="row" justifyContent="space-between">
      <Stack spacing={3} width="66%">
        <Typography id="title">Add Reservation</Typography>

        <Box component="form">
          <Accordion
            expanded={expanded === "panel1"}
            onChange={handlePanelChange("panel1")}
            disableGutters
          >
            <AccordionSummary>
              <AccordionTitle icon="1" title="Date & Vehicle" />
            </AccordionSummary>
            <AccordionDetails></AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === "panel2"}
            onChange={handlePanelChange("panel2")}
            disableGutters
          >
            <AccordionSummary>
              <AccordionTitle icon="2" title="Customer" />
            </AccordionSummary>
            <AccordionDetails></AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === "panel3"}
            onChange={handlePanelChange("panel3")}
            disableGutters
          >
            <AccordionSummary>
              <AccordionTitle icon="3" title="Payment" />
            </AccordionSummary>
            <AccordionDetails></AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === "panel4"}
            onChange={handlePanelChange("panel4")}
            disableGutters
          >
            <AccordionSummary>
              <AccordionTitle icon="4" title="Documents" />
            </AccordionSummary>
            <AccordionDetails></AccordionDetails>
          </Accordion>
        </Box>
      </Stack>
    </Stack>
  );
}
