# Budget App Backend

A secure Node.js + Express backend for the Budget App, with MongoDB, JWT authentication, and CRUD for categories and transactions.

## Features
- User registration and login (JWT authentication)
- CRUD for categories and transactions, scoped to each user
- MongoDB for persistent storage
- RESTful API

## Setup

1. **Clone the repo and enter the backend directory:**
   ```sh
   cd backend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in your values:
     ```sh
     cp .env.example .env
     ```
   - Set `MONGODB_URI` to your MongoDB connection string.
   - Set `JWT_SECRET` to a strong random string.
   - Set `PORT` if you want (default is 3000).

4. **Start the server:**
   ```sh
   npm run dev
   # or
   npm start
   ```

## API Endpoints

### Auth
- `POST /api/auth/register` — `{ email, password }`
- `POST /api/auth/login` — `{ email, password }` → `{ token }`

### Categories (require Bearer token)
- `GET /api/categories`
- `POST /api/categories` — `{ name, limit }`
- `PUT /api/categories/:id` — `{ name, limit }`
- `DELETE /api/categories/:id`

### Transactions (require Bearer token)
- `GET /api/transactions`
- `POST /api/transactions` — `{ amount, date, category }`
- `PUT /api/transactions/:id` — `{ amount, date, category }`
- `DELETE /api/transactions/:id`

## Notes
- All category and transaction endpoints require a valid JWT in the `Authorization: Bearer <token>` header.
- Each user's data is isolated.

## Deployment
- You can deploy this backend to Render, Railway, Heroku, or any Node.js-compatible host.
- Make sure to set your environment variables in your host's dashboard.

---

Feel free to extend this backend with more features (budgets, reports, etc.) as needed! 