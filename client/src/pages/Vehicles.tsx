import {
  FileUploadOutlined,
  SearchOutlined,
  TuneOutlined,
} from "@mui/icons-material";
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
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

type vehicleData = {
  id: string;
  vrm: string;
  make: string;
  model: string;
  mileage: number;
  mot_expiry_date: string;
  road_tax_expiry_date: string;
  company: string;
  weekly_rent: number;
  status: string;
};

export default function Vehicles() {
  const [carData, setCarData] = useState<vehicleData[]>([]);

  useEffect(() => {
    async function fetchCarData() {
      const response = await fetch("http://localhost:8000/api/vehicles");
      const data = await response.json();
      console.log(data);
      setCarData(data);
    }

    fetchCarData();
  }, []);

  function formatDateToDDMMYYYY(dateStr: string) {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
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
              component={Link}
              to="/vehicles/add"
              sx={{
                display: "flex",
                fontSize: "1rem",
                textTransform: "none",
                backgroundColor: "success.main",
                color: "#FFFFFF",
                textAlign: "center",
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
                textAlign: "center",
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
                {carData.map((car) => (
                  <TableRow
                    key={car.vrm}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>{car.vrm}</TableCell>
                    <TableCell>{`${car.make} ${car.model}`}</TableCell>
                    <TableCell>{car.mileage}</TableCell>
                    <TableCell>
                      {formatDateToDDMMYYYY(car.mot_expiry_date)}
                    </TableCell>
                    <TableCell>
                      {formatDateToDDMMYYYY(car.road_tax_expiry_date)}
                    </TableCell>
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
