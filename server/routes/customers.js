import express from "express";
import { pool } from "../db.js";
const router = express.Router();

// Show all customers
router.get("/", async (_, res) => {
  console.log("calling get all customers")
  const { rows } = await pool.query(`SELECT * FROM customers`);
  console.log("rows", rows)
  res.json(rows);
});

// Get customer by id:
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM customers WHERE customer_id = $1", [id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create customer
router.post("/", async (req, res) => {
  try {
    const { first_name, last_name, email, phone, loyalty_points } = req.body;
    const result = await pool.query(
      `INSERT INTO customers (first_name, last_name, email, phone, loyalty_points)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [first_name, last_name, email, phone, loyalty_points || 0]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE customer
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, phone, loyalty_points } = req.body;
    const result = await pool.query(
      `UPDATE customers
       SET first_name=$1, last_name=$2, email=$3, phone=$4, loyalty_points=$5
       WHERE customer_id=$6 RETURNING *`,
      [first_name, last_name, email, phone, loyalty_points, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE customer
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM customers WHERE customer_id = $1", [id]);
    res.json({ message: "Customer deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;