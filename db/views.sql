-- Daily sales summary view
CREATE OR REPLACE VIEW sales_summary_by_day AS
SELECT
  date_trunc('day', placed_at) AS day,
  COUNT(*) FILTER (WHERE order_status <> 'cancelled') AS orders_count,
  ROUND(SUM(total_amount) FILTER (WHERE order_status <> 'cancelled'),2) AS revenue,
  ROUND(AVG(total_amount) FILTER (WHERE order_status <> 'cancelled'),2) AS avg_order_value
FROM orders
GROUP BY 1
ORDER BY 1 DESC;

-- Monthly revenue & category breakdown (join order_items -> menu_items -> categories)
CREATE OR REPLACE VIEW monthly_category_sales AS
SELECT
  date_trunc('month', o.placed_at) AS month,
  mc.category_id,
  mc.name AS category_name,
  SUM(oi.quantity) AS items_sold,
  ROUND(SUM(oi.item_total),2) AS revenue
FROM order_items oi
JOIN orders o ON o.order_id = oi.order_id AND o.order_status <> 'cancelled'
JOIN menu_items mi ON mi.menu_item_id = oi.menu_item_id
JOIN menu_categories mc ON mc.category_id = mi.category_id
GROUP BY 1, mc.category_id, mc.name
ORDER BY 1 DESC, revenue DESC;

-- Delivery performance view
CREATE OR REPLACE VIEW delivery_performance AS
SELECT
  date_trunc('day', d.delivered_time) AS day,
  COUNT(*) FILTER (WHERE d.delivered_time IS NOT NULL) AS deliveries_completed,
  ROUND(AVG(EXTRACT(EPOCH FROM (d.delivered_time - d.pickup_time))/60)::numeric, 2) AS avg_delivery_minutes,
  ROUND(100.0 * SUM(CASE WHEN d.estimated_time IS NOT NULL AND d.delivered_time <= d.pickup_time + d.estimated_time THEN 1 ELSE 0 END)::numeric
    / NULLIF(COUNT(*) FILTER (WHERE d.delivered_time IS NOT NULL),0),2) AS pct_on_time
FROM deliveries d
GROUP BY 1
ORDER BY 1 DESC;

-- Customer loyalty summary (quick reference)
CREATE OR REPLACE VIEW customer_loyalty_summary AS
SELECT
  c.customer_id,
  c.first_name || ' ' || c.last_name AS customer_name,
  c.loyalty_points,
  COUNT(o.order_id) FILTER (WHERE o.order_status <> 'cancelled') AS orders_count,
  ROUND(COALESCE(SUM(o.total_amount) FILTER (WHERE o.order_status <> 'cancelled'),0),2) AS lifetime_spend
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id
GROUP BY c.customer_id, customer_name, c.loyalty_points
ORDER BY lifetime_spend DESC;