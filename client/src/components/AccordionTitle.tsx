import { Box, Typography } from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  CheckCircle,
} from "@mui/icons-material";

export default function AccordionTitle({
  title,
  arrow,
  checked = false,
}: {
  title: string;
  arrow: boolean;
  checked?: boolean;
}) {
  return (
    <Box
      sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "start",
          width: "100%",
          gap: 4,
          alignItems: "center",
        }}
      >
        <Typography sx={{ color: "#666666", fontSize: "1.25rem" }}>
          {title}
        </Typography>
        {checked && <CheckCircle sx={{ color: "success.main" }} />}
      </Box>

      {arrow ? (
        <KeyboardArrowUp sx={{ color: "#666666" }} />
      ) : (
        <KeyboardArrowDown sx={{ color: "#666666" }} />
      )}
    </Box>
  );
}
