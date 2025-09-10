export type rentalDetails = {
  rental_id: string;
  vehicle_id: string;
  client_id: string;
  start_date: string;
  end_date: string;
  duration_days: number;
  weekly_rent: number;
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
  deposit_amount: number;
};

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
  applied_weekly_rent: number;
};
