import { Box, Typography } from "@mui/material";

export default function AccordionTitle({
  icon,
  title,
}: {
  title: string;
  icon?: string;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <Box
        sx={{
          backgroundColor: "primary.main",
          color: "#FFFFFF",
          borderRadius: "50%",
          width: "2rem", // make width and height equal
          height: "2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
        }}
      >
        {icon}
      </Box>
      <Typography sx={{ color: "primary.main", fontSize: "1.25rem" }}>
        {title}
      </Typography>
    </Box>
  );
}
