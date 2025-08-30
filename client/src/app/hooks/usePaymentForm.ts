import { useState } from "react";
import type { PaymentForm, PaymentItem } from "../types/rentals";

export default function usePaymentForm() {
  const [paymentForm, setPaymentForm] = useState<PaymentForm>({
    payment_type: "",
    payment_amount: "",
    payment_method: "",
    payment_date: "",
  });

  const [payments, setPayments] = useState<PaymentItem[]>([]);

  // Add this handler function
  const handlePaymentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPaymentForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return {
    setPaymentForm,
    paymentForm,
    setPayments,
    payments,
    handlePaymentChange,
  };
}
