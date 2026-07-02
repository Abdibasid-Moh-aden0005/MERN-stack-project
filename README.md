# Classic Rental Car

A full-stack MERN (MongoDB, Express, React, Node.js) application for a comprehensive classic car rental booking system with admin and customer features.

## Features

### Authentication & Authorization
- User registration and login with JWT
- Password hashing using bcrypt
- Role-based access control (Admin & Customer)
- Protected routes and endpoints

### Customer Features
- Search and filter cars
- View car details with images
- Real-time availability check
- Book cars with pickup/drop dates
- View booking history
- Cancel bookings

### Admin Features
- Dashboard with analytics
- Add/Update/Delete cars
- Manage car images
- View and manage all bookings
- Update booking status

### Technical Stack
- **Frontend:** React.js with modern UI components
- **Backend:** Node.js with Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT tokens
- **File Upload:** Multer for image handling
- **Security:** bcryptjs for password hashing

## Project Structure

```
ClassicRentalCar/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── App.js
│   └── package.json
├── server/                 # Node.js backend
│   ├── config/            # Database connection
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API endpoints
│   ├── controllers/       # Business logic
│   ├── middleware/        # Auth, validation
│   ├── utils/             # Helper functions
│   ├── uploads/           # Image storage
│   ├── server.js          # Main server file
│   ├── .env               # Environment variables
│   └── package.json
└── README.md
```

## Setup Instructions

### Backend Setup
1. Navigate to the server directory
2. Install dependencies: `npm install`
3. Configure `.env` file with MongoDB URI and JWT secret
4. Run: `npm run dev` (development) or `npm start` (production)

### Frontend Setup
1. Navigate to the client directory
2. Install dependencies: `npm install`
3. Run: `npm start`

The application will be available at `http://localhost:3000` with backend API at `http://localhost:5000`

## Environment Variables

See `.env` file in the server directory for required environment variables.

## Development Notes

- Database files are generated file by file as per architecture design
- Follow the existing code structure and naming conventions
- Use async/await for promises
- Implement proper error handling
# ClassicRentalCar
