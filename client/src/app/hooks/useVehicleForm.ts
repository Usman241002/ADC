import type { vehicleDetails, councilPlate } from "../types/vehicles";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function useVehicleForm() {
  const [expanded, setExpanded] = useState<string | false>("panel1");
  const [vehicleDetails, setVehicleDetails] = useState<
    Omit<vehicleDetails, "id" | "status">
  >({
    vrm: "",
    make: "",
    model: "",
    mileage: 0,
    mot_expiry_date: "",
    road_tax_expiry_date: "",
    council_plates: [{ city: "", plate_number: "", renewal_date: "" }],
    company: "",
    weekly_rent: 0,
    vehicle_type: "Standard",
  });
  const navigate = useNavigate();

  const handlePanelChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>,
    index?: number,
  ) {
    const { name, value } = event.target;

    // Handle council plate fields
    if (name === "city" || name === "plate_number" || name === "renewal_date") {
      if (index !== undefined) {
        setVehicleDetails((prevDetails) => {
          const updatedCouncilPlates = [...prevDetails.council_plates];

          // Map the field names to the correct property names
          const fieldMap: { [key: string]: keyof councilPlate } = {
            city: "city",
            plate_number: "plate_number",
            renewal_date: "renewal_date",
          };

          const fieldName = fieldMap[name];
          if (fieldName) {
            updatedCouncilPlates[index] = {
              ...updatedCouncilPlates[index],
              [fieldName]: value,
            };
          }

          return {
            ...prevDetails,
            council_plates: updatedCouncilPlates,
          };
        });
      }
    } else {
      // Handle regular vehicle detail fields
      setVehicleDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
      console.log(vehicleDetails);
    }
  }

  function addNewCouncilPlate() {
    setVehicleDetails((prevDetails) => ({
      ...prevDetails,
      council_plates: [
        ...prevDetails.council_plates,
        { city: "", plate_number: "", renewal_date: "" },
      ],
    }));
  }

  function removeCouncilPlate(indexToRemove: number) {
    setVehicleDetails((prevDetails) => ({
      ...prevDetails,
      council_plates: prevDetails.council_plates.filter(
        (_, index: number) => index !== indexToRemove,
      ),
    }));
  }

  function handleSearch() {
    fetch(`${import.meta.env.VITE_API_URL}/api/vehicles/lookup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ registrationNumber: vehicleDetails.vrm }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setVehicleDetails({
          ...vehicleDetails,
          make: data.data.make,
          model: data.data.model,
          mot_expiry_date: data.data.motExpiryDate,
          road_tax_expiry_date: data.data.taxDueDate,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Check all main fields
    if (
      !vehicleDetails.vrm ||
      !vehicleDetails.make ||
      !vehicleDetails.model ||
      !vehicleDetails.mileage ||
      !vehicleDetails.mot_expiry_date ||
      !vehicleDetails.road_tax_expiry_date ||
      !vehicleDetails.company ||
      !vehicleDetails.weekly_rent ||
      !vehicleDetails.vehicle_type
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Check council plates - ensure each plate has all fields filled
    const hasEmptyCouncilPlate = vehicleDetails.council_plates.some(
      (plate) => !plate.city || !plate.plate_number || !plate.renewal_date,
    );

    if (hasEmptyCouncilPlate) {
      alert("Please fill in all council plate details");
      return;
    }

    // If validation passes, proceed with submission
    console.log("Form is valid, submitting:", vehicleDetails);
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/vehicles`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vehicleDetails),
      },
    );
    const data = await response.json();
    console.log("Response data:", data);

    if (response.status === 200) {
      navigate("/vehicles");
    } else {
      alert("Failed to add vehicle");
    }
  }

  return {
    expanded,
    vehicleDetails,
    setVehicleDetails,
    handlePanelChange,
    handleChange,
    addNewCouncilPlate,
    removeCouncilPlate,
    handleSubmit,
    handleSearch,
  };
}
