import React from "react";
import { useEffect, useState } from "react";
import { api } from "./api";
import OrdersTable from "./components/OrdersTable";
import CustomersTable from "./components/CustomersTable";
import PopularItems from "./components/PopularItems";

export default function App() {
  const [popular, setPopular] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    api.get("/orders").then(res => setOrders(res.data));
    api.get("/customers").then(res => setCustomers(res.data));
    api.get("/reports/popular-items").then(res => setPopular(res.data));
  }, []);

  return (
    <div className="p-6 font-sans">
      <h1 className="text-2xl font-bold mb-4">🍽️ Restaurant Dashboard</h1>
      <PopularItems data={popular} />
      <OrdersTable data={orders} />
      <CustomersTable data={customers} />
    </div>
  );
}
