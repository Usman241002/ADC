import {
  Box,
  Paper,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import { TuneOutlined } from "@mui/icons-material";

export default function Dashboard() {
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
  ];

  return (
    <Stack spacing={3}>
      <Typography id="title">Dashboard</Typography>

      <Box sx={{ backgroundColor: "#FFFFFF", borderRadius: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "start",
            padding: 3,
            gap: 3,
            borderBottom: "1px solid #F0F0F0",
          }}
        >
          <Typography id="subtitle">Vehicle Status</Typography>
          <TuneOutlined sx={{ color: "#666666" }} />
        </Box>

        {/** Replace with appropriate code */}
        {/*Add Filtering */}
        <TableContainer component={Paper} sx={{ px: 3, py: 2 }}>
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
      </Box>

      <Stack direction="row" spacing={3}>
        <Box sx={{ backgroundColor: "#FFFFFF", borderRadius: 1, flex: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "start",
              padding: 3,
              gap: 3,
              borderBottom: "1px solid #F0F0F0",
            }}
          >
            <Typography id="subtitle">Daily Plan</Typography>
            <TuneOutlined sx={{ color: "#666666" }} />
          </Box>
        </Box>

        <Box sx={{ backgroundColor: "#FFFFFF", borderRadius: 1, flex: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "start",
              padding: 3,
              gap: 3,
              borderBottom: "1px solid #F0F0F0",
            }}
          >
            <Typography id="subtitle">Revenue</Typography>
            <TuneOutlined sx={{ color: "#666666" }} />
          </Box>
        </Box>
      </Stack>
    </Stack>
  );
}
