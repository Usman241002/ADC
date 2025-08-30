import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Input from "../components/Input";
import { useEffect, useState } from "react";
import AccordionTitle from "../components/AccordionTitle";
import AddClientForm from "../components/AddClientForm";
import useClientForm from "../app/hooks/useClientForm";
import RentalTotal from "../components/RentalTotal";
import useRentalForm from "../app/hooks/useRentalForm";
import type { PaymentItem } from "../app/types/rentals";
import usePaymentForm from "../app/hooks/usePaymentForm";
import { useNavigate, useParams } from "react-router-dom";
export default function AddRental() {
  const [expanded, setExpanded] = useState<string | false>("panel1");
  const [completed, setCompleted] = useState({
    panel1: false,
    panel2: false,
    panel3: false,
    panel4: false,
  });

  const { vehicle_id } = useParams<{ vehicle_id?: string }>();
  const navigate = useNavigate();

  const clientFormData = useClientForm();
  const { selectedClientId } = clientFormData;

  const {
    rentalDetails,
    setRentalDetails,
    availableVehicles,
    handleVehicleSelection,
    handleRentalChange,
    vehiclesLoaded,
  } = useRentalForm(selectedClientId, vehicle_id);

  useEffect(() => {
    if (vehicle_id && vehiclesLoaded) {
      console.log("vehicle_id from URL:", vehicle_id);
      console.log("availableVehicles:", availableVehicles);

      const preSelectedVehicle = availableVehicles.find(
        (vehicle) => vehicle.id.toString() === vehicle_id,
      );
      console.log("preSelectedVehicle found:", preSelectedVehicle);

      if (preSelectedVehicle) {
        console.log("Vehicle pre-selected successfully");
        // Don't need to call handleVehicleSelection here since it's handled in the hook
      } else {
        console.warn(
          `Vehicle with ID ${vehicle_id} not found or not available`,
        );
        navigate("/vehicles");
      }
    }
  }, [vehicle_id, availableVehicles, vehiclesLoaded, navigate]);
  const handlePanelChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  const selectedVehicle = availableVehicles.find(
    (vehicle) => vehicle.id.toString() === rentalDetails.vehicle_id,
  );

  const {
    setPaymentForm,
    paymentForm,
    payments,
    setPayments,
    handlePaymentChange,
  } = usePaymentForm();

  const addPayment = () => {
    if (
      paymentForm.payment_type &&
      paymentForm.payment_amount &&
      paymentForm.payment_method &&
      paymentForm.payment_date
    ) {
      const newPayment: PaymentItem = {
        id: Date.now().toString(), // Simple ID generation
        payment_type: paymentForm.payment_type,
        payment_amount: parseFloat(paymentForm.payment_amount),
        payment_method: paymentForm.payment_method,
        payment_date: paymentForm.payment_date,
      };

      setPayments((prev) => [...prev, newPayment]);

      // Reset form
      setPaymentForm({
        payment_type: "",
        payment_amount: "",
        payment_method: "",
        payment_date: "",
      });
    }
  };

  // Function to remove a payment
  const removePayment = (paymentId: string) => {
    setPayments((prev) => prev.filter((payment) => payment.id !== paymentId));
  };

  // Calculate total payments

  // Calculate rental cost

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Typography id="title">Add Reservation</Typography>
      <Stack spacing={4} direction="row" justifyContent="space-between">
        <Box width="65%">
          <Accordion
            expanded={expanded === "panel1"}
            onChange={handlePanelChange("panel1")}
            disableGutters
          >
            <AccordionSummary>
              <AccordionTitle
                title="Customer"
                arrow={expanded === "panel1"}
                checked={completed.panel1}
              />
            </AccordionSummary>
            <AccordionDetails
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <AddClientForm
                clientFormData={clientFormData}
                setRentalDetails={setRentalDetails}
              />
              <Button
                variant="contained"
                sx={{ color: "#FFFFFF" }}
                onClick={() => {
                  if (selectedClientId) {
                    setExpanded("panel2");
                    setCompleted((prev) => ({
                      ...prev,
                      panel1: true,
                    }));
                  }
                }}
                disabled={!selectedClientId}
              >
                Next Step
              </Button>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === "panel2"}
            onChange={handlePanelChange("panel2")}
            disableGutters
            disabled={!completed.panel1}
          >
            <AccordionSummary>
              <AccordionTitle
                title="Date & Vehicle"
                arrow={expanded === "panel2"}
                checked={completed.panel2}
              />
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={4}>
                <Grid container spacing={4}>
                  <Input
                    size={4}
                    label="Start Date"
                    name="start_date"
                    value={rentalDetails.start_date}
                    type="Date"
                    handleChange={handleRentalChange}
                  />
                  <Input
                    size={4}
                    label="End Date"
                    name="end_date"
                    value={rentalDetails.end_date}
                    type="Date"
                    handleChange={handleRentalChange}
                  />
                  <Input
                    size={4}
                    label="Duration (days)"
                    name="duration_days"
                    value={rentalDetails.duration_days.toString()}
                    type="number"
                    handleChange={handleRentalChange}
                  />
                </Grid>
                <Box>
                  <Typography
                    sx={{
                      color: "primary.main",
                      fontSize: "1.25rem",
                    }}
                  >
                    Found {availableVehicles.length} Vehicle
                    {availableVehicles.length > 1 ? "s" : ""}
                  </Typography>

                  <TableContainer sx={{ p: 0 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell></TableCell>
                          <TableCell>Vehicle</TableCell>
                          <TableCell>VRM</TableCell>
                          <TableCell>Mileage</TableCell>
                          <TableCell>Price per/week</TableCell>
                          <TableCell>Total Price</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {availableVehicles.map((vehicle) => (
                          <TableRow key={vehicle.id}>
                            <TableCell>
                              <Checkbox
                                checked={
                                  vehicle.id.toString() ===
                                  rentalDetails.vehicle_id
                                }
                                onChange={() =>
                                  handleVehicleSelection(vehicle.id.toString())
                                }
                              />
                            </TableCell>
                            <TableCell>
                              {vehicle.make} {vehicle.model}
                            </TableCell>
                            <TableCell>{vehicle.vrm}</TableCell>
                            <TableCell>{vehicle.mileage} mi</TableCell>
                            <TableCell>£ {vehicle.weekly_rent}</TableCell>
                            <TableCell>
                              £{" "}
                              {rentalDetails.start_date &&
                              rentalDetails.end_date
                                ? (
                                    (vehicle.weekly_rent *
                                      rentalDetails.duration_days) /
                                    7
                                  ).toFixed(2)
                                : "0.00"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    sx={{ color: "#FFFFFF" }}
                    onClick={() => {
                      if (
                        rentalDetails.client_id &&
                        rentalDetails.vehicle_id &&
                        rentalDetails.start_date &&
                        rentalDetails.end_date &&
                        rentalDetails.duration_days
                      ) {
                        setExpanded("panel3");
                        setCompleted((prev) => ({
                          ...prev,
                          panel2: true,
                        }));
                      }
                    }}
                    disabled={
                      !rentalDetails.client_id ||
                      !rentalDetails.vehicle_id ||
                      !rentalDetails.start_date ||
                      !rentalDetails.end_date ||
                      !rentalDetails.duration_days
                    }
                  >
                    Next Step
                  </Button>
                </Box>
              </Stack>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === "panel3"}
            onChange={handlePanelChange("panel3")}
            disableGutters
            disabled={!completed.panel1 || !completed.panel2}
          >
            <AccordionSummary>
              <AccordionTitle
                title="Payment"
                arrow={expanded === "panel3"}
                checked={completed.panel3}
              />
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={3}>
                {/* Payment Form */}
                <Stack
                  sx={{
                    backgroundColor: "#F5F5F5",
                    p: 2,
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Add Payment
                  </Typography>
                  <Grid container spacing={4}>
                    <Input
                      size={3}
                      name="payment_type"
                      label="Payment Type"
                      value={paymentForm.payment_type}
                      type="select"
                      options={["Deposit", "Payment"]}
                      handleChange={handlePaymentChange}
                    />
                    <Input
                      size={3}
                      label="Payment Amount"
                      name="payment_amount"
                      value={paymentForm.payment_amount}
                      type="number"
                      handleChange={handlePaymentChange}
                    />
                    <Input
                      size={3}
                      name="payment_method"
                      label="Payment Method"
                      value={paymentForm.payment_method}
                      type="select"
                      options={["Bank Transfer", "Cash"]}
                      handleChange={handlePaymentChange}
                    />
                    <Input
                      size={3}
                      label="Payment Date"
                      name="payment_date"
                      value={paymentForm.payment_date}
                      type="Date"
                      handleChange={handlePaymentChange}
                    />
                  </Grid>
                  <Box
                    sx={{ mt: 2, display: "flex", justifyContent: "center" }}
                  >
                    <Button
                      variant="outlined"
                      onClick={addPayment}
                      disabled={
                        !paymentForm.payment_type ||
                        !paymentForm.payment_amount ||
                        !paymentForm.payment_method ||
                        !paymentForm.payment_date
                      }
                    >
                      Add Payment
                    </Button>
                  </Box>
                </Stack>

                {/* Payments List */}
                {payments.length > 0 && (
                  <Stack spacing={2}>
                    <Typography variant="h6">Added Payments</Typography>
                    <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Type</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Method</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {payments.map((payment) => (
                            <TableRow key={payment.id}>
                              <TableCell>{payment.payment_type}</TableCell>
                              <TableCell>
                                £{payment.payment_amount.toFixed(2)}
                              </TableCell>
                              <TableCell>{payment.payment_method}</TableCell>
                              <TableCell>{payment.payment_date}</TableCell>
                              <TableCell>
                                <Button
                                  size="small"
                                  color="error"
                                  onClick={() => removePayment(payment.id)}
                                >
                                  Remove
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Stack>
                )}

                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    sx={{ color: "#FFFFFF" }}
                    onClick={() => {
                      setExpanded("panel4");
                      setCompleted((prev) => ({
                        ...prev,
                        panel3: true,
                      }));
                    }}
                  >
                    Next Step
                  </Button>
                </Box>
              </Stack>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === "panel4"}
            onChange={handlePanelChange("panel4")}
            disableGutters
            disabled={
              !completed.panel1 || !completed.panel2 || !completed.panel3
            }
          >
            <AccordionSummary>
              <AccordionTitle
                title="Documents"
                arrow={expanded === "panel4"}
                checked={completed.panel4}
              />
            </AccordionSummary>
            <AccordionDetails></AccordionDetails>
          </Accordion>
        </Box>

        <RentalTotal
          completed={completed}
          rentalDetails={rentalDetails}
          selectedVehicle={selectedVehicle}
          payments={payments}
        />
      </Stack>
    </Box>
  );
}
