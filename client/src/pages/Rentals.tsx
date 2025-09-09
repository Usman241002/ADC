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
import { FileUploadOutlined, SearchOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";
import RentalsTable from "../components/RentalsTable";
import { useDispatch } from "react-redux";
import { setRentals } from "../features/rentalsSlice";
import { useEffect, useState } from "react";

export default function Rentals() {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchRentalsData() {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/rentals`,
      );
      const data = await response.json();
      dispatch(setRentals(data));
    }
    fetchRentalsData();
  }, [dispatch]);

  return (
    <Stack spacing={3}>
      <Typography id="title">Rentals</Typography>
      <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              px: 1,
              paddingBottom: 1,
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
                placeholder="Search by VRM, Vehicle or Customer"
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
                <FileUploadOutlined sx={{ color: "#999999" }} />
                Export
              </Button>
              <Button
                variant="contained"
                size="medium"
                component={Link}
                to="/rentals/add"
                sx={{
                  display: "flex",
                  fontSize: "1rem",
                  textTransform: "none",
                  color: "#FFFFFF",
                  textAlign: "center",
                }}
              >
                Add Reservation
              </Button>
            </Stack>
          </Stack>
          {/*Add Filtering */}
          <Stack sx={{ px: 1 }}>
            <RentalsTable searchTerm={searchTerm} />
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
