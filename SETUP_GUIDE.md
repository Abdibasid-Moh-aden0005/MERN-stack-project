# Classic Rental Car - Complete Setup Guide

## Project Overview
A full-stack MERN application for booking cars with user authentication, real-time availability checking, and admin dashboard for managing cars and bookings.

## Tech Stack
- **Frontend:** React.js 18, React Router, Axios, React Toastify
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Authentication:** JWT, bcryptjs
- **File Upload:** Multer
- **Styling:** CSS3

---

## Backend Setup

### 1. Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud - MongoDB Atlas)
- npm or yarn

### 2. Backend Installation

```bash
cd server
npm install
```

### 3. Environment Configuration

Create a `.env` file in the server directory with the following variables:

```
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/carrentaldb

# Client URL
CLIENT_URL=http://localhost:3000

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Bcrypt Configuration
BCRYPT_ROUNDS=10

# Image Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads/cars
```

### 4. MongoDB Setup

#### Option A: Local MongoDB
```bash
# Install MongoDB Community Edition
# Start MongoDB service
mongod
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get connection string and update MONGODB_URI in .env

### 5. Start Backend Server

```bash
cd server
npm run dev
```

Server will run on `http://localhost:5000`

---

## Frontend Setup

### 1. Frontend Installation

```bash
cd client
npm install
```

### 2. Environment Configuration

Create a `.env` file in the client directory:

```
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Start Frontend Development Server

```bash
cd client
npm start
```

Application will open at `http://localhost:3000`

---

## API Endpoints Reference

### Authentication Routes (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /profile` - Get user profile (Protected)
- `PUT /profile` - Update user profile (Protected)

### Car Routes (`/api/cars`)
- `GET /` - Get all cars with filters
- `GET /:id` - Get car details
- `POST /` - Add new car (Admin only)
- `PUT /:id` - Update car (Admin only)
- `DELETE /:id` - Delete car (Admin only)
- `DELETE /:id/image` - Delete car image (Admin only)

### Booking Routes (`/api/bookings`)
- `GET /check-availability` - Check car availability
- `POST /` - Create booking (Protected)
- `GET /my` - Get my bookings (Protected)
- `GET /:bookingId` - Get booking details (Protected)
- `PUT /:bookingId/cancel` - Cancel booking (Protected)

### Admin Routes (`/api/admin`)
- `GET /dashboard` - Get dashboard stats (Admin only)
- `GET /bookings` - Get all bookings (Admin only)
- `PUT /bookings/:id/status` - Update booking status (Admin only)
- `PUT /bookings/:id/payment` - Update payment status (Admin only)

---

## Project Structure

```
ClassicRentalCar/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── Navbar.css
│   │   │   └── ProtectedRoute.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Home.css
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Auth.css
│   │   │   ├── CarDetails.js
│   │   │   ├── CarDetails.css
│   │   │   ├── BookingForm.js
│   │   │   ├── BookingHistory.js
│   │   │   ├── BookingDetails.js
│   │   │   ├── UserProfile.js
│   │   │   ├── AdminDashboard.js
│   │   │   ├── ManageCars.js
│   │   │   └── ManageBookings.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── bookingService.js (also used for cars)
│   │   │   └── adminService.js
│   │   ├── styles/
│   │   │   ├── index.css
│   │   │   └── theme.js
│   │   ├── utils/
│   │   │   ├── helpers.js
│   │   │   └── useAuth.js
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── .env
│
├── server/                          # Node.js Backend
│   ├── config/
│   │   ├── database.js
│   │   └── multerConfig.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Car.js
│   │   └── Booking.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── carController.js
│   │   ├── bookingController.js
│   │   └── adminController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── carRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── adminRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── validationMiddleware.js
│   ├── utils/
│   │   └── bookingUtils.js
│   ├── uploads/
│   │   └── cars/
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## Features Implemented

### ✅ Completed
- User authentication (registration & login)
- JWT-based authorization
- Role-based access (admin & customer)
- Car management (CRUD operations)
- Image upload with Multer
- Car search & filtering
- Booking system with availability checking
- Refund calculation based on cancellation time
- Admin dashboard with analytics
- Responsive design

### 🔄 In Progress / Todo
- Complete booking form page
- Booking history & details pages
- User profile management
- Admin dashboard with charts
- Admin car management interface
- Admin booking management interface
- Payment integration
- Email notifications
- Advanced filters and sorting
- Reviews and ratings

---

## Testing the Application

### Demo Credentials
The application supports demo accounts. After setup, you can create test accounts or use these credentials:

**Customer Account:**
- Email: customer@example.com
- Password: password

**Admin Account:**
- Email: admin@example.com
- Password: password

### Manual Testing Steps

1. **Registration & Login**
   - Go to http://localhost:3000/register
   - Fill in all required fields
   - Click Register
   - Should redirect to home page (logged in)

2. **Car Browsing**
   - View available cars on home page
   - Use filters (brand, fuel type, price range, seating)
   - Click "View Details" to see car specifications

3. **Booking (Customer)**
   - Click "Book Now" on any car
   - Fill booking form (pickup/drop dates & times)
   - Check availability
   - Complete booking

4. **Admin Features**
   - Log in with admin credentials
   - Access admin dashboard
   - Manage cars (add, edit, delete)
   - View all bookings
   - Update booking status

---

## Troubleshooting

### Backend Issues

**Problem:** MongoDB connection fails
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify MongoDB is accessible

**Problem:** Port 5000 already in use
- Change PORT in .env to another port (e.g., 5001)
- Update CLIENT_URL in .env accordingly

**Problem:** CORS errors
- Ensure CLIENT_URL in .env matches frontend URL
- Check proxy setting in client package.json

### Frontend Issues

**Problem:** API calls fail
- Ensure backend is running on correct port
- Check REACT_APP_API_URL in .env
- Open browser DevTools > Network to debug

**Problem:** Images not loading
- Verify upload directory exists: `server/uploads/cars`
- Check image paths in database

---

## Next Steps

1. **Complete Remaining Pages:**
   - Implement BookingForm with date picker
   - Implement BookingHistory with status filtering
   - Implement UserProfile for profile management

2. **Admin Interface:**
   - Dashboard with charts and statistics
   - Car management (add/edit/delete)
   - Booking management interface

3. **Advanced Features:**
   - Payment gateway integration (Stripe/Razorpay)
   - Email notifications
   - Ratings and reviews
   - Advanced search and filtering
   - SMS notifications for bookings

4. **Deployment:**
   - Deploy backend to Heroku/Railway/Render
   - Deploy frontend to Vercel/Netlify
   - Configure production environment variables
   - Set up CI/CD pipeline

---

## Support & Resources

- MongoDB Documentation: https://docs.mongodb.com/
- Express.js Guide: https://expressjs.com/
- React Documentation: https://react.dev/
- React Router: https://reactrouter.com/
- Axios: https://axios-http.com/
- JWT: https://jwt.io/

---

## License
MIT License

---

## Contact
For questions or support, please contact the development team.
