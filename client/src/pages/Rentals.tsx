import {
  Avatar,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  FileUploadOutlined,
  SearchOutlined,
  TuneOutlined,
  EditOutlined,
  FileDownloadOutlined,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import DatePreview from "../components/DatePreview";
import type { RootState } from "../app/store";
import { useSelector } from "react-redux";

export default function Rentals() {
  const rentals = useSelector((state: RootState) => state.rentals);
  return (
    <Stack spacing={3}>
      <Typography id="title">Rentals</Typography>

      <Box sx={{ backgroundColor: "#FFFFFF", borderRadius: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "start",
            px: 3,
            py: 2,
            borderBottom: "1px solid #F0F0F0",
          }}
        >
          <Toolbar
            sx={{ width: "100%", justifyContent: "space-between" }}
            disableGutters
          >
            <TextField
              size="small"
              variant="outlined"
              placeholder="Search by VRM, Vehicle or Location"
              sx={{ width: "22rem", fontSize: "0.875rem" }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchOutlined />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Toolbar>
          <Stack spacing={4} direction="row" width="75%" justifyContent="end">
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#FFFFFF",
                color: "#999999",
                textTransform: "none",
                gap: 1,
              }}
            >
              <TuneOutlined sx={{ color: "#999999" }} />
              Filters
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#FFFFFF",
                color: "#999999",
                textTransform: "none",
                gap: 1,
              }}
            >
              <FileUploadOutlined sx={{ color: "#999999" }} />
              Export
            </Button>
            <Button
              variant="contained"
              size="medium"
              component={Link}
              to="/rentals/add"
              sx={{
                display: "flex",
                fontSize: "1rem",
                textTransform: "none",
                color: "#FFFFFF",
                textAlign: "center",
              }}
            >
              Add Reservation
            </Button>
          </Stack>
        </Box>

        {/*Add Filtering */}
        <Stack spacing={1} sx={{ px: 3, py: 2 }}>
          <Typography id="title">List of Vehicles</Typography>
          <TableContainer sx={{ p: 0 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Info</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Start</TableCell>
                  <TableCell>End</TableCell>
                  <TableCell>Vehicle</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rentals.map((rental) => (
                  <TableRow>
                    <TableCell>{rental.rental_id}</TableCell>
                    <TableCell>
                      <Typography variant="body1" color="#999999">
                        Created:
                      </Typography>
                      <Typography variant="body1">{""}</Typography>
                      <Typography variant="body1">{""}</Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        color: {
                          Active: "warning.main",
                          Inactive: "error.main",
                        }[rental.rental_status],
                      }}
                    >
                      {rental.rental_status}
                    </TableCell>
                    <TableCell>
                      <DatePreview date={rental.start_date} time={"10:00"} />
                    </TableCell>
                    <TableCell>
                      <DatePreview date={rental.end_date} time={"10:00"} />
                    </TableCell>

                    <TableCell>
                      <Typography variant="body1" color="#999999">
                        {rental.vehicle_vrm}
                      </Typography>
                      <Typography variant="body1">{`${rental.vehicle_make} ${rental.vehicle_model}`}</Typography>
                    </TableCell>
                    <TableCell>{rental.company}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Avatar>
                          {rental.customer_first_name[0]}
                          {rental.customer_last_name[0]}
                        </Avatar>
                        <Typography variant="body1">
                          {`${rental.customer_first_name} ${rental.customer_last_name}`}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{rental.weekly_rent}</TableCell>
                    <TableCell>
                      <Stack direction="row">
                        <IconButton>
                          <FileDownloadOutlined color="primary" />
                        </IconButton>
                        <IconButton>
                          <EditOutlined color="primary" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Box>
    </Stack>
  );
}
