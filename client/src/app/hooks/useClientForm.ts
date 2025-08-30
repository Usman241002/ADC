import type { clientDetails, client } from "../types/clients";
import { useEffect, useState } from "react";

export default function useClientForm() {
  const [client, setClient] = useState<clientDetails>({
    first_name: "",
    last_name: "",
    address: {
      street_name: "",
      city: "",
      postcode: "",
    },
    email_address: "",
    phone_number: "",
    date_of_birth: "",
    license_number: "",
    issuing_authority: "DVLA",
    license_expiry: "",
  });
  const [clientInfoVisibility, setClientInfoVisibility] =
    useState<boolean>(false);
  const [clients, setClients] = useState<client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("");

  async function fetchClients() {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/clients`);
    const data = await response.json();

    const clientsWithStringIds = data.map(
      (client: { id: string; first_name: string; last_name: string }) => ({
        ...client,
        id: client.id.toString(),
      }),
    );
    setClients(clientsWithStringIds);
  }

  useEffect(() => {
    fetchClients();
  }, []);

  function handleClientChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;

    // Check if the field is an address field
    if (name.startsWith("address_")) {
      const addressField = name.replace("address_", "");
      setClient((prevDetails: clientDetails) => ({
        ...prevDetails,
        address: {
          ...prevDetails.address,
          [addressField]: value,
        },
      }));
    } else {
      setClient((prevDetails: clientDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    }
  }

  async function handleClientSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Check all main fields
    if (
      !client.first_name ||
      !client.last_name ||
      !client.address.street_name ||
      !client.address.postcode ||
      !client.address.city ||
      !client.email_address ||
      !client.phone_number ||
      !client.date_of_birth ||
      !client.license_number ||
      !client.issuing_authority ||
      !client.license_expiry
    ) {
      alert("Please fill in all required fields");
      return;
    }

    console.log("Form is valid, submitting:", client);
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/clients`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(client),
      },
    );
    const data = await response.json();
    console.log("Response data:", data);

    fetchClients();
  }

  return {
    clientInfoVisibility,
    setClientInfoVisibility,
    client,
    clients,
    handleClientChange,
    handleClientSubmit,
    selectedClientId,
    setSelectedClientId,
  };
}
