import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function usePaymentForm(payment_id: string | undefined) {
  const navigate = useNavigate();

  const [payment, setPayment] = useState({
    payment_id: "",
    week_no: 0,
    start_date: "",
    end_date: "",
    amount_due: 0,
    amount_paid: 0,
    status: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    make: "",
    model: "",
    vrm: "",
    is_surcharge: false,
  });

  const [paymentForm, setPaymentForm] = useState({
    amount: 0,
    date: new Date().toISOString().split("T")[0],
    method: "Bank Transfer",
    status: "Paid",
  });

  useEffect(() => {
    async function fetchPaymentData(payment_id: string): Promise<void> {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/payments/${payment_id}`,
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch payment: ${response.statusText}`);
        }

        const data = await response.json();
        setPayment({
          ...data,
          payment_id: payment_id,
        });
        setPaymentForm((prevForm) => ({
          ...prevForm,
          amount: Number(data.amount_due),
        }));
      } catch (error) {
        console.error("Failed to fetch payment data:", error);
      }
    }

    if (payment_id) {
      fetchPaymentData(payment_id);
    }
  }, [payment_id]);

  async function handleUpdatePayment() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/payments/${payment.payment_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paymentForm),
        },
      );

      if (!response.ok) throw new Error("Failed to update payment");

      const data = await response.json();
      setPayment(data);
      navigate("/payments");
    } catch (error) {
      console.error("Update failed:", error);
    }
  }

  async function handleDeletePayment() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/payments/${payment.payment_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to delete payment: ${response.statusText}`);
      }

      navigate("/payments");
    } catch (error) {
      console.error("Delete failed:", error);
    }
  }

  function handlePaymentChange(event: React.ChangeEvent<HTMLInputElement>) {
    setPaymentForm({ ...paymentForm, [event.target.name]: event.target.value });
  }

  return {
    payment,
    paymentForm,
    handlePaymentChange,
    handleUpdatePayment,
    handleDeletePayment,
  };
}
