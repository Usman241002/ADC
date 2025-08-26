// routes/vehicle.ts (or vehicle.js)
import express from "express";

export const vehiclesRouter = express.Router();

interface DVLAResponse {
  registrationNumber: string;
  make: string;
  model: string;
  colour: string;
  fuelType: string;
  motExpiryDate?: string;
  taxDueDate?: string;
}

function formatDate(dateString?: string): string {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${year}-${month}-${day}`;
}

// POST /api/vehicles/lookup
vehiclesRouter.post("/lookup", async (req, res) => {
  try {
    const { registrationNumber } = req.body;

    if (!registrationNumber) {
      return res.status(400).json({
        message: "Registration number is required",
      });
    }

    const cleanVRM = registrationNumber.replace(/\s/g, "").toUpperCase();
    if (cleanVRM.length < 2 || cleanVRM.length > 8) {
      return res.status(400).json({
        message: "Invalid registration number format",
      });
    }

    const response = await fetch(process.env.DVLA_API_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.DVLA_API_KEY!,
      },
      body: JSON.stringify({
        registrationNumber: cleanVRM,
      }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({
          message: "Vehicle not found",
        });
      }
      throw new Error(`DVLA API error: ${response.status}`);
    }

    const data: DVLAResponse = await response.json();

    // Return sanitized data
    res.json({
      success: true,
      data: {
        make: data.make,
        motExpiryDate: data.motExpiryDate,
        taxDueDate: data.taxDueDate,
      },
    });
  } catch (error) {
    console.error("DVLA API Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicle data",
      error:
        process.env.NODE_ENV === "development"
          ? (error as Error).message
          : undefined,
    });
  }
});
