--
-- PostgreSQL database dump
--

\restrict PvWLv0shrHdHZUmSiSiXAmt1cbjQiVwe0g1C1LKiZ5kRhVwKwv1GxOfTibmCYc2

-- Dumped from database version 14.19 (Homebrew)
-- Dumped by pg_dump version 14.19 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: customers; Type: TABLE; Schema: public; Owner: alexluk
--

CREATE TABLE public.customers (
    customer_id bigint NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text,
    phone text,
    created_at timestamp with time zone DEFAULT now(),
    loyalty_points integer DEFAULT 0
);


ALTER TABLE public.customers OWNER TO alexluk;

--
-- Name: customers_customer_id_seq; Type: SEQUENCE; Schema: public; Owner: alexluk
--

CREATE SEQUENCE public.customers_customer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.customers_customer_id_seq OWNER TO alexluk;

--
-- Name: customers_customer_id_seq; Type: SEQUENCE OWNED BY; Schema: public;
--

ALTER SEQUENCE public.customers_customer_id_seq OWNED BY public.customers.customer_id;


--
-- Name: deliveries; Type: TABLE; Schema: public;
--

CREATE TABLE public.deliveries (
    delivery_id bigint NOT NULL,
    order_id bigint,
    driver_id bigint,
    pickup_time timestamp with time zone,
    delivered_time timestamp with time zone,
    estimated_time interval,
    status text,
    CONSTRAINT deliveries_status_check CHECK ((status = ANY (ARRAY['assigned'::text, 'en_route'::text, 'delivered'::text, 'failed'::text, 'cancelled'::text])))
);


ALTER TABLE public.deliveries OWNER TO alexluk;

--
-- Name: deliveries_delivery_id_seq; Type: SEQUENCE; Schema: public;
--

CREATE SEQUENCE public.deliveries_delivery_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.deliveries_delivery_id_seq OWNER TO alexluk;

--
-- Name: deliveries_delivery_id_seq; Type: SEQUENCE OWNED BY; Schema: public;
--

ALTER SEQUENCE public.deliveries_delivery_id_seq OWNED BY public.deliveries.delivery_id;


--
-- Name: drivers; Type: TABLE; Schema: public;
--

CREATE TABLE public.drivers (
    driver_id bigint NOT NULL,
    name text NOT NULL,
    phone text
);


ALTER TABLE public.drivers OWNER TO alexluk;

--
-- Name: drivers_driver_id_seq; Type: SEQUENCE; Schema: public;
--

CREATE SEQUENCE public.drivers_driver_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.drivers_driver_id_seq OWNER TO alexluk;

--
-- Name: drivers_driver_id_seq; Type: SEQUENCE OWNED BY; Schema: public;
--

ALTER SEQUENCE public.drivers_driver_id_seq OWNED BY public.drivers.driver_id;


--
-- Name: menu_categories; Type: TABLE; Schema: public;
--

CREATE TABLE public.menu_categories (
    category_id bigint NOT NULL,
    name text NOT NULL,
    description text
);


ALTER TABLE public.menu_categories OWNER TO alexluk;

--
-- Name: menu_categories_category_id_seq; Type: SEQUENCE; Schema: public;
--

CREATE SEQUENCE public.menu_categories_category_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.menu_categories_category_id_seq OWNER TO alexluk;

--
-- Name: menu_categories_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public;
--

ALTER SEQUENCE public.menu_categories_category_id_seq OWNED BY public.menu_categories.category_id;


--
-- Name: menu_items; Type: TABLE; Schema: public;
--

CREATE TABLE public.menu_items (
    menu_item_id bigint NOT NULL,
    category_id bigint NOT NULL,
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT menu_items_price_check CHECK ((price >= (0)::numeric))
);


ALTER TABLE public.menu_items OWNER TO alexluk;

--
-- Name: menu_items_menu_item_id_seq; Type: SEQUENCE; Schema: public;
--

CREATE SEQUENCE public.menu_items_menu_item_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.menu_items_menu_item_id_seq OWNER TO alexluk;

--
-- Name: menu_items_menu_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public;
--

