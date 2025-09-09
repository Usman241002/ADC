import { AppBar, Box, Stack, Toolbar, Typography } from "@mui/material";
import {
  DirectionsCarFilledOutlined,
  DashboardOutlined,
  ScheduleOutlined,
  PaymentsOutlined,
  AdminPanelSettingsOutlined,
} from "@mui/icons-material";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";

export default function SubNav() {
  const subNavItems = [
    { text: "dashboard", icon: DashboardOutlined },
    { text: "vehicles", icon: DirectionsCarFilledOutlined },
    { text: "rentals", icon: ScheduleOutlined },
    { text: "payments", icon: PaymentsOutlined },
    { text: "admin", icon: AdminPanelSettingsOutlined },
  ];

  const role = useSelector((state: RootState) => state.users.user?.role);

  // filter items based on role
  const visibleNavItems = subNavItems.filter(
    (item) => item.text !== "admin" || role === "admin",
  );

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "#FFFFFF",
        padding: 0,
      }}
    >
      <Toolbar disableGutters>
        <Stack
          direction="row"
          sx={{ justifyContent: "start", alignItems: "center" }}
        >
          {visibleNavItems.map((item) => (
            <Box
              key={item.text}
              component={NavLink}
              to={`/${item.text == "dashboard" ? "" : item.text}`}
              className={({ isActive }) => (isActive ? "active" : "")}
              sx={{
                textDecoration: "none",
                color: "inherit",
                "&.active": {
                  backgroundColor: "#F5F5F5",
                  "& .MuiTypography-root": { color: "primary.main" },
                  "& .MuiSvgIcon-root": { color: "primary.main" },
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  p: 2.5,
                }}
              >
                <item.icon sx={{ color: "#666666" }} />
                <Typography sx={{ color: "#666666", ml: 1 }}>
                  {item.text.charAt(0).toUpperCase() + item.text.slice(1)}
                </Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
