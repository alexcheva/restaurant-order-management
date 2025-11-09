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

export default router;