import { Box, Stack, Typography } from "@mui/material";

type DatePreviewProps = {
  date: string; // ISO string like "2023-01-01"
  time: string; // e.g. "10:00 AM"
};

export default function DatePreview({ date, time }: DatePreviewProps) {
  const d = new Date(date);

  const month = d.toLocaleString("default", { month: "short" }).toUpperCase();
  const day = d.getDate();
  const year = d.getFullYear();

  return (
    <Stack flexDirection="column" alignItems="center" justifyContent="center">
      <Box
        sx={{
          backgroundColor: "#ECECEC",
          borderRadius: 2,
          paddingTop: 1,
        }}
      >
        <Typography
          variant="body1"
          align="center"
          fontSize="0.625rem"
          fontWeight="bold"
          sx={{ px: 1 }}
          lineHeight="0.6"
        >
          {month}
        </Typography>
        <Typography
          variant="body1"
          align="center"
          fontSize="0.875rem"
          fontWeight="bolder"
          lineHeight="1.2"
        >
          {day}
        </Typography>
        <Box
          sx={{
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
            backgroundColor: "#999999",
            width: "100%",
            height: "100%",
          }}
        >
          <Typography
            variant="body1"
            color="#666666"
            align="center"
            fontSize="0.625rem"
          >
            {year}
          </Typography>
        </Box>
      </Box>
      <Typography
        variant="body1"
        fontSize="0.875rem"
        color="#999999"
        fontWeight="bold"
      >
        {time.toUpperCase()}
      </Typography>
    </Stack>
  );
}
