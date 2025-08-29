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
  plate_number,
  renewal_date,
  index,
  handleChange,
  addNewPlate,
  removePlate,
  showAddButton,
  showRemoveButton,
}: {
  city: string;
  plate_number: string;
  renewal_date: string;
  index: number;
  handleChange: (event: any, index: number) => void;
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
        name="plate_number"
        label="Council Plate Number"
        value={plate_number}
        type="text"
        handleChange={handleCouncilPlateChange}
      />
      <Input
        size={3}
        name="renewal_date"
        label="Renewal Date"
        value={renewal_date}
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
