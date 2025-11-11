import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  MenuItem,
} from "@mui/material";
import DataTable from "../components/DataTable";
import { getAll, createOne, updateOne, deleteOne, apiPut } from "../api";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  console.log("orders", orders)
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    customer: "",
    order_status: "pending",
    order_type: "pickup",
    // payment_method: "card",
    total_amount: "",
  });
  const [editId, setEditId] = useState(null);

  const fetchOrders = async () => {
    const res = await getAll("orders");
    setOrders(res.data.map((o) => ({ ...o, id: o.order_id })));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSave = async () => {
    if (editId) {
      console.log("handleSave form data", form)
      await apiPut("orders", editId, form);
    } else {
      await createOne("orders", form);
    }
    setOpen(false);
    fetchOrders();
  };

  const handleDelete = async (id) => {
    await deleteOne("orders", id);
    fetchOrders();
  };

  const columns = [
    { field: "order_id", headerName: "ID", width: 80 },
    { field: "customer", headerName: "Customer", flex: 1 },
    { field: "order_status", headerName: "Status", flex: 1 },
    { field: "order_type", headerName: "Type", flex: 1 },
    { field: "total_amount", headerName: "Total ($)", flex: 1 },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        rows={orders}
        onAdd={() => {
          setEditId(null);
          setForm({
            customer: "",
            order_status: "pending",
            order_type: "pickup",
            // Would be nice to extend the data for payment
            // payment_method: "card",
            total_amount: "",
          });
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
        <DialogTitle>{editId ? "Edit Order" : "Add Order"}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Customer"
              value={form.customer}
              onChange={(e) => setForm({ ...form, customer: e.target.value })}
            />
            <TextField
              select
              label="Order Status"
              value={form.order_status}
              onChange={(e) => setForm({ ...form, order_status: e.target.value })}
            >
              {/* CONSTRAINT order_status = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'] */}
              {['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'].map((status) => (
                <MenuItem key={status} value={status}>{status}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Order Type"
              value={form.order_type}
              onChange={(e) => setForm({ ...form, order_type: e.target.value })}
            >
              {["pickup", "delivery"].map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Total Amount"
              type="number"
              value={form.total_amount}
              onChange={(e) => setForm({ ...form, total_amount: e.target.value })}
            />
            <Button variant="contained" onClick={handleSave}>Save</Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