ALTER SEQUENCE public.menu_items_menu_item_id_seq OWNED BY public.menu_items.menu_item_id;


--
-- Name: order_items; Type: TABLE; Schema: public;
--

CREATE TABLE public.order_items (
    order_item_id bigint NOT NULL,
    order_id bigint NOT NULL,
    menu_item_id bigint NOT NULL,
    quantity integer NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    item_total numeric(12,2) NOT NULL,
    CONSTRAINT order_items_item_total_check CHECK ((item_total >= (0)::numeric)),
    CONSTRAINT order_items_quantity_check CHECK ((quantity > 0)),
    CONSTRAINT order_items_unit_price_check CHECK ((unit_price >= (0)::numeric))
);


ALTER TABLE public.order_items OWNER TO alexluk;

--
-- Name: order_items_order_item_id_seq; Type: SEQUENCE; Schema: public;
--

CREATE SEQUENCE public.order_items_order_item_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.order_items_order_item_id_seq OWNER TO alexluk;

--
-- Name: order_items_order_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public;
--

ALTER SEQUENCE public.order_items_order_item_id_seq OWNED BY public.order_items.order_item_id;


--
-- Name: orders; Type: TABLE; Schema: public;
--

CREATE TABLE public.orders (
    order_id bigint NOT NULL,
    customer_id bigint,
    order_status text NOT NULL,
    order_type text NOT NULL,
    placed_at timestamp with time zone DEFAULT now(),
    total_amount numeric(12,2) NOT NULL,
    notes text,
    CONSTRAINT orders_order_status_check CHECK ((order_status = ANY (ARRAY['pending'::text, 'confirmed'::text, 'preparing'::text, 'ready'::text, 'out_for_delivery'::text, 'delivered'::text, 'cancelled'::text]))),
    CONSTRAINT orders_order_type_check CHECK ((order_type = ANY (ARRAY['pickup'::text, 'delivery'::text, 'dine_in'::text]))),
    CONSTRAINT orders_total_amount_check CHECK ((total_amount >= (0)::numeric))
);


ALTER TABLE public.orders OWNER TO alexluk;

--
-- Name: orders_order_id_seq; Type: SEQUENCE; Schema: public;
--

CREATE SEQUENCE public.orders_order_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.orders_order_id_seq OWNER TO alexluk;

--
-- Name: orders_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public;
--

ALTER SEQUENCE public.orders_order_id_seq OWNED BY public.orders.order_id;


--
-- Name: customers customer_id; Type: DEFAULT; Schema: public; Owner: alexluk
--

ALTER TABLE ONLY public.customers ALTER COLUMN customer_id SET DEFAULT nextval('public.customers_customer_id_seq'::regclass);


--
-- Name: deliveries delivery_id; Type: DEFAULT; Schema: public; Owner: alexluk
--

ALTER TABLE ONLY public.deliveries ALTER COLUMN delivery_id SET DEFAULT nextval('public.deliveries_delivery_id_seq'::regclass);


--
-- Name: drivers driver_id; Type: DEFAULT; Schema: public; Owner: alexluk
--

ALTER TABLE ONLY public.drivers ALTER COLUMN driver_id SET DEFAULT nextval('public.drivers_driver_id_seq'::regclass);


--
-- Name: menu_categories category_id; Type: DEFAULT; Schema: public; Owner: alexluk
--

ALTER TABLE ONLY public.menu_categories ALTER COLUMN category_id SET DEFAULT nextval('public.menu_categories_category_id_seq'::regclass);


--
-- Name: menu_items menu_item_id; Type: DEFAULT; Schema: public; Owner: alexluk
--

ALTER TABLE ONLY public.menu_items ALTER COLUMN menu_item_id SET DEFAULT nextval('public.menu_items_menu_item_id_seq'::regclass);


--
-- Name: order_items order_item_id; Type: DEFAULT; Schema: public; Owner: alexluk
--

ALTER TABLE ONLY public.order_items ALTER COLUMN order_item_id SET DEFAULT nextval('public.order_items_order_item_id_seq'::regclass);


--
-- Name: orders order_id; Type: DEFAULT; Schema: public; Owner: alexluk
--

