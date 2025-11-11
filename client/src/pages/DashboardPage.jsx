import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, Card, CardContent } from "@mui/material";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { fetchData } from "../api";
import ChartCard from "../components/ChartCard.jsx";
import StatsCards from "../components/StatsCards";
import SalesChart from "../components/SalesChart";
import OrdersTable from "../components/OrdersTable";
import axios from "axios";

export default function DashboardPage() {
  const baseURL = "http://localhost:4000/api"
  const route ="/views"
  const [orders, setOrders] = useState([]);
  // const [revenue, setRevenue] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [menu, setMenu] = useState([]);
  const [sales, setSales] = useState([]);
  const [loyaltySummary, setLoyaltySummary] = useState([]);
  const [salesSummary, setSalesSummary] = useState([]);
  const [categorySales, setCategorySales] = useState([]);
  const [deliveryPerformance, setDeliveryPerformance] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [ordersData, menuData, salesData, customersData] = await Promise.all([
          fetchData("orders"),
          fetchData("reports/popular-items"),
          fetchData("reports/sales"),
          fetchData("customers"),
        ]);
        setOrders(ordersData);
        // setRevenue(orders.reduce((sum, o) => sum + (o.total_amount || 0), 0));
        setMenu(menuData);
        setSales(salesData);
        setCustomers(customersData);
      } catch (err) {
        console.error(err);
      }
    })();
    fetchViews();
  }, []);

  // TODO Calculate Total Revenue
  // const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  // console.log("orders", orders, 
  //   "totalRevenue", totalRevenue, 
  // )
  console.log("menu", menu ,"sales", sales)
  const fetchViews = async () => {
    try {
      const [sales, categories, loyalty, deliveries] = await Promise.all([
        axios.get(`${baseURL}${route}/sales_summary_by_day`),
        axios.get(`${baseURL}${route}/monthly_category_sales`),
        axios.get(`${baseURL}${route}/customer_loyalty_summary`),
        // axios.get(`${baseURL}${route}/delivery_performance`),
      ]);
      console.log(
        "sales.data", sales.data, 
        "categories.data",categories.data, 
        "loyalty.data", loyalty.data, 
        // "deliveries.data", deliveries.data
      )
      setSalesSummary(sales.data);
      setCategorySales(categories.data);
      setLoyaltySummary(loyalty.data);
      // setDeliveryPerformance(deliveries.data);

      console.log(categorySales,deliveryPerformance,salesSummary)
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };

  const colors = ["#2193f3", "#4caf50", "#ff9800", "#f44333", "#9c27b0"];

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        Restaurant Dashboard
      </Typography>

      <Grid container spacing={3}>

        {/* ToDo total revenue */}
        {/* <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Revenue
                </Typography>
              <Typography variant="h5">
                {!revenue? "Calculating...": `${revenue.toFixed(2)}`}
                </Typography>
            </CardContent>
          </Card>
        </Grid> */}

        {/* Total number of Orders */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Orders
              </Typography>
              <Typography variant="h5">{orders.length}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Total number of Customers */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Customers
              </Typography>
              <Typography variant="h5">{customers.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Customer Loyalty Summary */}
        <Grid size={{ xs:6, md:4 }}>
          <ChartCard title="Customer Loyalty Summary">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={loyaltySummary}
                  dataKey="loyalty_points"
                  nameKey="customer_name"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {loyaltySummary.map((_, index) => (
                    <Cell key={index} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
        {/* SALES OVER TIME */}
        <Grid size={{ xs: 12, sm: 6 }}>
           <ChartCard>
            <Typography variant="h6" gutterBottom>Sales Over Time</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" tickFormatter={(d) => new Date(d).toLocaleDateString()} />
                <YAxis />
                <Tooltip labelFormatter={(d) => new Date(d).toLocaleDateString()} />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue ($)" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>

        {/* REVENUE BY CATEGORY */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <ChartCard>
            <Typography variant="h6" gutterBottom>Revenue by Category</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categorySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category_name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#82ca9d" name="Revenue ($)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
        {/* DELIVERY PERFORMANCE */}

      </Grid>
    </Box>
  );
}
