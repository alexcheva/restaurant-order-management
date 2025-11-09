import express from "express";
import cors from "cors";
import ordersRouter from "./routes/orders.js";
import customersRouter from "./routes/customers.js";
import reportsRouter from "./routes/reports.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/orders", ordersRouter);
app.use("/api/customers", customersRouter);
app.use("/api/reports", reportsRouter);

app.get("/", (req, res) => res.send("Restaurant API is running"));
const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
