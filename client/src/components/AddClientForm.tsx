import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import Input from "./Input";
import { PersonAddAlt1Outlined } from "@mui/icons-material";
import type { SelectChangeEvent } from "@mui/material";
import type { rentalDetails } from "../app/types/rentals";

type Client = {
  id: string;
  first_name: string;
  last_name: string;
};

export default function AddClientForm({
  clientFormData,
  setRentalDetails,
}: {
  clientFormData: any;
  setRentalDetails: React.Dispatch<
    React.SetStateAction<Omit<rentalDetails, "rental_id">>
  >;
}) {
  const {
    clientInfoVisibility,
    setClientInfoVisibility,
    client,
    clients,
    selectedClientId,
    setSelectedClientId,
    handleClientChange,
    handleClientSubmit,
  } = clientFormData;

  // Create options that preserve the client ID
  const clientOptions = clients.map((client: Client) => ({
    value: client.id,
    label: `${client.first_name} ${client.last_name}`,
  }));

  // Handle client selection
  const handleClientSelect = (e: SelectChangeEvent) => {
    setSelectedClientId(e.target.value);
    console.log(e.target.value);
    console.log(typeof e.target.value);
    setRentalDetails((prevDetails) => ({
      ...prevDetails,
      client_id: e.target.value,
    }));
  };

  return (
    <Stack spacing={4} width="100%">
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
            <Input
              size={3}
              name="national_insurance"
              label="NI Number"
              value={client.national_insurance}
              type="text"
              handleChange={handleClientChange}
            />
            <Grid size={3}></Grid>
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
            <Button type="submit" variant="contained" sx={{ color: "#FFFFFF" }}>
              Save
            </Button>
          </Box>
        </Box>
      ) : null}

      <Grid container spacing={2} sx={{ alignItems: "center" }}>
        <Grid size={5}>
          <FormControl fullWidth>
            <InputLabel id={`select-client`} size="small">
              Client
            </InputLabel>
            <Select
              labelId={`select-client`}
              id={`select-client`}
              name="client"
              size="small"
              value={selectedClientId}
              label="client"
              onChange={handleClientSelect}
              required
            >
              {clientOptions.map((option: { value: string; label: string }) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

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
  );
}
