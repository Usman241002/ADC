import { ThemeProvider, createTheme } from "@mui/material/styles";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Layout from "./components/Layout";
import Admin from "./pages/Admin";
import AddVehicle from "./pages/AddVehicle";
import Dashboard from "./pages/Dashboard";
import Payments from "./pages/Payment";
import Rentals from "./pages/Rentals";
import AddRental from "./pages/AddRental";
import Vehicles from "./pages/Vehicles";
import { setVehicles } from "./features/vehiclesSlice";

export default function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#02A0E1",
      },
      success: {
        main: "#4CD964",
      },
      warning: {
        main: "#FFD45B",
      },
      error: {
        main: "#FF0051",
      },
    },
    components: {
      MuiTableCell: {
        styleOverrides: {
          head: {
            color: "#999999",
            fontSize: "0.875rem",
            borderBottom: "none",
          },
          body: {
            color: "#333333",
            fontSize: "1rem",
          },
        },
      },
    },
  });

  const dispatch = useDispatch();

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
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/vehicles/add" element={<AddVehicle />} />
            <Route path="/rentals" element={<Rentals />} />
            <Route path="/rentals/add/:vehicle_id?" element={<AddRental />} />
            <Route path="/payment" element={<Payments />} />
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