ALTER TABLE ONLY public.orders ALTER COLUMN order_id SET DEFAULT nextval('public.orders_order_id_seq'::regclass);


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: alexluk
--

COPY public.customers (customer_id, first_name, last_name, email, phone, created_at, loyalty_points) FROM stdin;
1	Alice	Nguyen	alice@example.com	555-0101	2025-11-07 22:25:36.178579-08	150
2	Bob	Patel	bob@example.com	555-0202	2025-11-07 22:25:36.178579-08	40
3	Carla	Morris	carla@example.com	555-0303	2025-11-07 22:25:36.178579-08	620
\.


--
-- Data for Name: deliveries; Type: TABLE DATA; Schema: public; Owner: alexluk
--

COPY public.deliveries (delivery_id, order_id, driver_id, pickup_time, delivered_time, estimated_time, status) FROM stdin;
19	1	1	2025-11-07 22:08:51.312714-08	2025-11-07 22:38:51.312714-08	00:45:00	delivered
20	2	2	2025-11-07 23:48:51.312714-08	\N	00:40:00	en_route
21	3	3	\N	\N	01:00:00	assigned
22	4	1	2025-11-07 21:08:51.312714-08	2025-11-07 21:28:51.312714-08	00:45:00	failed
\.


--
-- Data for Name: drivers; Type: TABLE DATA; Schema: public; Owner: alexluk
--

COPY public.drivers (driver_id, name, phone) FROM stdin;
1	Diego	555-1000
2	Eve	555-1001
3	Alex	555-1002
\.


--
-- Data for Name: menu_categories; Type: TABLE DATA; Schema: public; Owner: alexluk
--

COPY public.menu_categories (category_id, name, description) FROM stdin;
1	Appetizers	Small starters
2	Mains	Main courses
3	Desserts	Sweet treats
4	Drinks	Beverages
\.


--
-- Data for Name: menu_items; Type: TABLE DATA; Schema: public; Owner: alexluk
--

COPY public.menu_items (menu_item_id, category_id, name, description, price, is_active, created_at) FROM stdin;
1	1	Garlic Bread	Toasted with garlic butter	5.00	t	2025-11-07 22:25:36.175663-08
2	2	Margherita Pizza	Classic tomato & cheese	12.50	t	2025-11-07 22:25:36.175663-08
3	2	Spicy Chicken Sandwich	With chipotle mayo	10.25	t	2025-11-07 22:25:36.175663-08
4	3	Tiramisu	Classic Italian dessert	6.00	t	2025-11-07 22:25:36.175663-08
5	4	Soda	Can of soda	1.75	t	2025-11-07 22:25:36.175663-08
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: alexluk
--

COPY public.order_items (order_item_id, order_id, menu_item_id, quantity, unit_price, item_total) FROM stdin;
6	1	2	1	12.50	12.50
7	1	4	1	10.00	10.00
8	2	3	1	10.25	10.25
9	3	2	2	12.50	25.00
10	3	5	1	3.00	3.00
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: alexluk
--

COPY public.orders (order_id, customer_id, order_status, order_type, placed_at, total_amount, notes) FROM stdin;
1	1	delivered	delivery	2025-11-05 22:25:36.180797-08	22.50	\N
2	2	delivered	pickup	2025-11-06 22:32:36.407235-08	10.25	\N
3	3	delivered	delivery	2025-11-03 22:32:36.407235-08	28.00	\N
4	1	cancelled	pickup	2025-10-28 22:32:36.407235-07	0.00	\N
\.


--
-- Name: customers_customer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: alexluk
--

SELECT pg_catalog.setval('public.customers_customer_id_seq', 3, true);


--
-- Name: deliveries_delivery_id_seq; Type: SEQUENCE SET; Schema: public; Owner: alexluk
--

SELECT pg_catalog.setval('public.deliveries_delivery_id_seq', 22, true);


--
-- Name: drivers_driver_id_seq; Type: SEQUENCE SET; Schema: public; Owner: alexluk
--

SELECT pg_catalog.setval('public.drivers_driver_id_seq', 4, true);


--
-- Name: menu_categories_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: alexluk
--

