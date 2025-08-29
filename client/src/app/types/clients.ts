type address = {
  street_name: string;
  city: string;
  postcode: string;
};

export type clientDetails = {
  first_name: string;
  last_name: string;
  address: address;
  email_address: string;
  phone_number: string;
  date_of_birth: string;
  license_number: string;
  issuing_authority: string;
  license_expiry: string;
};

export type client = {
  id: string;
  first_name: string;
  last_name: string;
};
