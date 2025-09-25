# 💰 Personal Finance Tracker

A comprehensive full-stack personal finance management application that helps users track expenses, manage income, analyze financial data, and generate detailed reports. Built with modern web technologies and best practices.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.3.1-blue.svg)

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Deployment](#-deployment)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 📊 Dashboard
- Real-time financial overview with key metrics
- Visual charts (Line & Pie charts) for income vs expenses
- Monthly trends analysis (last 6 months)
- Recent transactions summary
- Net balance, total income, and expense tracking

### 💳 Transaction Management
- Add, edit, and delete transactions
- Categorize transactions (income/expense)
- Filter by type, category, and date range
- Pagination support for large datasets
- Detailed transaction history

### 📈 Analytics & Insights
- Category-wise breakdown of spending
- Monthly trends visualization
- Income vs expense comparison
- Percentage-based category analysis
- Year-to-date financial summaries

### 📄 Report Generation
- **Monthly Reports** - Last 30 days summary
- **Quarterly Reports** - 3-month financial overview
- **Annual Reports** - Yearly financial analysis
- **Custom Reports** - User-defined date range
- PDF export with detailed tables and charts
- Comprehensive transaction listings

### 👥 User Management (Admin)
- Role-based access control (Admin, User, Read-only)
- User role management
- Multi-user support with data isolation
- Secure authentication & authorization

### 🔐 Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Role-based permissions
- Rate limiting
- Helmet.js security headers
- CORS configuration
- Input validation & sanitization

### 🎨 UI/UX
- Modern, responsive design
- Dark mode support
- Mobile-friendly interface
- Smooth animations and transitions
- Intuitive navigation
- Loading states and error handling

## 🛠 Tech Stack

### Frontend
- **Framework:** React 18.3 with TypeScript
- **Build Tool:** Vite
- **Routing:** React Router v6
- **UI Components:** Radix UI + shadcn/ui
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Forms:** React Hook Form + Zod validation
- **PDF Generation:** jsPDF + jsPDF-AutoTable
- **State Management:** React Context API
- **HTTP Client:** Fetch API

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Caching:** Redis
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Validation:** express-validator, Joi
- **Security:** Helmet, CORS, Rate Limiting
- **Documentation:** Swagger/OpenAPI

### DevOps & Tools
- **Version Control:** Git
- **Package Manager:** npm
- **Environment:** dotenv
- **Development:** Nodemon (hot reload)
- **API Testing:** Swagger UI

## 🏗 Architecture

### Project Structure

```
personal-finance-tracker/
├── frontend/                 # React frontend application
│   ├── public/              # Static assets
│   │   └── finance-icon.svg # Custom favicon
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── Layout/      # Layout components (Sidebar, etc.)
│   │   │   ├── Transactions/# Transaction-related components
│   │   │   └── ui/          # shadcn/ui components
│   │   ├── contexts/        # React Context (Auth, Theme)
│   │   ├── pages/           # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Transactions.tsx
│   │   │   ├── Analytics.tsx
│   │   │   ├── Reports.tsx
│   │   │   ├── Users.tsx
│   │   │   └── Settings.tsx
│   │   ├── services/        # API service layer
│   │   │   └── api.ts       # Centralized API calls
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # Entry point
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.ts
│
├── backend/                 # Express backend API
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   │   ├── database.js  # PostgreSQL connection
│   │   │   └── redis.js     # Redis cache setup
│   │   ├── controllers/     # Request handlers
│   │   │   ├── authController.js
│   │   │   ├── transactionController.js
│   │   │   ├── analyticsController.js
│   │   │   └── userController.js
│   │   ├── middleware/      # Custom middleware
│   │   │   ├── auth.js      # JWT verification
│   │   │   └── roleCheck.js # Role-based access
│   │   ├── models/          # Database models
│   │   │   ├── Transaction.js
│   │   │   ├── User.js
│   │   │   └── Category.js
│   │   ├── routes/          # API routes
│   │   │   ├── auth.js
│   │   │   ├── transactions.js
│   │   │   ├── analytics.js
│   │   │   └── users.js
│   │   └── app.js           # Express app setup
│   ├── migrations/          # Database migrations
│   │   └── init.sql         # Initial schema
│   ├── server.js            # Server entry point
│   ├── package.json
│   └── .env.example
│
├── .github/
│   └── workflows/
│       └── deploy.yml       # CI/CD pipeline
├── render.yaml              # Render deployment config
├── DEPLOYMENT.md            # Deployment guide
└── README.md               # This file
```

### Database Design

```sql
-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'user',
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Categories Table
CREATE TABLE categories (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type transaction_type NOT NULL,
    created_at TIMESTAMP
);

-- Transactions Table
CREATE TABLE transactions (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    category_id UUID REFERENCES categories(id),
    type transaction_type NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **PostgreSQL** >= 13
- **Redis** >= 6.0 (optional, for caching)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/personal-finance-tracker.git
cd personal-finance-tracker
```

2. **Backend Setup**

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure environment variables
nano .env
```

**Backend `.env` configuration:**
```env
# Server
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/finance_tracker

# Redis (optional)
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this

# CORS
FRONTEND_URL=http://localhost:5173
```

3. **Database Setup**

```bash
# Create PostgreSQL database
createdb finance_tracker

# Run migrations
psql -d finance_tracker -f migrations/init.sql
```

4. **Frontend Setup**

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure environment variables
nano .env
```

**Frontend `.env` configuration:**
```env
VITE_API_URL=http://localhost:5000/api
```

5. **Start Development Servers**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

6. **Access the Application**

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/api-docs (if Swagger enabled)

### Default Users

The application comes with pre-seeded demo users:

| Email | Password | Role |
|-------|----------|------|
| admin@demo.com | admin123 | Admin |
| user@demo.com | user123 | User |
| readonly@demo.com | readonly123 | Read-only |

**⚠️ Important:** Change these credentials in production!

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}

