import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import AccordionTitle from "../components/AccordionTitle";
import AddClientForm from "../components/AddClientForm";
import useClientForm from "../app/hooks/useClientForm";

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

  const handlePanelChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  return (
    <Stack direction="row" justifyContent="space-between">
      <Stack spacing={3} width="66%">
        <Typography id="title">Add Reservation</Typography>

        <Box>
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
              <AddClientForm clientFormData={clientFormData} />
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
            <AccordionDetails></AccordionDetails>
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
      </Stack>
    </Stack>
  );
}
