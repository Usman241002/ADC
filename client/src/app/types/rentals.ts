export type rentalDetails = {
  vehicle_id: string;
  client_id: string;
  start_date: string;
  end_date: string;
  duration_days: number;
};

export type availableVehicles = {
  id: string;
  vrm: string;
  make: string;
  model: string;
  mileage: number;
  company: string;
  weekly_rent: number;
  status: "Available";
};

export interface PaymentItem {
  id: string;
  payment_type: string;
  payment_amount: number;
  payment_method: string;
  payment_date: string;
}

export interface PaymentForm {
  payment_type: string;
  payment_amount: string;
  payment_method: string;
  payment_date: string;
}

export type rentalsInfo = {
  rental_id: number;
  rental_status: string;
  start_date: string;
  end_date: string;
  vehicle_vrm: string;
  vehicle_make: string;
  vehicle_model: string;
  company: string;
  customer_first_name: string;
  customer_last_name: string;
  weekly_rent: number;
};
