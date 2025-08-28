import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import AccordionTitle from "../components/AccordionTitle";
import Input from "../components/Input";
import { PersonAddAlt1Outlined } from "@mui/icons-material";

type address = {
  street_name: string;
  city: string;
  postcode: string;
};

type clientDetails = {
  first_name: string;
  last_name: string;
  address: address;
  email_address: string;
  phone_number: string;
  date_of_birth: string;
  license_number: string;
  issuing_authority: string;
  license_expiry: string;
};

export default function AddRental() {
  const [expanded, setExpanded] = useState<string | false>("panel1");
  const [clientInfoVisibility, setClientInfoVisibility] =
    useState<boolean>(false);
  const [client, setClient] = useState<clientDetails>({
    first_name: "",
    last_name: "",
    address: {
      street_name: "",
      city: "",
      postcode: "",
    },
    email_address: "",
    phone_number: "",
    date_of_birth: "",
    license_number: "",
    issuing_authority: "DVLA",
    license_expiry: "",
  });

  const handlePanelChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  function handleClientChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    // Check if the field is an address field
    if (name.startsWith("address_")) {
      const addressField = name.replace("address_", "");
      setClient((prevDetails: clientDetails) => ({
        ...prevDetails,
        address: {
          ...prevDetails.address,
          [addressField]: value,
        },
      }));
    } else {
      setClient((prevDetails: clientDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    }
    console.log(client);
  }

  async function handleClientSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Check all main fields
    if (
      !client.first_name ||
      !client.last_name ||
      !client.address.street_name ||
      !client.address.postcode ||
      !client.address.city ||
      !client.email_address ||
      !client.phone_number ||
      !client.date_of_birth ||
      !client.license_number ||
      !client.issuing_authority ||
      !client.license_expiry
    ) {
      alert("Please fill in all required fields");
      return;
    }

    console.log("Form is valid, submitting:", client);
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/clients`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(client),
      },
    );
    const data = await response.json();
    console.log("Response data:", data);
  }

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
              <AccordionTitle title="Customer" arrow={expanded === "panel1"} />
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={4}>
                {clientInfoVisibility === true ? (
                  <Box
                    component="form"
                    sx={{ display: "flex", flexDirection: "column", gap: 4 }}
                    onSubmit={handleClientSubmit}
                  >
                    <Grid container spacing={4}>
                      <Input
                        size={3}
                        name="first_name"
                        label="First Name"
                        value={client.first_name}
                        type="text"
                        handleChange={handleClientChange}
                      />
                      <Input
                        size={3}
                        name="last_name"
                        label="Last Name"
                        value={client.last_name}
                        type="text"
                        handleChange={handleClientChange}
                      />
                      <Input
                        size={3}
                        name="date_of_birth"
                        label="Date of Birth"
                        value={client.date_of_birth}
                        type="Date"
                        handleChange={handleClientChange}
                      />
                      <Grid size={3}></Grid>
                      <Input
                        size={3}
                        name="address_street_name"
                        label="Street Name"
                        value={client.address.street_name}
                        type="text"
                        handleChange={handleClientChange}
                      />
                      <Input
                        size={3}
                        name="address_city"
                        label="City"
                        value={client.address.city}
                        type="text"
                        handleChange={handleClientChange}
                      />
                      <Input
                        size={3}
                        name="address_postcode"
                        label="Postcode"
                        value={client.address.postcode}
                        type="text"
                        handleChange={handleClientChange}
                      />
                      <Grid size={3}></Grid>
                      <Input
                        size={3}
                        name="phone_number"
                        label="Phone Number"
                        value={client.phone_number}
                        type="text"
                        handleChange={handleClientChange}
                      />
                      <Input
                        size={3}
                        name="email_address"
                        label="Email Address"
                        value={client.email_address}
                        type="text"
                        handleChange={handleClientChange}
                      />
                      <Grid size={6}></Grid>
                      <Input
                        size={3}
                        name="license_number"
                        label="License Number"
                        value={client.license_number}
                        type="text"
                        handleChange={handleClientChange}
                      />
                      <Input
                        size={3}
                        name="issuing_authority"
                        label="License Issuing Authority"
                        value={client.issuing_authority}
                        type="text"
                        handleChange={handleClientChange}
                      />
                      <Input
                        size={3}
                        name="license_expiry"
                        label="License Expiry Date"
                        value={client.license_expiry}
                        type="Date"
                        handleChange={handleClientChange}
                      />
                    </Grid>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                        gap: 2,
                      }}
                    >
                      <Button
                        variant="outlined"
                        sx={{ color: "primary.main" }}
                        onClick={() => setClientInfoVisibility(false)}
                      >
                        Hide
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        sx={{ color: "#FFFFFF" }}
                      >
                        Save
                      </Button>
                    </Box>
                  </Box>
                ) : null}

                <Grid container spacing={2} sx={{ alignItems: "center" }}>
                  <Input
                    size={5}
                    name="customers"
                    label="Customers"
                    value={client.license_expiry}
                    type="select"
                    options={["Option 1", "Option 2", "Option 3"]}
                    handleChange={handleClientChange}
                  />

                  <Grid size={5}>
                    <Box>
                      <Button
                        variant="text"
                        size="small"
                        startIcon={<PersonAddAlt1Outlined />}
                        onClick={() => setClientInfoVisibility(true)}
                      >
                        Add New
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Stack>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === "panel2"}
            onChange={handlePanelChange("panel2")}
            disableGutters
          >
            <AccordionSummary>
              <AccordionTitle
                title="Date & Vehicle"
                arrow={expanded === "panel2"}
              />
            </AccordionSummary>
            <AccordionDetails></AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === "panel3"}
            onChange={handlePanelChange("panel3")}
            disableGutters
          >
            <AccordionSummary>
              <AccordionTitle title="Payment" arrow={expanded === "panel3"} />
            </AccordionSummary>
            <AccordionDetails></AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === "panel4"}
            onChange={handlePanelChange("panel4")}
            disableGutters
          >
            <AccordionSummary>
              <AccordionTitle title="Documents" arrow={expanded === "panel4"} />
            </AccordionSummary>
            <AccordionDetails></AccordionDetails>
          </Accordion>
        </Box>
      </Stack>
    </Stack>
  );
}
