import {
  AppBar,
  Avatar,
  Box,
  Badge,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
  Divider,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useState, useEffect } from "react";
import {
  SettingsOutlined,
  NotificationsOutlined,
  PersonOutlined,
  LogoutOutlined,
  BadgeOutlined,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { userLogout } from "../features/usersSlice";
import { formatDateToDDMMYYYY } from "../app/utils";
import type { RootState } from "../app/store";
import { useNavigate } from "react-router-dom";

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

interface FormattedNotificationItem {
  id: string;
  vrm: string;
  type: string;
  message: string;
  date: string;
  color: "error" | "warning" | "info";
  icon: Element;
}

export default function TopNav() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationsData | null>(
    null,
  );
  const [notificationsAnchorEl, setNotificationsAnchorEl] =
    useState<null | HTMLElement>(null);
  const [avatarAnchorEl, setAvatarAnchorEl] = useState<null | HTMLElement>(
    null,
  );

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.users?.user);

  const notificationsOpen = Boolean(notificationsAnchorEl);
  const avatarMenuOpen = Boolean(avatarAnchorEl);

  const handleNotificationsClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  const handleAvatarClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAvatarAnchorEl(event.currentTarget);
  };

  const handleAvatarMenuClose = () => {
    setAvatarAnchorEl(null);
  };

  const handleProfile = () => {
    handleAvatarMenuClose();
    // Navigate to profile page or open profile modal
    // You can add navigation logic here
    console.log("Navigate to profile");
  };

  const handleLogout = () => {
    handleAvatarMenuClose();
    dispatch(userLogout());
    navigate("/");
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

  const formatNotifications = (
    notifications: NotificationsData,
  ): FormattedNotificationItem[] => {
    const items: FormattedNotificationItem[] = [];

    // Tax notifications
    if (Array.isArray(notifications.tax) && notifications.tax.length > 0) {
      notifications.tax.forEach(({ vrm, road_tax_expiry_date }, index) => {
        items.push({
          id: `tax-${index}`,
          vrm,
          type: "tax",
          message: "Road Tax expiring soon",
          date: formatDateToDDMMYYYY(road_tax_expiry_date),
          color: "warning",
          icon: <BadgeOutlined />,
        });
      });
    }

    // MOT notifications
    if (Array.isArray(notifications.mot) && notifications.mot.length > 0) {
      notifications.mot.forEach(({ vrm, mot_expiry_date }, index) => {
        items.push({
          id: `mot-${index}`,
          vrm,
          type: "mot",
          message: "MOT expiring soon",
          date: formatDateToDDMMYYYY(mot_expiry_date),
          color: "error",
          icon: <BadgeOutlined />,
        });
      });
    }

    // Plate notifications
    if (Array.isArray(notifications.plate) && notifications.plate.length > 0) {
      notifications.plate.forEach(({ vrm, city, renewal_date }, index) => {
        items.push({
          id: `plate-${index}`,
          vrm,
          type: "plate",
          message: `${city} plate expiring soon`,
          date: formatDateToDDMMYYYY(renewal_date),
          color: "info",
          icon: <BadgeOutlined />,
        });
      });
    }

    return items;
  };

  // Get formatted notifications and count
  const notificationItems = notifications
    ? formatNotifications(notifications)
    : [];
  const notificationCount = notificationItems.length;

  // Get user initials for avatar
  const getUserInitials = (username?: string) => {
    if (!username) return "U";
    const names = username.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return username[0].toUpperCase();
  };

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
          {/* Notifications */}
          <IconButton onClick={handleNotificationsClick}>
            <Badge badgeContent={notificationCount} color="warning">
              <NotificationsOutlined sx={{ color: "#666666" }} />
            </Badge>
          </IconButton>
          <Menu
            id="notifications-menu"
            anchorEl={notificationsAnchorEl}
            open={notificationsOpen}
            onClose={handleNotificationsClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            slotProps={{
              paper: {
                sx: {
                  minWidth: 350,
                  maxWidth: 400,
                  maxHeight: 400,
                  mt: 1,
                },
              },
            }}
          >
            {/* Header */}
            <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid #f0f0f0" }}>
              <Typography variant="h6" fontWeight="600">
                Notifications
              </Typography>
              {notificationCount > 0 && (
                <Typography variant="caption" color="text.secondary">
                  {notificationCount} notification
                  {notificationCount !== 1 ? "s" : ""}
                </Typography>
              )}
            </Box>

            {/* Notifications List */}
            <Box sx={{ maxHeight: 300, overflow: "auto" }}>
              {notifications ? (
                notificationItems.length > 0 ? (
                  notificationItems.map((item) => (
                    <MenuItem
                      key={item.id}
                      sx={{
                        px: 2,
                        py: 1.5,
                        alignItems: "flex-start",
                        minHeight: "auto",
                        "&:hover": {
                          backgroundColor: "#f8f9fa",
                        },
                      }}
                    >
                      <ListItemIcon sx={{ mt: 0.5, minWidth: 32 }}>
                        <Box
                          sx={{
                            color:
                              item.color === "error"
                                ? "#d32f2f"
                                : item.color === "warning"
                                  ? "#ed6c02"
                                  : "#0288d1",
                          }}
                        >
                          {item.icon}
                        </Box>
                      </ListItemIcon>
                      <Box sx={{ flex: 1 }}>
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          sx={{ mb: 0.5 }}
                        >
                          <Typography variant="subtitle2" fontWeight="600">
                            {item.vrm}
                          </Typography>
                          <Chip
                            label={item.type.toUpperCase()}
                            size="small"
                            color={item.color}
                            variant="outlined"
                            sx={{ height: 20, fontSize: "0.7rem" }}
                          />
                        </Stack>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 0.5 }}
                        >
                          {item.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Expires: {item.date}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem sx={{ justifyContent: "center", py: 3 }}>
                    <Box textAlign="center">
                      <NotificationsOutlined
                        sx={{ fontSize: 48, color: "#ccc", mb: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        No notifications available
                      </Typography>
                    </Box>
                  </MenuItem>
                )
              ) : (
                <MenuItem sx={{ justifyContent: "center", py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Loading notifications...
                  </Typography>
                </MenuItem>
              )}
            </Box>
          </Menu>

          {/* Settings */}
          <IconButton>
            <SettingsOutlined sx={{ color: "#666666" }} />
          </IconButton>

          {/* Avatar with Menu */}
          <IconButton onClick={handleAvatarClick}>
            <Avatar sx={{ bgcolor: "#02A0E1" }}>
              {getUserInitials(user?.username)}
            </Avatar>
          </IconButton>
          <Menu
            id="avatar-menu"
            anchorEl={avatarAnchorEl}
            open={avatarMenuOpen}
            onClose={handleAvatarMenuClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            slotProps={{
              paper: {
                sx: {
                  minWidth: 200,
                  mt: 1,
                },
              },
            }}
          >
            {/* User Info Header */}
            <MenuItem disabled sx={{ opacity: 1 }}>
              <Stack>
                <Typography variant="subtitle2" fontWeight="600">
                  {user?.username || "User"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email || ""}
                </Typography>
              </Stack>
            </MenuItem>
            <Divider />

            {/* Profile Option */}
            <MenuItem onClick={handleProfile}>
              <ListItemIcon>
                <PersonOutlined fontSize="small" />
              </ListItemIcon>
              <ListItemText>Profile</ListItemText>
            </MenuItem>

            {/* Logout Option */}
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutOutlined fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
