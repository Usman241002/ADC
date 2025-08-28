import { Box, Typography } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

export default function AccordionTitle({
  title,
  arrow,
}: {
  title: string;
  arrow: boolean;
}) {
  return (
    <Box
      sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}
    >
      <Typography sx={{ color: "#666666", fontSize: "1.25rem" }}>
        {title}
      </Typography>

      {arrow ? (
        <KeyboardArrowUp sx={{ color: "#666666" }} />
      ) : (
        <KeyboardArrowDown sx={{ color: "#666666" }} />
      )}
    </Box>
  );
}
