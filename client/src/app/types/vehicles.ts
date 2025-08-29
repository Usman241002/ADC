export type councilPlate = {
  city: string;
  plate_number: string;
  renewal_date: string;
};

export type vehicleDetails = {
  vrm: string;
  make: string;
  model: string;
  mileage: number;
  mot_expiry_date: string;
  road_tax_expiry_date: string;
  council_plates: councilPlate[];
  company: string;
  weekly_rent: number;
  status: "Available" | "Reserved" | "Maintenance";
};
