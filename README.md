# ICT Department Management System

A comprehensive full-stack web application for managing students, dues, payments, and events in the Department of Information and Communication Technology.

## Features

### User Roles

1. **Admin**
   - Full access dashboard
   - Manage students (create, edit, deactivate)
   - Assign levels and dues
   - Upload/edit/delete events
   - View all payments
   - Generate reports

2. **Student**
   - View personal dashboard with profile information
   - View assigned dues
   - Make full or partial payments via Paystack
   - View payment history
   - Print or download branded receipts

3. **Head of Department (HOD)**
   - Read-only dashboard
   - View students, payments, and reports
   - Access to department statistics

## Technology Stack

### Frontend
- React 19 with TypeScript
- Vite (Build tool)
- React Router v7 (Routing)
- Tailwind CSS v4 (Styling)
- Axios (API communication)
- Swiper.js (Hero slider)
- React Icons (Icons)
- jsPDF & html2canvas (Receipt generation)

### Backend
- Node.js + Express.js
- TypeScript
- MySQL with Sequelize ORM
- JWT Authentication
- bcrypt (Password hashing)
- Paystack API (Payment integration)

## Setup Instructions

### Prerequisites
- Node.js 20.19+ or 22.12+
- MySQL Server
- npm or yarn

### Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE ict_department;
```

2. Update the database credentials in `server/.env`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ict_department
JWT_SECRET=your_jwt_secret_key_here
PAYSTACK_SECRET_KEY=your_paystack_secret_key
```

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Seed the database with initial data:
```bash
npm run seed
```

5. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Demo Credentials

After seeding the database, use these credentials to login:

- **Admin**: admin@ict.edu / admin123
- **HOD**: hod@ict.edu / hod123
- **Student**: student@ict.edu / student123

## Project Structure

```
department/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context (Auth)
│   │   ├── pages/         # Page components
│   │   │   ├── admin/     # Admin dashboard pages
│   │   │   ├── student/   # Student dashboard pages
│   │   │   └── hod/       # HOD dashboard pages
│   │   ├── App.tsx        # Main app component
│   │   └── main.tsx       # Entry point
│   └── package.json
│
└── server/                # Backend Node.js application
    ├── src/
    │   ├── config/        # Database configuration
    │   ├── middleware/    # Authentication middleware
    │   ├── models/        # Sequelize models
    │   ├── routes/        # API routes
    │   ├── seed.ts        # Database seeding script
    │   └── server.ts      # Entry point
    └── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Admin Routes
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/students` - List all students
- `POST /api/admin/students` - Create new student
- `GET /api/admin/dues` - List all dues
- `POST /api/admin/dues` - Create new dues
- `GET /api/admin/payments` - View all payments
- `POST /api/admin/events` - Create event
- `DELETE /api/admin/events/:id` - Delete event

### Student Routes
- `GET /api/student/dues` - Get student's dues
- `POST /api/student/payment/initiate` - Initiate payment
- `POST /api/student/payment/verify` - Verify payment
- `GET /api/student/payments` - Get payment history

### HOD Routes
- `GET /api/hod/stats` - Dashboard statistics
- `GET /api/hod/students` - View all students
- `GET /api/hod/payments` - View all payments

### Public Routes
- `GET /api/events` - Get all events

## Payment Integration

The system uses Paystack for payment processing. To enable payments:

1. Sign up for a Paystack account at https://paystack.com
2. Get your public and secret keys
3. Update the Paystack public key in `client/src/pages/student/MyDues.tsx`
4. Update the Paystack secret key in `server/.env`

## Features Implementation

### Receipt Generation
- Students can view, print, and download PDF receipts for all payments
- Receipts include student details, payment amount, and transaction reference
- Branded with department logo and colors

### Event Management
- Admin can upload image flyers or text announcements
- Events display in a scrolling strip on the homepage
- Real-time updates when new events are added

### Partial Payments
- Students can pay dues in installments
- System tracks amount paid, balance, and payment status
- Payment history shows all transactions

### Role-Based Access Control
- JWT-based authentication
- Protected routes based on user roles
- Middleware authorization for API endpoints

## Development

### Running in Development Mode

Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm run dev
```

### Building for Production

Backend:
```bash
cd server
npm run build
npm start
```

Frontend:
```bash
cd client
npm run build
npm run preview
```

## Future Enhancements

- Dark mode interface
- Email notifications for payments
- Export reports to Excel
- Payment analytics charts
- SMS notifications
- Student profile editing
- Bulk student import
- Advanced reporting features

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please contact the development team.