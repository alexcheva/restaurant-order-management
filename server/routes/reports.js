import express from "express";
import { pool } from "../db.js";
const router = express.Router();

// Popular menu items
router.get("/popular-items", async (_, res) => {
  const { rows } = await pool.query(`
    SELECT mi.name, SUM(oi.quantity) AS qty_sold, SUM(oi.item_total) AS revenue
    FROM order_items oi
    JOIN menu_items mi ON mi.menu_item_id = oi.menu_item_id
    GROUP BY mi.name
    ORDER BY qty_sold DESC
    LIMIT 5;
  `);
  res.json(rows);
});

export default router;
