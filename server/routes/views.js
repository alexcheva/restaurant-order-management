import express from "express";
import { pool } from "../db.js";

const router = express.Router();

router.get("/sales_summary_by_day", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM sales_summary_by_day;");
  res.json(rows);
});

router.get("/monthly_category_sales", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM monthly_category_sales;");
  res.json(rows);
});

router.get("/customer_loyalty_summary", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM customer_loyalty_summary;");
  res.json(rows);
});

router.get("/delivery_performance", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM delivery_performance;");
  res.json(rows);
});

export default router;
