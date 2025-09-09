import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Container,
  Paper,
  Stack,
  Typography,
  Grid,
  IconButton,
  TextField,
  Box,
  Button,
  InputAdornment,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { userLogin } from "../features/usersSlice";

type UserDetails = {
  username: string;
  password: string;
};

export default function Login() {
  const [userDetails, setUserDetails] = useState<UserDetails>({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("handleSubmit");

    const { username, password } = userDetails;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        },
      );

      if (!response.ok) {
        <Alert severity="warning">Login Failed</Alert>;
        throw new Error("Login failed");
      }

      const data = await response.json();
      console.log(data);
      dispatch(userLogin(data));
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box component="form" onSubmit={handleSubmit}>
        <Paper component={Stack} spacing={4} padding={8} sx={{ flex: 1 }}>
          <Stack
            spacing={2}
            justifyContent="center"
            alignItems="center"
            direction="column"
          >
            <Typography variant="h4" fontWeight="bold">
              Welcome Back!
            </Typography>

            <Typography variant="h6">
              Sign in to your Accident Direct Claims Account
            </Typography>
          </Stack>

          <Grid
            container
            spacing={3}
            direction="column"
            justifyContent="center"
            alignItems="center"
            width="100%"
          >
            <Grid size={10}>
              <TextField
                size="small"
                name="username"
                label="Username"
                variant="outlined"
                type="text"
                value={userDetails.username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setUserDetails({ ...userDetails, username: e.target.value })
                }
                fullWidth
                required
              />
            </Grid>
            <Grid size={10}>
              <TextField
                size="small"
                name="password"
                label="Password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                value={userDetails.password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setUserDetails({ ...userDetails, password: e.target.value })
                }
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handlePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                fullWidth
                required
              />
            </Grid>
          </Grid>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              sx={{ backgroundColor: "primary.main", color: "#FFFFFF" }}
              type="submit"
            >
              Sign In
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
