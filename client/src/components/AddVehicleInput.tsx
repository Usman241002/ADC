import { Grid, TextField } from "@mui/material";

export default function AddVehicleInput({
  size,
  label,
}: {
  size: number;
  label: string;
}) {
  return (
    <Grid size={size}>
      <TextField size="small" label={label} variant="outlined" fullWidth />
    </Grid>
  );
}
