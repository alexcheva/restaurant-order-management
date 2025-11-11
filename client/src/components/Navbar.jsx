import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";

export default function Navbar({ value, onChange }) {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <RestaurantMenuIcon sx={{ mr: 2 }} />
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Restaurant Management
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Dashboard
        </Button>
        <Button color="inherit" component={Link} to="/customers">
          Customers
        </Button>
        <Button color="inherit" component={Link} to="/drivers">
          Drivers
        </Button>
        <Button color="inherit" component={Link} to="/orders">
          Orders
        </Button>
      </Toolbar>
    </AppBar>
  );
}
