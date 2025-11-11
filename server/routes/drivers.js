import express from "express";
import { pool } from "../db.js";
const router = express.Router();

// Show all drivers
router.get("/", async (_, res) => {
  console.log("calling get all drivers")
  const { rows } = await pool.query(`SELECT * FROM drivers`);
  console.log("rows", rows)
  res.json(rows);
});

// Get driver by id:
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM drivers WHERE driver_id = $1", [id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create driver
router.post("/", async (req, res) => {
  try {
    const { name, phone } = req.body;
    const result = await pool.query(
      `INSERT INTO drivers (name, phone)
       VALUES ($1, $2) RETURNING *`,
      [name, phone ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE driver
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone } = req.body;
    const result = await pool.query(
      `UPDATE drivers
       SET name=$1 phone=$2
       WHERE driver_id=$3 RETURNING *`,
      [name, phone, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE driver
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM drivers WHERE driver_id = $1", [id]);
    res.json({ message: "Driver deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;