import { SearchOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  InputAdornment,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { TuneOutlined, FileUploadOutlined } from "@mui/icons-material";

export default function Vehicles() {
  {
    /*Replace with appropriate code */
  }
  const fakeCarData = [
    {
      vrm: "XXXX-XXX",
      make: "Toyota",
      model: "Prius",
      year: 2022,
      mileage: 15000,
      mot: "22-08-2026",
      roadTax: "22-08-2026",
      plate: "Birmingham",
      company: "ADC",
      status: "Available",
    },
    {
      vrm: "XXXX-XXX",
      make: "Toyota",
      model: "Prius",
      year: 2022,
      mileage: 15000,
      mot: "22-08-2026",
      roadTax: "22-08-2026",
      plate: "Solihull",
      company: "ADC",
      status: "Reserved",
    },
    {
      vrm: "XXXX-XXX",
      make: "Toyota",
      model: "Prius",
      year: 2022,
      mileage: 15000,
      mot: "22-08-2026",
      roadTax: "22-08-2026",
      plate: "Wolverhampton",
      company: "ADC",
      status: "Maintenance",
    },
    {
      vrm: "XXXX-XXX",
      make: "Toyota",
      model: "Prius",
      year: 2022,
      mileage: 15000,
      mot: "22-08-2026",
      roadTax: "22-08-2026",
      plate: "Birmingham",
      company: "ADC",
      status: "Available",
    },
    {
      vrm: "XXXX-XXX",
      make: "Toyota",
      model: "Prius",
      year: 2022,
      mileage: 15000,
      mot: "22-08-2026",
      roadTax: "22-08-2026",
      plate: "Solihull",
      company: "ADC",
      status: "Reserved",
    },
    {
      vrm: "XXXX-XXX",
      make: "Toyota",
      model: "Prius",
      year: 2022,
      mileage: 15000,
      mot: "22-08-2026",
      roadTax: "22-08-2026",
      plate: "Wolverhampton",
      company: "ADC",
      status: "Maintenance",
    },
    {
      vrm: "XXXX-XXX",
      make: "Toyota",
      model: "Prius",
      year: 2022,
      mileage: 15000,
      mot: "22-08-2026",
      roadTax: "22-08-2026",
      plate: "Birmingham",
      company: "ADC",
      status: "Available",
    },
    {
      vrm: "XXXX-XXX",
      make: "Toyota",
      model: "Prius",
      year: 2022,
      mileage: 15000,
      mot: "22-08-2026",
      roadTax: "22-08-2026",
      plate: "Solihull",
      company: "ADC",
      status: "Reserved",
    },
    {
      vrm: "XXXX-XXX",
      make: "Toyota",
      model: "Prius",
      year: 2022,
      mileage: 15000,
      mot: "22-08-2026",
      roadTax: "22-08-2026",
      plate: "Wolverhampton",
      company: "ADC",
      status: "Maintenance",
    },
  ];
  return (
    <Stack spacing={3}>
      <Typography id="title">Vehicles</Typography>

      <Box sx={{ backgroundColor: "#FFFFFF", borderRadius: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "start",
            px: 3,
            py: 2,
            borderBottom: "1px solid #F0F0F0",
          }}
        >
          <Toolbar
            sx={{ width: "100%", justifyContent: "space-between" }}
            disableGutters
          >
            <TextField
              size="small"
              variant="outlined"
              placeholder="Search by VRM, Vehicle or Location"
              sx={{ width: "22rem", fontSize: "0.875rem" }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchOutlined />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Toolbar>
          <Stack spacing={4} direction="row" width="75%" justifyContent="end">
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#FFFFFF",
                color: "#999999",
                textTransform: "none",
                gap: 1,
              }}
            >
              <TuneOutlined sx={{ color: "#999999" }} />
              Filters
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#FFFFFF",
                color: "#999999",
                textTransform: "none",
                gap: 1,
              }}
            >
              <FileUploadOutlined sx={{ color: "#999999" }} />
              Export
            </Button>
            <Button
              variant="contained"
              size="medium"
              sx={{
                display: "flex",
                fontSize: "1rem",
                textTransform: "none",
                backgroundColor: "success.main",
                color: "#FFFFFF",
              }}
            >
              Add Vehicle
            </Button>
            <Button
              variant="contained"
              size="medium"
              sx={{
                display: "flex",
                fontSize: "1rem",
                textTransform: "none",
                backgroundColor: "error.main",
                color: "#FFFFFF",
              }}
            >
              Remove Vehicle
            </Button>
          </Stack>
        </Box>

        {/** Replace with appropriate code */}
        {/*Add Filtering */}
        <Stack spacing={1} sx={{ px: 3, py: 2 }}>
          <Typography id="title">List of Vehicles</Typography>
          <TableContainer sx={{ p: 0 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>VRM</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Mileage</TableCell>
                  <TableCell>MOT</TableCell>
                  <TableCell>Road Tax</TableCell>
                  <TableCell>Council Plate</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fakeCarData.map((car) => (
                  <TableRow
                    key={car.vrm}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>{car.vrm}</TableCell>
                    <TableCell>{`${car.make} ${car.model}`}</TableCell>
                    <TableCell>{car.mileage}</TableCell>
                    <TableCell>{car.mot}</TableCell>
                    <TableCell>{car.roadTax}</TableCell>
                    <TableCell>{car.plate}</TableCell>
                    <TableCell>{car.company}</TableCell>
                    <TableCell
                      sx={{
                        color: {
                          Available: "success.main",
                          Reserved: "warning.main",
                          Maintenance: "error.main",
                        }[car.status],
                      }}
                    >
                      {car.status}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          color: "primary.main",
                          backgroundColor: "#FFFFFF",
                          textTransform: "none",
                        }}
                        disabled={car.status === "Available" ? false : true}
                      >
                        Add Rental
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Box>
    </Stack>
  );
}
