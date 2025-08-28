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

import AccordionTitle from "../components/AccordionTitle";
import Input from "../components/Input";
import CouncilPlateInput from "../components/CouncilPlateInput";

import { useVehicleForm } from "../app/hooks/useVehicleForm";

export default function AddVehicle() {
  const {
    expanded,
    vehicleDetails,
    setVehicleDetails,
    handlePanelChange,
    handleChange,
    addNewCouncilPlate,
    removeCouncilPlate,
    handleSubmit,
    handleSearch,
  } = useVehicleForm();

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
            <AccordionTitle
              title="Specifications"
              arrow={expanded === "panel1"}
            />
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

              <Input
                size={4}
                label="Make"
                name="make"
                value={vehicleDetails.make}
                type="text"
                handleChange={handleChange}
              />
              <Input
                size={4}
                label="Model"
                name="model"
                value={vehicleDetails.model}
                type="text"
                handleChange={handleChange}
              />
              <Input
                size={4}
                label="Mileage"
                name="mileage"
                value={vehicleDetails.mileage}
                type="number"
                handleChange={handleChange}
                adornment={{ position: "end", adornment: "mi" }}
              />
              <Input
                size={4}
                label="MOT Expiry"
                name="motExpiryDate"
                value={vehicleDetails.mot_expiry_date}
                type="Date"
                handleChange={handleChange}
              />
              <Input
                size={4}
                label="Road Tax Expiry"
                name="roadTaxExpiryDate"
                value={vehicleDetails.road_tax_expiry_date}
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
            <AccordionTitle
              title="Taxi Details"
              arrow={expanded === "panel2"}
            />
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              {vehicleDetails.council_plates.map(
                ({ city, plate_number, renewal_date }, index) => (
                  <CouncilPlateInput
                    key={index}
                    index={index}
                    city={city}
                    plateNumber={plate_number}
                    renewalDate={renewal_date}
                    handleChange={handleChange}
                    addNewPlate={addNewCouncilPlate}
                    removePlate={removeCouncilPlate}
                    showAddButton={
                      index === vehicleDetails.council_plates.length - 1 &&
                      vehicleDetails.council_plates.length < 3
                    }
                    showRemoveButton={vehicleDetails.council_plates.length > 1}
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
            <AccordionTitle
              title="Rental Information"
              arrow={expanded === "panel3"}
            />
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={4} sx={{ width: "80%" }}>
              <Input
                size={3}
                name="company"
                label="Company"
                value={vehicleDetails.company}
                type="select"
                options={["ADC", "Accident Direct Claims"]}
                handleChange={handleChange}
              />
              <Input
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
