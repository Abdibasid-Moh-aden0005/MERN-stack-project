# Classic Rental Car - Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Prerequisites
- Node.js v14+
- MongoDB (local or Atlas)
- VS Code or any code editor

### Step 1: Backend Setup (2 minutes)

```bash
cd server
npm install

# Update .env with your MongoDB URI
# MONGODB_URI=mongodb://localhost:27017/carrentaldb
# Or use MongoDB Atlas: MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db

npm run dev
```
✅ Backend runs on `http://localhost:5000`

### Step 2: Frontend Setup (2 minutes)

```bash
cd client
npm install
npm start
```
✅ Frontend opens at `http://localhost:3000`

### Step 3: Test the App (1 minute)

1. **Register New User**
   - Go to http://localhost:3000/register
   - Fill form and submit
   - You're logged in!

2. **Browse Cars**
   - See all available cars on home page
   - Use filters to search
   - Click "View Details" for car specifications

3. **Admin Access**
   - Register with admin account (modify backend to add admin user)
   - Access admin features from navbar

---

## 📌 Key API Endpoints

```
# Auth
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile

# Cars
GET    /api/cars?brand=Toyota&fuelType=Diesel&page=1
GET    /api/cars/:id
POST   /api/cars (admin)

# Bookings
GET    /api/bookings/check-availability?carId=xxx&pickupDate=2024-01-15&dropoffDate=2024-01-20
POST   /api/bookings
GET    /api/bookings/my

# Admin
GET    /api/admin/dashboard
GET    /api/admin/bookings
PUT    /api/admin/bookings/:id/status
```

---

## 🎯 What's Working Now

✅ User Registration & Login
✅ Car Listing & Filtering
✅ Car Details with Image Gallery
✅ Car Availability Checking (Backend Ready)
✅ Booking Creation (Backend Ready)
✅ Admin Dashboard (Backend Ready)
✅ Responsive Design
✅ Error Handling & Validation

---

## 🔄 What Needs Frontend Implementation

- BookingForm page (date picker, availability check)
- BookingHistory page (list user's bookings)
- BookingDetails page (view specific booking)
- UserProfile page (edit profile)
- AdminDashboard page (view stats/charts)
- ManageCars page (add/edit/delete cars)
- ManageBookings page (manage all bookings)

---

## 📁 Important Files Reference

### Backend
- `server/server.js` - Main server file
- `server/.env` - Configuration
- `server/models/` - Database schemas
- `server/controllers/` - Business logic
- `server/routes/` - API endpoints

### Frontend
- `client/src/App.js` - Main app with routing
- `client/src/pages/Home.js` - Car listing (main page)
- `client/src/context/AuthContext.js` - Authentication state
- `client/src/services/` - API calls

---

## 🐛 Troubleshooting

**Backend won't start?**
- Check MongoDB is running: `mongod`
- Check port 5000 is free
- Check .env file exists with MONGODB_URI

**Frontend shows errors?**
- Clear browser cache: Ctrl+Shift+Delete
- Check backend is running: http://localhost:5000/api/health
- Check browser console (F12) for errors

**Can't log in?**
- Verify user exists in database
- Check password is correct
- Check backend logs for errors

---

## 💡 Development Tips

**Run both simultaneously:**
```bash
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm start
```

**Debug Backend:**
- Check `http://localhost:5000/api/health`
- View logs in server terminal
- Use MongoDB Compass to view database

**Debug Frontend:**
- Open DevTools (F12)
- Check Network tab for API calls
- Check Console for errors
- Check React DevTools (install extension)

---

## 📚 File Locations

```
Quick Navigation:
├── Home Page → client/src/pages/Home.js
├── Login → client/src/pages/Login.js
├── Register → client/src/pages/Register.js
├── Car Details → client/src/pages/CarDetails.js
├── Auth Logic → server/controllers/authController.js
├── Car Routes → server/routes/carRoutes.js
├── Booking Logic → server/controllers/bookingController.js
└── Database → server/models/
```

---

## 🎨 Customization

### Change Color Scheme
Edit `client/src/styles/index.css`:
```css
:root {
  --primary: #0066cc;        /* Change primary color */
  --secondary: #ff6b35;      /* Change secondary color */
  --success: #28a745;        /* Change success color */
}
```

### Change API URL
Edit `client/.env`:
```
REACT_APP_API_URL=http://your-api-url/api
```

### Change Port
Edit `server/.env`:
```
PORT=3001  (change from 5000 to 3001)
```

---

## 🚀 Next Steps

1. **Test Core Features**
   - Register and login
   - Browse cars
   - Check availability

2. **Implement Missing Pages**
   - Booking form with date picker
   - Booking history listing
   - Admin dashboard

3. **Add Advanced Features**
   - Payment integration
   - Email notifications
   - Reviews and ratings

4. **Deploy to Production**
   - Backend: Heroku, Railway, or Render
   - Frontend: Vercel or Netlify

---

## 📞 Need Help?

1. **Check Logs**
   - Backend: Terminal where `npm run dev` runs
   - Frontend: Browser DevTools (F12)

2. **Read Documentation**
   - SETUP_GUIDE.md - Complete setup
   - PROJECT_SUMMARY.md - Architecture
   - Code comments in source files

3. **Common Issues**
   - MongoDB connection: Check MONGODB_URI
   - CORS errors: Check CLIENT_URL
   - Token issues: Clear localStorage and login again

---

## ⚡ Performance Notes

- Images are stored in `server/uploads/cars/`
- Database queries use pagination (10 items default)
- JWT tokens expire in 7 days
- Search is text-indexed for fast results

---

## 📝 Code Examples

### Add a new API call
```javascript
// client/src/services/api.js
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add interceptor for token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Use Auth Context
```javascript
import { useAuth } from '../utils/useAuth';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  // Use auth data here
}
```

### Format currency
```javascript
import { formatCurrency } from '../utils/helpers';

const price = formatCurrency(1500); // ₹1,500.00
```

---

## 🎯 Success Checklist

- [ ] Backend installed and running
- [ ] Frontend installed and running
- [ ] MongoDB connected
- [ ] Can register new user
- [ ] Can login
- [ ] Can see car listings
- [ ] Can view car details
- [ ] Admin features visible (if logged in as admin)

**All checked? You're ready to go! 🎉**

---

*Last Updated: January 2026*
*Status: Core features complete and functional*
