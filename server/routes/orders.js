import express from "express";
import { pool } from "../db.js";

const router = express.Router();
//     delivery_id bigint NOT NULL,
//     order_id bigint,
//     driver_id bigint,
//     pickup_time timestamp with time zone,
//     delivered_time timestamp with time zone,
//     estimated_time interval,
//     status text,
//     CONSTRAINT deliveries_status_check CHECK ((status = ANY (ARRAY['assigned'::text, 'en_route'::text, 'delivered'::text, 'failed'::text, 'cancelled'::text])))

// Get all recent orders
router.get("/", async (req, res) => {
  const { rows } = await pool.query(`
    SELECT o.order_id, c.first_name || ' ' || c.last_name AS customer,
           o.total_amount, o.order_status, o.order_type, o.placed_at
    FROM orders o
    JOIN customers c ON c.customer_id = o.customer_id
    WHERE o.order_status <> 'cancelled'
    ORDER BY o.placed_at DESC
    LIMIT 25;
  `);
  res.json(rows);
});

// Get full order details
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query(`
    SELECT o.*, c.first_name || ' ' || c.last_name AS customer_name,
           json_agg(json_build_object(
             'item', mi.name, 'qty', oi.quantity, 'price', oi.unit_price
           )) AS items
    FROM orders o
    JOIN customers c ON o.customer_id = c.customer_id
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN menu_items mi ON oi.menu_item_id = mi.menu_item_id
    WHERE o.order_id = $1
    GROUP BY o.order_id, c.first_name, c.last_name;
  `, [id]);
  res.json(rows[0]);
});


// READ single order
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT * FROM orders WHERE order_id = $1`,
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE order
router.post("/", async (req, res) => {
  try {
    const { customer_id, order_status, order_type, payment_method, total_price } = req.body;
    const result = await pool.query(
      `INSERT INTO orders (customer_id, order_status, order_type, payment_method, total_price)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [customer_id, order_status, order_type, payment_method, total_price]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE order
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { order_status, total_price } = req.body;
    const result = await pool.query(
      `UPDATE orders
       SET order_status=$1, total_price=$2
       WHERE order_id=$3 RETURNING *`,
      [order_status, total_price, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE order
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM orders WHERE order_id = $1", [id]);
    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
