import { Card, CardContent, Stack, Typography } from "@mui/material";

export default function Admin() {
  return (
    <Stack spacing={3}>
      <Typography id="title">Admin</Typography>
      <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
        <CardContent></CardContent>
      </Card>
    </Stack>
  );
}
