import {
  AppBar,
  Avatar,
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { SettingsOutlined, NotificationsOutlined } from "@mui/icons-material";
import { formatDateToDDMMYYYY } from "../app/utils";

// Type definitions for better type safety
interface NotificationItem {
  vrm: string;
  road_tax_expiry_date?: string;
  mot_expiry_date?: string;
  city?: string;
  renewal_date?: string;
}

interface NotificationsData {
  tax?: NotificationItem[];
  mot?: NotificationItem[];
  plate?: NotificationItem[];
}

export default function TopNav() {
  const [notifications, setNotifications] = useState<NotificationsData | null>(
    null,
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/vehicles/notifications`,
        );
        const data = await response.json();
        console.log(data);
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setNotifications(null);
      }
    }
    fetchNotifications();
  }, []);

  const formatNotifications = (notifications: NotificationsData): string[] => {
    const messages: string[] = [];

    // tax
    if (Array.isArray(notifications.tax) && notifications.tax.length > 0) {
      notifications.tax.forEach(({ vrm, road_tax_expiry_date }) => {
        messages.push(
          `${vrm} Road Tax is expiring on ${formatDateToDDMMYYYY(road_tax_expiry_date)}`,
        );
      });
    }

    // mot
    if (Array.isArray(notifications.mot) && notifications.mot.length > 0) {
      notifications.mot.forEach(({ vrm, mot_expiry_date }) => {
        messages.push(
          `${vrm} MOT is expiring on ${formatDateToDDMMYYYY(mot_expiry_date)}`,
        );
      });
    }

    // plates
    if (Array.isArray(notifications.plate) && notifications.plate.length > 0) {
      notifications.plate.forEach(({ vrm, city, renewal_date }) => {
        messages.push(
          `${vrm} plate for ${city} is expiring on ${formatDateToDDMMYYYY(renewal_date)}`,
        );
      });
    }

    // If no messages at all
    if (messages.length === 0) {
      messages.push("No notifications available");
    }

    return messages;
  };

  // Get formatted notifications and count
  const formattedNotifications = notifications
    ? formatNotifications(notifications)
    : [];
  const notificationCount =
    formattedNotifications.length > 0 &&
    formattedNotifications[0] !== "No notifications available"
      ? formattedNotifications.length
      : 0;

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
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <IconButton onClick={handleClick}>
            <Badge badgeContent={notificationCount} color="warning">
              <NotificationsOutlined sx={{ color: "#666666" }} />
            </Badge>
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            slotProps={{
              list: {
                "aria-labelledby": "basic-button",
              },
            }}
          >
            {notifications ? (
              formattedNotifications.map((message, index) => (
                <MenuItem key={index}>{message}</MenuItem>
              ))
            ) : (
              <MenuItem>Loading notifications...</MenuItem>
            )}
          </Menu>
          <IconButton>
            <SettingsOutlined sx={{ color: "#666666" }} />
          </IconButton>
          <IconButton>
            <Avatar />
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
