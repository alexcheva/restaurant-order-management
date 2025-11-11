import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

export default function ChartCard({ title, children }) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 3,
        backgroundColor: "#fff",
      }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        <Box>{children}</Box>
      </CardContent>
    </Card>
  );
}
