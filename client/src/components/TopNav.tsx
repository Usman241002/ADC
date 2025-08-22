import {
  AppBar,
  Avatar,
  InputAdornment,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  SettingsOutlined,
  NotificationsOutlined,
  HelpOutlineOutlined,
  SearchOutlined,
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
            fontFamily: "Poppins",
          }}
        >
          Accident Direct Claims
        </Typography>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          {/*Fix Deprecation*/}
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search"
            sx={{ width: "18.75rem" }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlined />
                  </InputAdornment>
                ),
              },
            }}
          />
          <HelpOutlineOutlined sx={{ color: "#666666" }} />
          <NotificationsOutlined sx={{ color: "#666666" }} />
          <SettingsOutlined sx={{ color: "#666666" }} />
          <Avatar />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
