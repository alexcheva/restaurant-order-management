import express from "express";
import { pool } from "../db.js";

const router = express.Router();
// deliveries (
//     delivery_id 
//     order_id 
//     driver_id 
//     pickup_time timestamp with time zone,
//     delivered_time timestamp with time zone,
//     estimated_time interval,
//     status text,
//     CONSTRAINT deliveries_status_check CHECK ((status = ANY (ARRAY['assigned'::text, 'en_route'::text, 'delivered'::text, 'failed'::text, 'cancelled'::text])))

// READ all deliveries with joined info
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.delivery_id, d.order_id, dr.name AS driver, d.status,
             d.pickup_time, d.delivered_time, d.estimated_time
      FROM deliveries d
      JOIN drivers dr ON d.driver_id = dr.driver_id
      ORDER BY d.delivery_id DESC;
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ single delivery
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT * FROM deliveries WHERE delivery_id = $1`,
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE delivery
router.post("/", async (req, res) => {
  try {
    const { order_id, driver_id, pickup_time, delivered_time, estimated_time, status } = req.body;
    const result = await pool.query(
      `INSERT INTO deliveries (order_id, driver_id, pickup_time, delivered_time, estimated_time, status)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [order_id, driver_id, pickup_time, delivered_time, estimated_time, status]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE delivery
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, delivered_time } = req.body;
    const result = await pool.query(
      `UPDATE deliveries
       SET status=$1, delivered_time=$2
       WHERE delivery_id=$3 RETURNING *`,
      [status, delivered_time, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE delivery
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM deliveries WHERE delivery_id = $1", [id]);
    res.json({ message: "Delivery deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
