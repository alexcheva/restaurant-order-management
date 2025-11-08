-- Create schema
CREATE SCHEMA IF NOT EXISTS restaurant;
SET search_path = restaurant, public;

-- Customers
CREATE TABLE customers (
  customer_id      BIGSERIAL PRIMARY KEY,
  first_name       TEXT NOT NULL,
  last_name        TEXT NOT NULL,
  email            TEXT UNIQUE,
  phone            TEXT,
  created_at       TIMESTAMP WITH TIME ZONE DEFAULT now(),
  -- loyalty points cached for fast access (can be recalculated)
  loyalty_points   INTEGER DEFAULT 0
);

-- Menu categories
CREATE TABLE menu_categories (
  category_id   BIGSERIAL PRIMARY KEY,
  name          TEXT NOT NULL UNIQUE,
  description   TEXT
);

-- Menu items (normalized)
CREATE TABLE menu_items (
  menu_item_id  BIGSERIAL PRIMARY KEY,
  category_id   BIGINT NOT NULL REFERENCES menu_categories(category_id) ON DELETE RESTRICT,
  name          TEXT NOT NULL,
  description   TEXT,
  price         NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Orders
CREATE TABLE orders (
  order_id       BIGSERIAL PRIMARY KEY,
  customer_id    BIGINT REFERENCES customers(customer_id) ON DELETE SET NULL,
  order_status   TEXT NOT NULL CHECK (order_status IN ('pending','confirmed','preparing','ready','out_for_delivery','delivered','cancelled')),
  order_type     TEXT NOT NULL CHECK (order_type IN ('pickup','delivery','dine_in')),
  placed_at      TIMESTAMP WITH TIME ZONE DEFAULT now(),
  total_amount   NUMERIC(12,2) NOT NULL CHECK (total_amount >= 0),
  notes          TEXT
);

-- Each item on an order (store unit_price to preserve historical price)
CREATE TABLE order_items (
  order_item_id  BIGSERIAL PRIMARY KEY,
  order_id       BIGINT NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
  menu_item_id   BIGINT NOT NULL REFERENCES menu_items(menu_item_id) ON DELETE RESTRICT,
  quantity       INTEGER NOT NULL CHECK (quantity > 0),
  unit_price     NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
  item_total     NUMERIC(12,2) NOT NULL CHECK (item_total >= 0)
);

-- Delivery / fulfillment info
CREATE TABLE drivers (
  driver_id     BIGSERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  phone         TEXT
);

CREATE TABLE deliveries (
  delivery_id     BIGSERIAL PRIMARY KEY,
  order_id        BIGINT UNIQUE REFERENCES orders(order_id) ON DELETE CASCADE,
  driver_id       BIGINT REFERENCES drivers(driver_id),
  pickup_time     TIMESTAMP WITH TIME ZONE,
  delivered_time  TIMESTAMP WITH TIME ZONE,
  estimated_time  INTERVAL,
  status          TEXT CHECK (status IN ('assigned','en_route','delivered','failed','cancelled'))
);

-- Indexes to speed up common queries
CREATE INDEX idx_orders_placed_at ON orders (placed_at);
CREATE INDEX idx_orders_customer ON orders (customer_id);
CREATE INDEX idx_order_items_menu_item ON order_items (menu_item_id);
CREATE INDEX idx_menu_items_category ON menu_items (category_id);
CREATE INDEX idx_deliveries_order ON deliveries (order_id);
