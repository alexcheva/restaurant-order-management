import express from "express";
import { pool } from "../db.js";

const router = express.Router();

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

export default router;
