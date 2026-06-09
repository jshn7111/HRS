# HRS
Hotel Reservation System

# 🏨 StayEase - Hotel Room Booking Platform

StayEase is a modern full-stack hotel room booking platform built using the MERN Stack. It allows users to search hotels, check room availability, make secure bookings, and manage reservations. Hotel owners can manage their properties and bookings, while administrators can oversee the entire platform.

---

## 🚀 Features

### 👤 User Features

* User Registration & Login
* JWT Authentication
* Search Hotels by City
* Check Room Availability
* View Hotel Details
* Room Gallery
* Reviews & Ratings
* Wishlist Management
* Online Room Booking
* Secure Payments
* Booking History
* Profile Management

### 🏨 Hotel Owner Features

* Add Hotels
* Manage Rooms
* Upload Hotel Images
* Update Pricing
* Manage Reservations
* Revenue Dashboard

### 🛠 Admin Features

* User Management
* Hotel Verification
* Booking Monitoring
* Revenue Analytics
* Platform Control Panel

---

## 🏗 Tech Stack

### Frontend

* React.js
* Next.js
* Tailwind CSS
* Redux Toolkit
* Framer Motion

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas

### Authentication

* JWT
* Google OAuth

### Payment Gateway

* Razorpay
* Stripe

### Cloud Services

* Cloudinary

### Deployment

* Vercel (Frontend)
* Render / Railway (Backend)

---

## 📂 Project Structure

```bash
StayEase/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── redux/
│   │   └── utils/
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── uploads/
│
├── docs/
├── README.md
└── package.json
```

---

## 📊 Database Schema

### User

```javascript
{
  _id,
  name,
  email,
  password,
  role,
  createdAt
}
```

### Hotel

```javascript
{
  _id,
  name,
  location,
  description,
  amenities,
  images,
  ownerId
}
```

### Room

```javascript
{
  _id,
  hotelId,
  roomType,
  capacity,
  price,
  availability
}
```

### Booking

```javascript
{
  _id,
  userId,
  hotelId,
  roomId,
  checkIn,
  checkOut,
  amount,
  status
}
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/stayease.git
cd stayease
```

### Install Frontend Dependencies

```bash
cd client
npm install
```

### Install Backend Dependencies

```bash
cd ../server
npm install
```

### Environment Variables

Create `.env` file in server folder.

```env
PORT=5000

MONGO_URI=

JWT_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

RAZORPAY_KEY_ID=
RAZORPAY_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### Start Backend

```bash
npm run dev
```

### Start Frontend

```bash
npm run dev
```

---

## 🎯 Future Enhancements

* AI Hotel Recommendations
* Dynamic Pricing System
* Multi-language Support
* Voice Search
* Travel Package Booking
* Real-time Room Availability
* Chat Support System
* Mobile Application

---

## 📸 Screenshots

* Homepage
* Hotel Listing
* Hotel Details
* Booking Page
* User Dashboard
* Owner Dashboard
* Admin Dashboard

---

## 🤝 Contributing

Contributions are welcome.

1. Fork Repository
2. Create New Branch
3. Commit Changes
4. Push Changes
5. Create Pull Request

---

## 📜 License

This project is licensed under the MIT License.

---

## 👨‍💻 Developed By

StayEase Development Team

Making hotel booking simple, fast, and secure.

