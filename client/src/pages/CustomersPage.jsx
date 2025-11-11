import React, { useEffect, useState } from "react";
import axios from "axios";
import { Dialog, 
  DialogTitle, 
  DialogContent, 
  TextField, 
  Typography,
  Button, 
  Box } from "@mui/material";
import DataTable from "../components/DataTable";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ first_name: "", last_name: "", phone: "", email: "", loyalty_points: "" });
  const [editId, setEditId] = useState(null);
  const baseURL = "http://localhost:4000/api"
  const route ="/customers"

  const fetchCustomers = async () => {
    const res = await axios.get(`${baseURL}${route}`);
    setCustomers(res.data.map((c) => ({ ...c, id: c.customer_id })));
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setFormData({ name: "", phone: "" });
    setOpen(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSave = async () => {
    if (editId) {
      await axios.put(`${baseURL}${route}/${editId}`, form);
    } else {
      await axios.post(`${baseURL}${route}`, form);
    }
    setOpen(false);
    setForm({ first_name: "", last_name: "", phone: "", email: "", loyalty_points: "" });
    fetchCustomers();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${baseURL}${route}/${id}`);
    fetchCustomers();
  };

  const columns = [
    { field: "first_name", headerName: "First Name", flex: 1 },
    { field: "last_name", headerName: "Last Name", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "loyalty_points", headerName: "Loyalty Points", flex: 1 },
  ];

  return (
    <Box sx={{ padding: 4 }}>
      {/* Header section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 2,
        }}
      >
        <Typography variant="h4" component="h1" fontWeight="bold">
          Customers
        </Typography>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          + Add Customer
        </Button>
      </Box>

      <DataTable
        columns={columns}
        rows={customers}
        onAdd={() => {
          setEditId(null);
          setOpen(true);
        }}
        onEdit={(row) => {
          setEditId(row.id);
          setForm(row);
          setOpen(true);
        }}
        onDelete={handleDelete}
      />

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editId ? "Edit Customer" : "Add Customer"}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            {["first_name", "last_name", "phone", "email", "loyalty_points"].map((f) => (
              <TextField
                key={f}
                label={f.replace("_", " ").toUpperCase()}
                value={form[f]}
                onChange={(e) => setForm({ ...form, [f]: e.target.value })}
              />
            ))}
            <Button variant="contained" onClick={handleSave}>Save</Button>
          </Box>
        </DialogContent>
      </Dialog>
      </Box>
  );
}
