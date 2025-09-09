import { FileUploadOutlined, SearchOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  InputAdornment,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import VehicleTable from "../components/VehicleTable.tsx";
import { setVehicles } from "../features/vehiclesSlice.ts";
import { useEffect, useState } from "react";

export default function Vehicles() {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchCarData() {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/vehicles`,
      );
      const data = await response.json();
      dispatch(setVehicles(data));
    }
    fetchCarData();
  }, [dispatch]);

  return (
    <Stack spacing={3}>
      <Typography id="title">Vehicles</Typography>
      <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            sx={{
              px: 1,
              paddingBottom: 1,
              borderBottom: "1px solid #F0F0F0",
            }}
          >
            <Toolbar sx={{ justifyContent: "space-between" }} disableGutters>
              <TextField
                size="small"
                variant="outlined"
                placeholder="Search by VRM, Vehicle or Location"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
            <Stack spacing={4} direction="row" justifyContent="end">
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
                  backgroundColor: "primary.main",
                  color: "#FFFFFF",
                  textAlign: "center",
                }}
              >
                Add Vehicle
              </Button>
            </Stack>
          </Stack>
          {/*Add Filtering */}
          <Stack spacing={1} sx={{ px: 1, marginTop: 2 }}>
            <Typography id="title">List of Vehicles</Typography>
            <VehicleTable searchTerm={searchTerm} />
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
