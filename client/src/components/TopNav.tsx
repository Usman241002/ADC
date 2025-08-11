import { AppBar, Avatar, Stack, Toolbar, Typography } from "@mui/material";
import {
  SettingsOutlined,
  NotificationsOutlined,
  HelpOutlineOutlined,
} from "@mui/icons-material";

export default function TopNav() {
  return (
    <AppBar position="fixed">
      <Toolbar
        sx={{ backgroundColor: "#FFFFFF", justifyContent: "space-between" }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{
            fontWeight: "700",
            color: "#000000",
            fontStyle: "bold",
            fontSize: "32px",
          }}
        >
          Accident Direct Claims
        </Typography>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <HelpOutlineOutlined sx={{ color: "#666666" }} />
          <NotificationsOutlined sx={{ color: "#666666" }} />
          <SettingsOutlined sx={{ color: "#666666" }} />
          <Avatar sx={{ color: "#666666" }} />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
