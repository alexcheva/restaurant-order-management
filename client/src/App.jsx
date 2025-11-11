import './App.css';
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline, Box, Container } from "@mui/material";
import Navbar from "./components/Navbar";
import CustomersPage from "./pages/CustomersPage";
import DriversPage from "./pages/DriversPage";
import OrdersPage from "./pages/OrdersPage";
// import DeliveriesPage from "./pages/DeliveriesPage";
// import DashboardPage from './components/Dashboard';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  return (
    <Router>
      <CssBaseline />
      <Navbar />
      <Container sx={{ mt: 4 }}>
        <Box>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/drivers" element={<DriversPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            {/* <Route path="/deliveries" element={<DeliveriesPage />} /> */}
          </Routes>
        </Box>
      </Container>
    </Router>
  );
}
