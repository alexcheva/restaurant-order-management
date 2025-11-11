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

export default function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "" });
  const [editId, setEditId] = useState(null);
  const baseURL = "http://localhost:4000/api"
  const route ="/drivers"

  const fetchDrivers = async () => {
    const res = await axios.get(`${baseURL}${route}`);
    setDrivers(res.data.map((c) => ({ ...c, id: c.driver_id })));
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setFormData({ name: "", phone: "" });
    setOpen(false);
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleSave = async () => {
    if (editId) {
      await axios.put(`${baseURL}${route}/${editId}`, form);
    } else {
      await axios.post(`${baseURL}${route}`, form);
    }
    setOpen(false);
    setForm({ name: "", phone: "" });
    fetchDrivers();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${baseURL}${route}/${id}`);
    fetchDrivers();
  };

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
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
          Drivers
        </Typography>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          + Add Driver
        </Button>
      </Box>

      <DataTable
        columns={columns}
        rows={drivers}
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
        <DialogTitle>{editId ? "Edit Driver" : "Add Driver"}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            {["name", "phone"].map((f) => (
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