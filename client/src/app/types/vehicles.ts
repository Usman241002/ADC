export type councilPlate = {
  city: string;
  plate_number: string;
  renewal_date: string;
};

export type vehicleDetails = {
  id: number;
  vrm: string;
  make: string;
  model: string;
  mileage: number;
  mot_expiry_date: string;
  road_tax_expiry_date: string;
  renewal_expiry_date: string;
  council_plates: councilPlate[];
  company: string;
  weekly_rent: number;
  vehicle_type: "Standard" | "Executive";
  status: "Available" | "Reserved" | "Maintenance";
};
