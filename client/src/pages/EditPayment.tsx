import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import usePaymentForm from "../app/hooks/usePaymentForm";
import { formatDateToDDMMYYYY } from "../app/utils";
import Input from "../components/Input";
import PaymentInfo from "../components/PaymentInfo";

export default function EditPayment() {
  const { payment_id } = useParams();

  const { payment, paymentForm, handlePaymentChange, handleUpdatePayment } =
    usePaymentForm(payment_id);
  return (
    <Stack spacing={3} direction="column">
      <Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "start",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography id="title">Payment {payment_id}</Typography>
          <Typography id="subtitle">Week No. {payment.week_no}</Typography>
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
        </Box>
      </Box>
      <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Stack spacing={4}>
            <Grid container spacing={2} width="100%" justifyContent="start">
              <PaymentInfo
                title={"Date"}
                body={`${formatDateToDDMMYYYY(payment.start_date)} - ${formatDateToDDMMYYYY(payment.end_date)}`}
                size={2}
              />
              <PaymentInfo
                title={"Customer Name"}
                body={`${payment.first_name} ${payment.last_name}`}
              />
              <PaymentInfo
                title={"Contact Number"}
                body={`${payment.phone_number}`}
              />
              <PaymentInfo
                title={"Vehicle"}
                body={`${payment.make} ${payment.model} ${payment.vrm}`}
                size={3}
              />
            </Grid>
            <Stack spacing={3}>
              <Typography id="subtitle">Payment Details</Typography>
              <Stack spacing={1}>
                <Typography fontSize="1.1rem">
                  Amount Due: £{payment.amount_due}
                </Typography>
                <Typography fontSize="1.1rem">
                  Amount Paid: £{payment.amount_paid}
                </Typography>

                <Typography fontSize="1.1rem">
                  Payment Type: {payment.week_no === 0 ? "Deposit" : "Rent"}
                </Typography>
              </Stack>

              <Stack spacing={3}>
                <Typography id="subtitle">Add Payment</Typography>
                <Grid container component="form" spacing={4}>
                  <Input
                    size={2}
                    name="method"
                    label="Payment Method"
                    value={paymentForm.method}
                    type="select"
                    options={["Cash", "Bank Transfer"]}
                    handleChange={handlePaymentChange}
                  />
                  <Input
                    size={2}
                    label="Amount Paid"
                    name="amount"
                    value={paymentForm.amount}
                    adornment={{ position: "start", adornment: "£" }}
                    type="number"
                    handleChange={handlePaymentChange}
                  />
                  <Input
                    size={2}
                    name="status"
                    label="Status"
                    value={paymentForm.status}
                    type="select"
                    options={["Paid", "Pending"]}
                    handleChange={handlePaymentChange}
                  />
                  <Input
                    size={2}
                    label="Payment Date"
                    name="date"
                    value={paymentForm.date}
                    type="Date"
                    handleChange={handlePaymentChange}
                  />
                </Grid>

                <Box sx={{ display: "flex", justifyContent: "start", gap: 2 }}>
                  <Button
                    variant="contained"
                    sx={{ color: "#FFFFFF" }}
                    onClick={handleUpdatePayment}
                    disabled={
                      !paymentForm.method ||
                      !paymentForm.amount ||
                      !paymentForm.status ||
                      !paymentForm.date
                    }
                  >
                    Update Payment
                  </Button>
                </Box>
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
