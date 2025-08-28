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

export default function Rentals() {
  const rentals = [
    {
      reservation: "123456",
      info: {
        created: "2023-01-01",
        createdBy: "John Doe",
      },
      status: "Reserved",
      start: { date: "2023-01-01", time: "10:00" },
      end: { date: "2023-01-01", time: "10:00" },
      vehicle: "Toyota Corolla",
      company: "ADC Hire",
      customer: "John Doe",
      amount: "£50",
    },
  ];

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
                    <TableCell>{rental.reservation}</TableCell>
                    <TableCell>
                      <Typography variant="body1" color="#999999">
                        Created:
                      </Typography>
                      <Typography variant="body1">
                        {rental.info.created}
                      </Typography>
                      <Typography variant="body1">
                        {rental.info.createdBy}
                      </Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        color: {
                          Available: "success.main",
                          Reserved: "warning.main",
                          Maintenance: "error.main",
                        }[rental.status],
                      }}
                    >
                      {rental.status}
                    </TableCell>
                    <TableCell>
                      <DatePreview
                        date={rental.start.date}
                        time={rental.start.time}
                      />
                    </TableCell>
                    <TableCell>
                      <DatePreview
                        date={rental.end.date}
                        time={rental.end.time}
                      />
                    </TableCell>

                    <TableCell>{rental.vehicle}</TableCell>
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
                          {rental.customer.split(" ")[0][0]}
                          {rental.customer.split(" ")[1][0]}
                        </Avatar>
                        <Typography variant="body1">
                          {rental.customer.toUpperCase()}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{rental.amount}</TableCell>
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
