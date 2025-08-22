import { ThemeProvider, createTheme } from "@mui/material/styles";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import Payments from "./pages/Payment";
import Rentals from "./pages/Rentals";
import Vehicles from "./pages/Vehicles";

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

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/payment" element={<Payments />} />
            <Route path="/rentals" element={<Rentals />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
