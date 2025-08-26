import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AccordionTitle from "../components/AccordionTitle";
import { useState } from "react";
import AddVehicleInput from "../components/AddVehicleInput";
import { SearchOutlined } from "@mui/icons-material";

type vehicleDetails = {
  vrm: string;
  make: string;
  model: string;
  mileage: number;
  motExpiryDate: string;
  roadTaxExpiryDate: string;
  councilPlateNumber: string;
  renewalDate: string;
  company: string;
  weeklyRent: number;
};

export default function AddVehicle() {
  const [expanded, setExpanded] = useState<string | false>("panel1");
  const [vehicleDetails, setVehicleDetails] = useState<vehicleDetails>({
    vrm: "",
    make: "",
    model: "",
    mileage: 0,
    motExpiryDate: new Date().toISOString().split("T")[0],
    roadTaxExpiryDate: new Date().toISOString().split("T")[0],
    councilPlateNumber: "",
    renewalDate: new Date().toISOString().split("T")[0],
    company: "",
    weeklyRent: 0,
  });

  const handlePanelChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  function handleChange(
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) {
    setVehicleDetails((prevDetails) => ({
      ...prevDetails,
      [event.target.name]: event.target.value,
    }));
  }

  function handleSearch() {
    fetch(
      `${(import.meta as any).env.VITE_API_URL || "http://localhost:8000"}/api/vehicles/lookup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ registrationNumber: vehicleDetails.vrm }),
      },
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setVehicleDetails({
          ...vehicleDetails,
          make: data.data.make,
          model: data.data.model,
          motExpiryDate: data.data.motExpiryDate,
          roadTaxExpiryDate: data.data.taxDueDate,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }
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
              <Grid size={4}>
                <TextField
                  size="small"
                  name="vrm"
                  label="VRM"
                  variant="outlined"
                  value={vehicleDetails.vrm}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setVehicleDetails({
                      ...vehicleDetails,
                      vrm: event.target.value,
                    })
                  }
                  slotProps={{
                    htmlInput: {
                      maxLength: 7,
                      pattern: "[A-Z]{2}[0-9]{2}[A-Z]{3}",
                    },
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => handleSearch()}>
                            <SearchOutlined sx={{ color: "primary.main" }} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                  fullWidth
                />
              </Grid>

              <Grid size={8}></Grid>

              <AddVehicleInput
                size={4}
                label="Make"
                name="make"
                value={vehicleDetails.make}
                type="text"
                handleChange={handleChange}
              />
              <AddVehicleInput
                size={4}
                label="Model"
                name="model"
                value={vehicleDetails.model}
                type="text"
                handleChange={handleChange}
              />
              <AddVehicleInput
                size={4}
                label="Mileage"
                name="mileage"
                value={vehicleDetails.mileage}
                type="number"
                handleChange={handleChange}
                adornment={{ position: "end", adornment: "mi" }}
              />
              <AddVehicleInput
                size={4}
                label="MOT Expiry"
                name="motExpiryDate"
                value={vehicleDetails.motExpiryDate}
                type="Date"
                handleChange={handleChange}
              />
              <AddVehicleInput
                size={4}
                label="Road Tax Expiry"
                name="roadTaxExpiryDate"
                value={vehicleDetails.roadTaxExpiryDate}
                type="Date"
                handleChange={handleChange}
              />
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
              <AddVehicleInput
                size={3}
                name="councilPlateNumber"
                label="Council Plate Number"
                value={vehicleDetails.councilPlateNumber}
                type="text"
                handleChange={handleChange}
              />
              <AddVehicleInput
                size={3}
                name="renewalDate"
                label="Renewal Date"
                value={vehicleDetails.renewalDate}
                type="Date"
                handleChange={handleChange}
              />
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
              <AddVehicleInput
                size={3}
                name="company"
                label="Company"
                value={vehicleDetails.company}
                type="select"
                options={["ADC", "Accident Direct Claims"]}
                handleChange={handleChange}
              />
              <AddVehicleInput
                size={3}
                name="weeklyRent"
                label="Weekly Rent"
                value={vehicleDetails.weeklyRent}
                type="number"
                handleChange={handleChange}
                adornment={{ position: "start", adornment: "£" }}
              />
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Stack>
  );
}
