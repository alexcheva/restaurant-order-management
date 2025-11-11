# Restaurant Order Management App
A full-stack web application that manages a restaurant’s menu, customer orders, deliveries, and sales analytics — complete with a Material UI dashboard and interactive charts.

A gif of your finished product in action (client, server, and/or database)
The exercise you chose and why
I used to work in a restaurant, and this project spoke to me!
A short explanation of what you built
I build a Restaurant Management dashboard using Vite, React, Material, and Recharts.  
How to test/demo/run your project (NOTE: a 'working' exercise is awesome, however it is NOT a hard requirement. We mean it!)
After installing the database, create views:

Feedback/notes (i.e. if something was hard, confusing, frustrating, etc)
Feedback notes:
Frustrating was getting the right data from the postgress and visualizing it.
Anything else you'd lke us to know about your submission (such as resources used, client and/or server requirements)
What you would add/change if you had more time
I would add more charts on the dashboard, like Total Revenue, Delivery Performance. As well as polish the code, and add CRUD fuctionality to orders and delivery.
Clear and concise documentation explaining the code.
Any external libraries or APIs used are properly documented.



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
