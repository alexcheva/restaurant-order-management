import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  MenuItem,
  Container,
  Typography,
} from "@mui/material";
import DataTable from "../components/DataTable";
import { getAll, createOne, updateOne, deleteOne } from "../api";
import { formatDate } from "../utils/helpers";

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    order_id: "",
    driver_id: "",
    status: "assigned",
    estimated_time: "00:30:00",
  });
  const [editId, setEditId] = useState(null);
  console.log("deliveries", deliveries);
//   delivered_time

// delivery_id

// driver
// : 
// "Diego"
// estimated_time
// : 
// {minutes: 45}
// id
// order_id
// pickup_time
// : 
// "2025-11-08T05:08:51.312Z"
// status
// : 
// "failed"
  const fetchDeliveries = async () => {
    const res = await getAll("deliveries");
    setDeliveries(res.data.map((d) => ({ ...d, id: d.delivery_id })));
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const handleAddDelivery = async () => {
    try {
      const newDelivery = {
        order_id: 1, // replace with actual order ID input in the future
        driver_id: 1,
        pickup_time: new Date(),
        delivered_time: null,
        estimated_time: "00:45:00",
        status: "assigned",
      };
      await api.post("/deliveries", newDelivery);
      fetchDeliveries(); // refresh table
    } catch (err) {
      console.error("Error adding delivery:", err);
    }
  };

  // modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...columns, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const payload = {
        ...columns,
        pickup_time: new Date().toISOString(),
        delivered_time: null,
      };
      await api.post("/deliveries", payload);
      handleClose();
      fetchDeliveries(); // Refresh table
    } catch (err) {
      console.error("Error adding delivery:", err);
    }
  };

  const handleSave = async () => {
    if (editId) {
      console.log("update delivery", form);
      await updateOne("deliveries", editId, form);
    } else {
      await createOne("deliveries", form);
    }
    setOpen(false);
    fetchDeliveries();
  };

  const handleDelete = async (id) => {
    await deleteOne("deliveries", id);
    fetchDeliveries();
  };

  const columns = [
    { field: "delivery_id", headerName: "ID", width: 80 },
    { field: "order_id", headerName: "Order ID", flex: 1 },
    { field: "driver_id", headerName: "Driver ID", flex: 1 },
    { field: "driver", headerName: "Driver", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    { field: "pickup_time", headerName: "Pickup Time", flex: 1,
      valueFormatter: (params) =>
      params?.value
          ? new Date(params.value).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "—",
     },
    { field: "delivered_time", headerName: "Delivered Time", flex: 1,
      valueFormatter: (params) =>
        params?.value
          ? new Date(params.value).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "—",
     },
    { field: "estimated_time", headerName: "Estimated", flex: 1 },
  ];

  return (
    <>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 2,
        }}
      >
        <Typography variant="h4" component="h1" fontWeight="bold">
          Deliveries
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={handleAddDelivery}
        >
          + Add Delivery
        </Button>
      </Box>

      {/* DataGrid Section */}
      <DataTable
        columns={columns}
        rows={deliveries}
        onAdd={() => {
          setEditId(null);
          setForm({ order_id: "", driver_id: "", status: "assigned", estimated_time: "00:30:00" });
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
        <DialogTitle>{editId ? "Edit Delivery" : "Add Delivery"}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Order ID"
              value={form.order_id}
              onChange={(e) => setForm({ ...form, order_id: e.target.value })}
            />
            <TextField
              label="Driver ID"
              value={form.driver_id}
              onChange={(e) => setForm({ ...form, driver_id: e.target.value })}
            />
            <TextField
              select
              label="Status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              {["assigned", "en_route", "delivered", "failed", "cancelled"].map((status) => (
                <MenuItem key={status} value={status}>{status}</MenuItem>
              ))}
            </TextField>
            <Button variant="contained" onClick={handleSave}>Save</Button>
          </Box>
        </DialogContent>
      </Dialog>
      {/* Add Delivery Modal */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Add New Delivery</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              marginTop: 1,
            }}
          >
            <TextField
              label="Order ID"
              name="order_id"
              value={columns.order_id}
              onChange={handleChange}
              fullWidth
              type="number"
              required
            />

            <TextField
              label="Driver ID"
              name="driver_id"
              value={columns.driver_id}
              onChange={handleChange}
              fullWidth
              type="number"
              required
            />

            <TextField
              label="Estimated Time"
              name="estimated_time"
              value={columns.estimated_time}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              select
              label="Status"
              name="status"
              value={columns.status}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="assigned">Assigned</MenuItem>
              <MenuItem value="en_route">En Route</MenuItem>
              <MenuItem value="delivered">Delivered</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Save Delivery
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
