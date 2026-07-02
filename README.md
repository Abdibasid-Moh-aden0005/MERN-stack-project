# Classic Rental Car

A full-stack MERN (MongoDB, Express, React, Node.js) car rental booking system with admin and customer features. Replaces traditional paper-based rental operations with a digital, automated workflow.

---

## Features

### Authentication & Authorization
- User registration and login with JWT
- Password hashing with bcrypt
- Role-based access (Admin & Customer)
- Protected routes and API endpoints

### Customer Features
- Browse and filter cars by brand, fuel type, seating, price
- View car details with images and specifications
- Real-time availability checking
- Book cars with date range selection
- View booking history and details
- Cancel bookings with automatic refund calculation

### Admin Features
- Dashboard with analytics — revenue, bookings by status, top cars
- Car inventory CRUD with image uploads (Cloudinary)
- View and manage all bookings — confirm, complete, reject
- Customer/user management — add, edit, delete, change roles

---

## Tech Stack

| Layer      | Technology                                         |
|------------|----------------------------------------------------|
| Frontend   | React 19, Vite 8, React Router 7, Zustand 5        |
| Styling    | Tailwind CSS 4, shadcn/ui, Lucide icons            |
| Charts     | Recharts                                           |
| Backend    | Node.js, Express 4, Mongoose 7 (MongoDB ODM)      |
| Auth       | JWT (jsonwebtoken), bcryptjs                        |
| Uploads    | Multer (in-memory) → Cloudinary                     |
| Validation | validator library                                   |

---

## Project Structure

```
MERN-stack-project/
├── package.json                     # Root — backend entry, scripts
├── server/
│   ├── server.js                    # Express entry point
│   ├── seedCars.js                  # Demo data seeder
│   ├── .env                         # Environment variables
│   ├── config/                      # DB + multer config
│   ├── models/                      # User, Car, Booking schemas
│   ├── controllers/                 # Auth, Car, Booking, Admin logic
│   ├── routes/                      # API route definitions
│   ├── middleware/                   # JWT auth + input validation
│   └── utils/                       # Date/refund/availability helpers
├── frontend/
│   ├── package.json
│   ├── vite.config.js               # Vite config + dev proxy
│   ├── .env                         # VITE_API_URL, Cloudinary keys
│   └── src/
│       ├── App.jsx                  # Router + route definitions
│       ├── store/zustand/           # Auth, Cars, Bookings, Users stores
│       ├── components/              # Shared UI components
│       └── pages/                   # Auth, User, Admin pages
├── DETAILS.md                       # Full architecture & problem-solution
├── QUICK_START.md
├── SETUP_GUIDE.md
└── PROJECT_SUMMARY.md
```

---

## Setup

### Development

```bash
# Terminal 1 — Backend
npm install
npm run dev                 # Express on :5000

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev                 # Vite on :5173 (proxies /api → :5000)
```

### Production (single URL)

```bash
npm install
npm run build               # builds frontend → frontend/dist
npm start                   # Express serves API + frontend on :5000
```

### Seed Demo Data

```bash
node server/seedCars.js     # inserts 18 demo cars
```

---

## API Overview

| Group     | Key Endpoints                                    |
|-----------|--------------------------------------------------|
| Auth      | `POST /api/auth/register` · `POST /api/auth/login` · `GET|PUT /api/auth/profile` · `PUT /api/auth/change-password` |
| Cars      | `GET /api/cars` · `GET /api/cars/:id` · `POST|PUT|DELETE /api/cars/:id` · `DELETE /api/cars/:id/image` |
| Bookings  | `GET /api/bookings/check-availability` · `POST /api/bookings` · `GET /api/bookings/my` · `GET /api/bookings/:id` · `PUT /api/bookings/:id/cancel` |
| Admin     | `GET /api/admin/dashboard` · `GET|PUT /api/admin/bookings` · `CRUD /api/admin/users` |

See [DETAILS.md](DETAILS.md) for the complete endpoint reference.

---

## Environment Variables

### `server/.env`
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/car-marketplace-two
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_secret
JWT_EXPIRE=7d
BCRYPT_ROUNDS=10
MAX_FILE_SIZE=5242880
```

### `frontend/.env`
```
VITE_API_URL=/api
VITE_CLOUDINARY_APIKEY=your_key
VITE_CLOUDINARY_URL=your_cloudinary_url
```

---

## License

MIT
