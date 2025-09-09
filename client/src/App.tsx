import { ThemeProvider, createTheme } from "@mui/material/styles";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import type { RootState } from "./app/store";

import Layout from "./components/Layout";
import AddRental from "./pages/AddRental";
import AddVehicle from "./pages/AddVehicle";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import EditPayment from "./pages/EditPayment";
import EditRental from "./pages/EditRental";
import EditVehicle from "./pages/EditVehicle";
import Payments from "./pages/Payments";
import Rentals from "./pages/Rentals";
import Vehicles from "./pages/Vehicles";
import Login from "./pages/Login";
import { useSelector } from "react-redux";

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

  const isLoggedIn = useSelector((state: RootState) => state.users.isLoggedIn);
  const role = useSelector((state: RootState) => state.users.user?.role);

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          {isLoggedIn ? (
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/vehicles" element={<Vehicles />} />
              <Route path="/vehicles/add" element={<AddVehicle />} />
              <Route path="/vehicles/edit/:id" element={<EditVehicle />} />
              <Route path="/rentals" element={<Rentals />} />
              <Route path="/rentals/add/:vehicle_id?" element={<AddRental />} />
              <Route path="/rentals/edit/:rental_id" element={<EditRental />} />
              <Route path="/payments" element={<Payments />} />
              <Route
                path="/payments/edit/:payment_id"
                element={<EditPayment />}
              />
              {isLoggedIn && role === "admin" && (
                <Route path="/admin" element={<Admin />} />
              )}
            </Route>
          ) : (
            <Route index element={<Login />} />
          )}
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
