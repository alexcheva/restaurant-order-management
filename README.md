# Restaurant Order Management App
## Tech stack:
- Backend: Node.js (Express) + PostgreSQL
- Frontend: React (Vite)
- Database: PostgreSQL 14+

## Local Setup Instructions
### Step 1 — Clone open repo
```bash
git clone https://github.com/alexcheva/restaurant-order-management.git
cd restaurant-order-management
```
### Step 2 —  Database Setup

To recreate the database locally:

```bash
createdb restaurant_db
```

Import the schema and sample data:

```bash
psql -U <your_username> -d restaurant_db -f db/restaurant_db_dump.sql
```
Confirm setup:

```bash
psql -d restaurant_db -c "\dt"
```
### Step 3 - Backend setup
```bash
cd server
npm install
```
#### Create your `server/.env` file:
```
PORT=4000
DATABASE_URL=postgresql://YOUR_USERNAME@localhost:5432/restaurant_db
```
<!-- Now visit http://localhost:4000/api/orders to confirm data loads as JSON. -->
### Run backend:
```bash
npm run dev
```
### Step 4 - Frontend setup
```bash
cd client
npm install
```
<!-- #### Create your `client/.env` file:
```
REACT_APP_API_URL=http://localhost:4000
``` -->

### Run Frontend:
```bash
npm run dev
```
