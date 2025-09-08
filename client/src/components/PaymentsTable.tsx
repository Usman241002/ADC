import {
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { formatDateToDDMMYYYY } from "../app/utils.ts";

import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { Visibility, Download, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
export default function PaymentsTable() {
  const payments = useSelector((state: RootState) => state.payments);
  const navigate = useNavigate();
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Driver</TableCell>
            <TableCell>Hire Period</TableCell>

            <TableCell>Vehicle</TableCell>
            <TableCell>Payment Type</TableCell>
            <TableCell>Week No</TableCell>
            <TableCell>Payment Due</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.payment_id}>
              <TableCell>
                {`${payment.first_name} ${payment.last_name}`}
              </TableCell>
              <TableCell>
                {formatDateToDDMMYYYY(payment.start_date)} →{" "}
                {formatDateToDDMMYYYY(payment.end_date)}
              </TableCell>
              <TableCell>
                <Typography variant="body1" color="#999999">
                  {payment.vrm}
                </Typography>
                <Typography variant="body1">{`${payment.make} ${payment.model}`}</Typography>
              </TableCell>
              <TableCell>
                {payment.is_surcharge
                  ? "Surcharge"
                  : payment.week_no === 0
                    ? "Deposit"
                    : "Rent"}
              </TableCell>
              <TableCell>{payment.week_no}</TableCell>
              <TableCell>{formatDateToDDMMYYYY(payment.due_date)}</TableCell>
              <TableCell>£{payment.amount_due}</TableCell>
              <TableCell>
                <Chip
                  label={payment.status}
                  color={
                    payment.status === "Paid"
                      ? "success"
                      : payment.status === "Pending"
                        ? "warning"
                        : payment.status === "Overdue"
                          ? "error"
                          : "default"
                  }
                  sx={{ color: "#FFFFFF" }}
                />
              </TableCell>
              <TableCell align="center">
                <IconButton
                  color="primary"
                  onClick={() =>
                    navigate(`/payments/view/${payment.payment_id}`)
                  }
                >
                  <Visibility fontSize="small" />
                </IconButton>
                <IconButton color="primary">
                  <Download fontSize="small" />
                </IconButton>
                <IconButton
                  color="primary"
                  onClick={() =>
                    navigate(`/payments/edit/${payment.payment_id}`)
                  }
                >
                  <Edit fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
