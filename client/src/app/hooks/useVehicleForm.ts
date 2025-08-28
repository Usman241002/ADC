import type { vehicleDetails, councilPlate } from "../types/vehicles";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function useVehicleForm() {
  const [expanded, setExpanded] = useState<string | false>("panel1");
  const [vehicleDetails, setVehicleDetails] = useState<vehicleDetails>({
    vrm: "",
    make: "",
    model: "",
    mileage: 0,
    motExpiryDate: "",
    roadTaxExpiryDate: "",
    councilPlates: [{ city: "", plateNumber: "", renewalDate: "" }],
    company: "",
    weeklyRent: 0,
  });
  const navigate = useNavigate();

  const handlePanelChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  function handleChange(
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
    index?: number,
  ) {
    const { name, value } = event.target;

    // Handle council plate fields
    if (
      name === "city" ||
      name === "councilPlateNumber" ||
      name === "renewalDate"
    ) {
      if (index !== undefined) {
        setVehicleDetails((prevDetails) => {
          const updatedCouncilPlates = [...prevDetails.councilPlates];

          // Map the field names to the correct property names
          const fieldMap: { [key: string]: keyof councilPlate } = {
            city: "city",
            councilPlateNumber: "plateNumber",
            renewalDate: "renewalDate",
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
            councilPlates: updatedCouncilPlates,
          };
        });
      }
    } else {
      // Handle regular vehicle detail fields
      setVehicleDetails((prevDetails: vehicleDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    }
  }

  function addNewCouncilPlate() {
    setVehicleDetails((prevDetails) => ({
      ...prevDetails,
      councilPlates: [
        ...prevDetails.councilPlates,
        { city: "", plateNumber: "", renewalDate: "" },
      ],
    }));
  }

  function removeCouncilPlate(indexToRemove: number) {
    setVehicleDetails((prevDetails: vehicleDetails) => ({
      ...prevDetails,
      councilPlates: prevDetails.councilPlates.filter(
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
          motExpiryDate: data.data.motExpiryDate,
          roadTaxExpiryDate: data.data.taxDueDate,
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
      !vehicleDetails.motExpiryDate ||
      !vehicleDetails.roadTaxExpiryDate ||
      !vehicleDetails.company ||
      !vehicleDetails.weeklyRent
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Check council plates - ensure each plate has all fields filled
    const hasEmptyCouncilPlate = vehicleDetails.councilPlates.some(
      (plate) => !plate.city || !plate.plateNumber || !plate.renewalDate,
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
