import {
  Avatar,
  Box,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { EditOutlined, FileDownloadOutlined } from "@mui/icons-material";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import DatePreview from "../components/DatePreview";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

interface RentalsTableProps {
  searchTerm: string;
}

export default function RentalsTable({ searchTerm }: RentalsTableProps) {
  const rentals = useSelector((state: RootState) => state.rentals);
  const navigate = useNavigate();

  // Filter rentals based on search term
  const filteredRentals = useMemo(() => {
    if (!searchTerm) return rentals;

    return rentals.filter((rental) => {
      const searchLower = searchTerm.toLowerCase();

      // Search in VRM
      if (rental.vehicle_vrm.toLowerCase().includes(searchLower)) return true;

      // Search in Vehicle (make + model)
      const vehicleName =
        `${rental.vehicle_make} ${rental.vehicle_model}`.toLowerCase();
      if (vehicleName.includes(searchLower)) return true;

      // Search in Customer name
      const customerName =
        `${rental.customer_first_name} ${rental.customer_last_name}`.toLowerCase();
      if (customerName.includes(searchLower)) return true;

      // Search in Company
      if (rental.company.toLowerCase().includes(searchLower)) return true;

      // Search in rental status
      if (rental.rental_status.toLowerCase().includes(searchLower)) return true;

      return false;
    });
  }, [rentals, searchTerm]);

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow key="header">
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
          {filteredRentals.map((rental) => (
            <TableRow key={rental.rental_id}>
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
              <TableCell>£{rental.applied_weekly_rent}</TableCell>
              <TableCell>
                <Stack direction="row" justifyContent="start">
                  <IconButton>
                    <FileDownloadOutlined color="primary" />
                  </IconButton>
                  <IconButton
                    onClick={() =>
                      navigate(`/rentals/edit/${rental.rental_id}`)
                    }
                  >
                    <EditOutlined color="primary" />
                  </IconButton>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
