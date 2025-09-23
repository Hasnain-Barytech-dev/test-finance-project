# Connect Your Node.js Backend

## Quick Setup

### 1. Update API URL
Create a `.env.local` file in your frontend root:
```bash
VITE_API_URL=http://localhost:3000/api
```

### 2. Backend API Endpoints Required

Your backend should match these endpoints that the frontend expects:

#### Authentication Routes
```
POST /api/auth/login
POST /api/auth/register  
GET /api/auth/verify
```

#### Transaction Routes
```
GET /api/transactions
POST /api/transactions
PUT /api/transactions/:id
DELETE /api/transactions/:id
```

#### Analytics Routes
```
GET /api/analytics
```

#### User Management Routes (Admin only)
```
GET /api/users
```

### 3. Expected API Response Format

#### Login/Register Response:
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com", 
    "name": "User Name",
    "role": "admin|user|read-only",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Verify Token Response:
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name", 
    "role": "admin|user|read-only",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. CORS Configuration

Ensure your backend has CORS enabled for your frontend URL:
```javascript
app.use(cors({
  origin: 'http://localhost:5173', // Your Vite dev server
  credentials: true
}));
```

### 5. Start Both Servers
1. Start your Node.js backend: `npm start` (typically on port 3000)
2. Start the React frontend: `npm run dev` (typically on port 5173)

## Environment Variables

The frontend uses:
- `VITE_API_URL` - Your backend API base URL (defaults to http://localhost:3000/api)

## Authentication Flow

1. User logs in → Frontend sends credentials to `/api/auth/login`
2. Backend validates → Returns JWT token + user data
3. Frontend stores token in localStorage as `finance_token`
4. All subsequent requests include `Authorization: Bearer <token>` header
5. Backend middleware validates token and extracts user role for RBAC

Your existing backend structure should work perfectly with this setup!