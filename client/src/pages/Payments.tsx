import { FileUploadOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import Input from "../components/Input";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PaymentsTable from "../components/PaymentsTable";
import { useDispatch } from "react-redux";
import { setPayments } from "../features/paymentsSlice";

export default function Payment() {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState({
    name: "",
    vrm: "",
  });
  const [driverOptions, setDriverOptions] = useState<string[]>([]);
  const [vrmOptions, setVRMOptions] = useState<string[]>([]);

  useEffect(() => {
    async function fetchPayments() {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/payments`,
      );
      const data = await response.json();
      console.log(data);

      dispatch(setPayments(data));

      // Extract unique driver names and VRMs
      const drivers = Array.from(
        new Set(
          data.map(
            (payment: string) => payment.first_name + " " + payment.last_name,
          ),
        ),
      ).filter(Boolean); // remove null/undefined

      const vrms = Array.from(
        new Set(data.map((payment: string) => payment.vrm)),
      ).filter(Boolean);

      setDriverOptions(drivers);
      setVRMOptions(vrms);
    }
    fetchPayments();
  }, [dispatch]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ ...filter, [event.target.name]: event.target.value });
  };

  return (
    <Stack spacing={3}>
      <Typography id="title">Payments</Typography>
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
              sx={{ width: "60%", justifyContent: "space-between" }}
              disableGutters
            >
              <Grid container spacing={4} sx={{ width: "100%" }}>
                <Input
                  size={3}
                  name="name"
                  label="Driver Name"
                  value={filter.name}
                  type="select"
                  options={driverOptions}
                  handleChange={handleFilterChange}
                />
                <Input
                  size={3}
                  name="vrm"
                  label="Registration"
                  value={filter.vrm}
                  type="select"
                  options={vrmOptions}
                  handleChange={handleFilterChange}
                />
              </Grid>
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
                to="/rentals/add"
                sx={{
                  display: "flex",
                  fontSize: "1rem",
                  textTransform: "none",
                  color: "#FFFFFF",
                  textAlign: "center",
                }}
              >
                Add Payment
              </Button>
            </Stack>
          </Stack>
          {/* Add Filtering */}
          <Stack sx={{ px: 1 }}>
            <PaymentsTable filter={filter} />
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
