import { SearchOutlined } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import AccordionTitle from "../components/AccordionTitle";
import AddVehicleInput from "../components/AddVehicleInput";
import CouncilPlateInput from "../components/CouncilPlateInput";
import { useNavigate } from "react-router-dom";

type councilPlate = {
  city: string;
  plateNumber: string;
  renewalDate: string;
};

type vehicleDetails = {
  vrm: string;
  make: string;
  model: string;
  mileage: number;
  motExpiryDate: string;
  roadTaxExpiryDate: string;
  councilPlates: councilPlate[];
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
    motExpiryDate: "",
    roadTaxExpiryDate: "",
    councilPlates: [{ city: "", plateNumber: "", renewalDate: "" }],
    company: "",
    weeklyRent: 0,
  });
  const navigate = useNavigate();

  const handlePanelChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  function handleChange(
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
    index?: number,
  ) {
    const { name, value } = event.target;

    // Handle council plate fields
    if (
      name === "city" ||
      name === "councilPlateNumber" ||
      name === "renewalDate"
    ) {
      if (index !== undefined) {
        setVehicleDetails((prevDetails) => {
          const updatedCouncilPlates = [...prevDetails.councilPlates];

          // Map the field names to the correct property names
          const fieldMap: { [key: string]: keyof councilPlate } = {
            city: "city",
            councilPlateNumber: "plateNumber",
            renewalDate: "renewalDate",
          };

          const fieldName = fieldMap[name];
          if (fieldName) {
            updatedCouncilPlates[index] = {
              ...updatedCouncilPlates[index],
              [fieldName]: value,
            };
          }

          return {
            ...prevDetails,
            councilPlates: updatedCouncilPlates,
          };
        });
      }
    } else {
      // Handle regular vehicle detail fields
      setVehicleDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    }
  }

  function addNewCouncilPlate() {
    setVehicleDetails((prevDetails) => ({
      ...prevDetails,
      councilPlates: [
        ...prevDetails.councilPlates,
        { city: "", plateNumber: "", renewalDate: "" },
      ],
    }));
  }

  function removeCouncilPlate(indexToRemove: number) {
    setVehicleDetails((prevDetails) => ({
      ...prevDetails,
      councilPlates: prevDetails.councilPlates.filter(
        (_, index) => index !== indexToRemove,
      ),
    }));
  }

  function handleSearch() {
    fetch(`${import.meta.env.VITE_API_URL}/api/vehicles/lookup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ registrationNumber: vehicleDetails.vrm }),
    })
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Check all main fields
    if (
      !vehicleDetails.vrm ||
      !vehicleDetails.make ||
      !vehicleDetails.model ||
      !vehicleDetails.mileage ||
      !vehicleDetails.motExpiryDate ||
      !vehicleDetails.roadTaxExpiryDate ||
      !vehicleDetails.company ||
      !vehicleDetails.weeklyRent
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Check council plates - ensure each plate has all fields filled
    const hasEmptyCouncilPlate = vehicleDetails.councilPlates.some(
      (plate) => !plate.city || !plate.plateNumber || !plate.renewalDate,
    );

    if (hasEmptyCouncilPlate) {
      alert("Please fill in all council plate details");
      return;
    }

    // If validation passes, proceed with submission
    console.log("Form is valid, submitting:", vehicleDetails);
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/vehicles`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vehicleDetails),
      },
    );
    const data = await response.json();
    console.log("Response data:", data);

    if (response.status === 200) {
      navigate("/vehicles");
    } else {
      alert("Failed to add vehicle");
    }
  }

  return (
    <Stack spacing={3}>
      <Typography id="title">Add Vehicle</Typography>

      <Box component="form" onSubmit={handleSubmit}>
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
            <Stack spacing={2}>
              {vehicleDetails.councilPlates.map(
                ({ city, plateNumber, renewalDate }, index) => (
                  <CouncilPlateInput
                    key={index}
                    index={index}
                    city={city}
                    plateNumber={plateNumber}
                    renewalDate={renewalDate}
                    handleChange={handleChange}
                    addNewPlate={addNewCouncilPlate}
                    removePlate={removeCouncilPlate}
                    showAddButton={
                      index === vehicleDetails.councilPlates.length - 1 &&
                      vehicleDetails.councilPlates.length < 3
                    }
                    showRemoveButton={vehicleDetails.councilPlates.length > 1}
                  />
                ),
              )}
            </Stack>
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
            <Grid container spacing={4} sx={{ width: "80%" }}>
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

              <Grid size={6}></Grid>
              <Grid size={4}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ backgroundColor: "primary.main", color: "#FFFFFF" }}
                >
                  Add Vehicle
                </Button>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Stack>
  );
}
