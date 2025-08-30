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
