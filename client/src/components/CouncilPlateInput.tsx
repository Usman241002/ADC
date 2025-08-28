import { AddOutlined, RemoveOutlined } from "@mui/icons-material";
import {
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import Input from "./Input";

export default function CouncilPlateInput({
  city,
  plateNumber,
  renewalDate,
  handleChange,
  index,
  addNewPlate,
  removePlate,
  showAddButton,
  showRemoveButton,
}: {
  city: string;
  plateNumber: string;
  renewalDate: string;
  handleChange: (event: any, index?: number) => void;
  index: number;
  addNewPlate: () => void;
  removePlate: (index: number) => void;
  showAddButton: boolean;
  showRemoveButton: boolean;
}) {
  const options = ["Birmingham", "Solihull", "Wolverhampton"];

  const handleCouncilPlateChange = (event: any) => {
    handleChange(event, index);
  };

  return (
    <Grid container spacing={4} alignItems="center">
      <Grid size={3}>
        <FormControl fullWidth>
          <InputLabel id={`select-city-${index}`} size="small">
            City
          </InputLabel>
          <Select
            labelId={`select-city-${index}`}
            id={`select-city-${index}`}
            name="city"
            size="small"
            label="City"
            value={city}
            onChange={handleCouncilPlateChange}
            required
          >
            {options.map((option, optionIndex) => (
              <MenuItem key={optionIndex} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Input
        size={3}
        name="councilPlateNumber"
        label="Council Plate Number"
        value={plateNumber}
        type="text"
        handleChange={handleCouncilPlateChange}
      />
      <Input
        size={3}
        name="renewalDate"
        label="Renewal Date"
        value={renewalDate}
        type="Date"
        handleChange={handleCouncilPlateChange}
      />
      {showAddButton && (
        <Grid size="auto">
          <Tooltip title="Add Plate">
            <IconButton
              onClick={addNewPlate}
              sx={{ backgroundColor: "#FFFFFF" }}
            >
              <AddOutlined sx={{ color: "primary.main" }} />
            </IconButton>
          </Tooltip>
        </Grid>
      )}
      {showRemoveButton && (
        <Grid size="auto">
          <Tooltip title="Remove Plate">
            <IconButton
              onClick={() => removePlate(index)}
              sx={{ backgroundColor: "#FFFFFF" }}
            >
              <RemoveOutlined sx={{ color: "error.main" }} />
            </IconButton>
          </Tooltip>
        </Grid>
      )}
    </Grid>
  );
}
