import { Outlet } from "react-router-dom";
import TopNav from "./TopNav";
import SubNav from "./SubNav";
import { Box, Container, Paper } from "@mui/material";

export default function Layout() {
  return (
    <>
      <TopNav />
      <Container maxWidth="xl" sx={{ marginTop: 12 }}>
        <Box component={Paper} borderRadius={2}>
          <SubNav />
          <Box sx={{ p: 3, backgroundColor: "#F5F5F5" }}>
            <Outlet />
          </Box>
        </Box>
      </Container>
    </>
  );
}
