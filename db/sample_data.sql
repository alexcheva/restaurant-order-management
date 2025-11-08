-- Categories
INSERT INTO restaurant.menu_categories (name, description) VALUES
('Appetizers','Small starters'),
('Mains','Main courses'),
('Desserts','Sweet treats'),
('Drinks','Beverages');

-- Menu items
INSERT INTO restaurant.menu_items (category_id, name, description, price) VALUES
(1,'Garlic Bread','Toasted with garlic butter',5.00),
(2,'Margherita Pizza','Classic tomato & cheese',12.50),
(2,'Spicy Chicken Sandwich','With chipotle mayo',10.25),
(3,'Tiramisu','Classic Italian dessert',6.00),
(4,'Soda','Can of soda',1.75);

-- Customers
INSERT INTO restaurant.customers (first_name, last_name, email, phone, loyalty_points) VALUES
('Alice','Nguyen','alice@example.com','555-0101',150),
('Bob','Patel','bob@example.com','555-0202',40),
('Carla','Morris','carla@example.com','555-0303',620);

-- Drivers
INSERT INTO restaurant.drivers (name, phone) VALUES
('Diego','555-1000'),
('Eve','555-1001'),
('Jon','555-1002');

-- assume order_id 1, etc. To keep sample simple, use explicit inserts:
INSERT INTO restaurant.orders (order_id, customer_id, order_status, order_type, placed_at, total_amount)
VALUES (1, 1, 'delivered', 'delivery', now() - interval '2 days', 22.50),
       (2, 2, 'delivered', 'pickup', now() - interval '1 day', 10.25),
       (3, 3, 'delivered', 'delivery', now() - interval '4 days', 28.00),
       (4, 1, 'cancelled', 'pickup', now() - interval '10 days', 0.00);

-- order_items: link to menu_item ids assuming earlier inserts produced ids starting at 1
INSERT INTO restaurant.order_items (order_id, menu_item_id, quantity, unit_price, item_total) VALUES
(1, 2, 1, 12.50, 12.50), -- Margherita Pizza
(1, 4, 1, 10.00, 10.00), -- suppose a special (maybe price changed) just to show unit_price stored
(2, 3, 1, 10.25, 10.25), -- Spicy Chicken Sandwich
(3, 2, 2, 12.50, 25.00),
(3, 5, 1, 3.00, 3.00); -- soda price varied at order time

INSERT INTO restaurant.deliveries (
  order_id,
  driver_id,
  pickup_time,
  delivered_time,
  estimated_time,
  status
)
VALUES
  -- Delivered: completed 30 mins early
  (1, 1,
    NOW() - INTERVAL '2 hours',          -- pickup_time
    NOW() - INTERVAL '1 hour 30 minutes',-- delivered_time
    INTERVAL '45 minutes',               -- estimated_time
    'delivered'),

  -- En route: currently in progress
  (2, 2,
    NOW() - INTERVAL '20 minutes',       -- pickup_time
    NULL,                                -- not yet delivered
    INTERVAL '40 minutes',               -- estimated delivery time
    'en_route'),

  -- Assigned: driver accepted but hasn’t picked up yet
  (3, 3,
    NULL,
    NULL,
    INTERVAL '1 hour',                   -- estimated_time before pickup
    'assigned'),

  -- Failed: delivery attempt unsuccessful
  (4, 1,
    NOW() - INTERVAL '3 hours',
    NOW() - INTERVAL '2 hours 40 minutes',
    INTERVAL '45 minutes',
    'failed')