Response:
{
  "token": "jwt-token-here",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

#### Verify Token
```http
GET /api/auth/verify
Authorization: Bearer {token}
```

### Transaction Endpoints

#### Get Transactions
```http
GET /api/transactions?page=1&limit=10&type=expense&startDate=2025-01-01&endDate=2025-12-31
Authorization: Bearer {token}
```

#### Create Transaction
```http
POST /api/transactions
Authorization: Bearer {token}
Content-Type: application/json

{
  "categoryId": "uuid",
  "type": "expense",
  "amount": 50.00,
  "description": "Groceries",
  "date": "2025-09-24"
}
```

#### Update Transaction
```http
PUT /api/transactions/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "categoryId": "uuid",
  "type": "expense",
  "amount": 55.00,
  "description": "Updated groceries",
  "date": "2025-09-24"
}
```

#### Delete Transaction
```http
DELETE /api/transactions/{id}
Authorization: Bearer {token}
```

#### Get Categories
```http
GET /api/transactions/categories?type=expense
Authorization: Bearer {token}
```

### Analytics Endpoints

#### Get Overview
```http
GET /api/analytics/overview
Authorization: Bearer {token}

Response:
{
  "year": 2025,
  "monthlyIncome": [0, 5000, ...],
  "monthlyExpenses": [0, 1500, ...],
  "totalIncome": 60000,
  "totalExpenses": 18000,
  "netSavings": 42000
}
```

#### Get Category Breakdown
```http
GET /api/analytics/categories?startDate=2025-01-01&endDate=2025-12-31
Authorization: Bearer {token}

Response:
{
  "income": [
    {
      "name": "Salary",
      "amount": 5000,
      "count": 12,
      "percentage": "83.33"
    }
  ],
  "expenses": [
    {
      "name": "Food & Dining",
      "amount": 1500,
      "count": 45,
      "percentage": "35.71"
    }
  ],
  "totalIncome": 60000,
  "totalExpenses": 18000
}
```

#### Get Trends
```http
GET /api/analytics/trends?months=6
Authorization: Bearer {token}

Response:
{
  "labels": ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
  "income": [5000, 5000, 5000, 5000, 5000, 5000],
  "expenses": [1500, 1800, 1600, 2000, 1700, 1900],
  "savings": [3500, 3200, 3400, 3000, 3300, 3100]
}
```

### User Management Endpoints (Admin Only)

#### Get All Users
```http
GET /api/users
Authorization: Bearer {admin-token}
```

#### Update User Role
```http
PUT /api/users/{id}/role
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "role": "admin"
}
```

## 🗄 Database Schema

### Tables

#### users
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| password | VARCHAR(255) | NOT NULL |
| name | VARCHAR(255) | NOT NULL |
| role | ENUM | DEFAULT 'user' |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

#### categories
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| name | VARCHAR(100) | NOT NULL |
| type | ENUM | NOT NULL |
| created_at | TIMESTAMP | DEFAULT NOW() |

#### transactions
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| user_id | UUID | FOREIGN KEY → users(id) |
| category_id | UUID | FOREIGN KEY → categories(id) |
| type | ENUM | NOT NULL |
| amount | DECIMAL(10,2) | NOT NULL, > 0 |
| description | TEXT | - |
| date | DATE | NOT NULL |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

### Enums
- **user_role:** 'admin', 'user', 'read-only'
- **transaction_type:** 'income', 'expense'

### Indexes
- `idx_transactions_user_id` on transactions(user_id)
- `idx_transactions_date` on transactions(date)
- `idx_transactions_type` on transactions(type)
- `idx_transactions_category_id` on transactions(category_id)

## 🚢 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy Options

#### Option 1: Render (Recommended)
1. Fork this repository
2. Go to [render.com](https://render.com)
3. Create new "Blueprint" and connect your repo
4. Render will auto-deploy using `render.yaml`

#### Option 2: Manual Deployment

**Frontend (Vercel/Netlify)**
```bash
cd frontend
npm run build
# Deploy 'dist' folder
```

**Backend (Railway/Heroku)**
```bash
cd backend
# Set environment variables
# Deploy to platform
```

### Environment Variables Checklist

**Backend:**
- ✅ NODE_ENV=production
- ✅ DATABASE_URL
- ✅ REDIS_URL (optional)
- ✅ JWT_SECRET
- ✅ FRONTEND_URL
- ✅ PORT

**Frontend:**
- ✅ VITE_API_URL

## 🔒 Security

### Implemented Security Measures

1. **Authentication**
   - JWT-based stateless authentication
   - HTTP-only cookies (optional)
   - Token expiration and refresh

2. **Password Security**
   - bcrypt hashing (10 rounds)
   - Minimum password requirements
   - No password exposure in responses

3. **API Security**
   - Helmet.js security headers
   - CORS configuration
   - Rate limiting (100 requests/15min)
   - Input validation & sanitization
   - SQL injection prevention (parameterized queries)

4. **Authorization**
   - Role-based access control (RBAC)
   - Resource-level permissions
   - User data isolation

5. **Best Practices**
   - Environment variable management
   - Secure session handling
   - Error handling (no sensitive data leaks)
   - HTTPS enforcement (production)

## 🧪 Testing

### Run Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# E2E tests
npm run test:e2e
```

### Manual Testing
1. Use provided Swagger documentation
2. Import Postman collection (if available)
3. Test with demo credentials

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Follow existing patterns
- Use TypeScript for frontend
- Add comments for complex logic
- Write meaningful commit messages
- Update documentation

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Recharts](https://recharts.org/) for charting library
- [jsPDF](https://github.com/parallax/jsPDF) for PDF generation
- [Radix UI](https://www.radix-ui.com/) for accessible primitives

## 📧 Contact & Support

- **Issues:** [GitHub Issues](https://github.com/yourusername/personal-finance-tracker/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/personal-finance-tracker/discussions)
- **Email:** your.email@example.com

## 🗺 Roadmap

- [ ] Email notifications
- [ ] Recurring transactions
- [ ] Budget planning & alerts
- [ ] Multi-currency support
- [ ] Bank account integration
- [ ] Mobile app (React Native)
- [ ] Export to CSV/Excel
- [ ] Advanced charts & insights
- [ ] AI-powered spending recommendations

---

**Built with ❤️ using React, Node.js, and PostgreSQL**