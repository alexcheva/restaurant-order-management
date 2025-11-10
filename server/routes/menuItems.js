import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// READ all menu items
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT mi.menu_item_id, mi.name, mi.description, mi.price, mc.name AS category
      FROM menu_items mi
      JOIN menu_categories mc ON mi.category_id = mc.category_id
      ORDER BY mi.menu_item_id;
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ single menu item
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM menu_items WHERE menu_item_id = $1", [id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE menu item
router.post("/", async (req, res) => {
  try {
    const { category_id, name, description, price } = req.body;
    const result = await pool.query(
      `INSERT INTO menu_items (category_id, name, description, price)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [category_id, name, description, price]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE menu item
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { category_id, name, description, price } = req.body;
    const result = await pool.query(
      `UPDATE menu_items
       SET category_id=$1, name=$2, description=$3, price=$4
       WHERE menu_item_id=$5 RETURNING *`,
      [category_id, name, description, price, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE menu item
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM menu_items WHERE menu_item_id = $1", [id]);
    res.json({ message: "Menu item deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