SELECT pg_catalog.setval('public.menu_categories_category_id_seq', 4, true);


--
-- Name: menu_items_menu_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: alexluk
--

SELECT pg_catalog.setval('public.menu_items_menu_item_id_seq', 5, true);


--
-- Name: order_items_order_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: alexluk
--

SELECT pg_catalog.setval('public.order_items_order_item_id_seq', 10, true);


--
-- Name: orders_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: alexluk
--

SELECT pg_catalog.setval('public.orders_order_id_seq', 1, true);


--
-- Name: customers customers_email_key; Type: CONSTRAINT; Schema: public; Owner: alexluk
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_email_key UNIQUE (email);


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: alexluk
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (customer_id);


--
-- Name: deliveries deliveries_order_id_key; Type: CONSTRAINT; Schema: public; Owner: alexluk
--

ALTER TABLE ONLY public.deliveries
    ADD CONSTRAINT deliveries_order_id_key UNIQUE (order_id);


--
-- Name: deliveries deliveries_pkey; Type: CONSTRAINT; Schema: public; Owner: alexluk
--

ALTER TABLE ONLY public.deliveries
    ADD CONSTRAINT deliveries_pkey PRIMARY KEY (delivery_id);


--
-- Name: drivers drivers_pkey; Type: CONSTRAINT; Schema: public; Owner: alexluk
--

ALTER TABLE ONLY public.drivers
    ADD CONSTRAINT drivers_pkey PRIMARY KEY (driver_id);


--
-- Name: menu_categories menu_categories_name_key; Type: CONSTRAINT; Schema: public; Owner: alexluk
--

ALTER TABLE ONLY public.menu_categories
    ADD CONSTRAINT menu_categories_name_key UNIQUE (name);


--
-- Name: menu_categories menu_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: alexluk
--

ALTER TABLE ONLY public.menu_categories
    ADD CONSTRAINT menu_categories_pkey PRIMARY KEY (category_id);


--
-- Name: menu_items menu_items_pkey; Type: CONSTRAINT; Schema: public; Owner: alexluk
--

ALTER TABLE ONLY public.menu_items
    ADD CONSTRAINT menu_items_pkey PRIMARY KEY (menu_item_id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: alexluk
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (order_item_id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: alexluk
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (order_id);


--
-- Name: idx_menu_items_category; Type: INDEX; Schema: public; Owner: alexluk
--

CREATE INDEX idx_menu_items_category ON public.menu_items USING btree (category_id);


--
-- Name: idx_order_items_menu_item; Type: INDEX; Schema: public; Owner: alexluk
--

CREATE INDEX idx_order_items_menu_item ON public.order_items USING btree (menu_item_id);


--
-- Name: idx_orders_customer; Type: INDEX; Schema: public; Owner: alexluk
--

CREATE INDEX idx_orders_customer ON public.orders USING btree (customer_id);


--
-- Name: idx_orders_placed_at; Type: INDEX; Schema: public; Owner: alexluk
--

CREATE INDEX idx_orders_placed_at ON public.orders USING btree (placed_at);


--
-- Name: deliveries deliveries_driver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: alexluk
--

ALTER TABLE ONLY public.deliveries
    ADD CONSTRAINT deliveries_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.drivers(driver_id);


--
-- Name: deliveries deliveries_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: alexluk
--

ALTER TABLE ONLY public.deliveries
    ADD CONSTRAINT deliveries_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id) ON DELETE CASCADE;


--
-- Name: menu_items menu_items_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: alexluk
--

ALTER TABLE ONLY public.menu_items
    ADD CONSTRAINT menu_items_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.menu_categories(category_id) ON DELETE RESTRICT;


--
-- Name: order_items order_items_menu_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: alexluk
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_menu_item_id_fkey FOREIGN KEY (menu_item_id) REFERENCES public.menu_items(menu_item_id) ON DELETE RESTRICT;


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: alexluk
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id) ON DELETE CASCADE;


--
-- Name: orders orders_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: alexluk
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict PvWLv0shrHdHZUmSiSiXAmt1cbjQiVwe0g1C1LKiZ5kRhVwKwv1GxOfTibmCYc2

