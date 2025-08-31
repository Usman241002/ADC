import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

export default function AddVehicleInput({
  size,
  name,
  label,
  value,
  type,
  options = [],
  adornment = { position: "", adornment: "" },
  handleChange,
  required = true,
}: {
  size: number;
  name: string;
  label: string;
  value: string | number | Date;
  type: "text" | "number" | "Date" | "select";
  options?: string[];
  adornment?: { position: string; adornment: string };
  handleChange: (event: any) => void;
  required?: boolean;
}) {
  return (
    <Grid size={size}>
      {type !== "select" ? (
        <TextField
          size="small"
          name={name}
          label={label}
          variant="outlined"
          type={type.toLowerCase()}
          value={value}
          onChange={handleChange}
          slotProps={{
            inputLabel: type === "Date" ? { shrink: true } : undefined,
            input: {
              startAdornment:
                adornment?.position === "start"
                  ? adornment.adornment
                  : undefined,
              endAdornment:
                adornment?.position === "end" ? adornment.adornment : undefined,
            },
          }}
          fullWidth
          required={required}
        />
      ) : (
        <FormControl fullWidth>
          <InputLabel id={`select-${name}`} size="small">
            {label}
          </InputLabel>
          <Select
            labelId={`select-${name}`}
            id={`select-${name}`}
            name={name}
            size="small"
            value={value}
            label={label}
            onChange={handleChange}
            required={required}
          >
            {options.map((option, index) => (
              <MenuItem key={index} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </Grid>
  );
}
