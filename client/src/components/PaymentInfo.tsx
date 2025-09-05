import { Grid, Typography } from "@mui/material";

export default function PaymentInfo({
  title,
  body,
  size = 1.5,
}: {
  title: string;
  body: string;
  size?: number;
}) {
  return (
    <Grid
      size={size}
      sx={{
        borderLeft: "2px solid #666666",
        px: 1,
      }}
    >
      <Typography
        sx={{
          color: "#999999",
          fontSize: "0.875rem",
          borderBottom: "none",
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          color: "#333333",
          fontSize: "1rem",
        }}
      >
        {body}
      </Typography>
    </Grid>
  );
}
