import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Payments from "./pages/Payment";
import Rentals from "./pages/Rentals";
import Vehicles from "./pages/Vehicles";
import Admin from "./pages/Admin";

function App() {
  return (
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
  );
}

export default App;
