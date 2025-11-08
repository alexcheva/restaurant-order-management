# Restaurant Order Management App
## Local Setup Instructions
### Step 1 — Clone open repo
```bash
git clone https://github.com/alexcheva/restaurant-order-management.git
cd restaurant-order-management
```
### Step 2 — Initialize PostgreSQL database

#### Create a database named restaurant_db:

```bash
createdb restaurant_db
```

#### Open psql and run the provided SQL schema and data:

```bash
psql -d restaurant_db -f db/schema.sql
psql -d restaurant_db -f db/sample_data.sql
```

#### (Optional) Verify:

```bash
psql restaurant_db -c "SELECT * FROM restaurant.customers;"
```
