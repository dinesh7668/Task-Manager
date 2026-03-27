# TaskFlow - Modern Task Manager

A full-stack task management application built with React, Node.js, Express, and MongoDB.

##  Features

- **Task Management**: Create, edit, delete, and reorder tasks
- **Priority System**: High, Medium, Low priority with color indicators
- **Categories**: Work, Personal, Study, Health, Finance
- **Drag & Drop**: Reorder tasks with smooth drag and drop
- **Calendar View**: View tasks organized by date
- **Dashboard**: Analytics with progress charts
- **Dark Mode**: Toggle between light and dark themes
- **Authentication**: JWT-based login and signup
- **Responsive**: Works on mobile and desktop
- **Toast Notifications**: Feedback for all actions
- **Loading Skeletons**: Smooth loading states
- **Animations**: Framer Motion powered transitions

##  Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite |
| Styling | Tailwind CSS v4 |
| State | Context API + useReducer |
| Animations | Framer Motion |
| Drag & Drop | dnd-kit |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Auth | JWT (jsonwebtoken, bcryptjs) |

##  Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone and install

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Configure environment

Create a `.env` file in the `server/` directory:

```env
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
CLIENT_URL=http://localhost:5173
```

### 3. Start MongoDB

Make sure MongoDB is running on your local machine, or update `MONGO_URI` with your MongoDB Atlas connection string.

### 4. Run the application

```bash
# Terminal 1 - Start backend
cd server
npm run dev

# Terminal 2 - Start frontend
cd client
npm run dev
```

The app will be available at **http://localhost:5173**

##  Project Structure

```
Task Manager/
├── server/                  # Backend
│   ├── config/db.js         # MongoDB connection
│   ├── controllers/         # Route handlers
│   ├── middleware/           # Auth & error handling
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API endpoints
│   └── server.js            # Express server
├── client/                  # Frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # State management
│   │   ├── pages/           # Route pages
│   │   ├── services/        # API client
│   │   ├── App.jsx          # Root component
│   │   └── index.css        # Global styles
│   └── index.html
└── README.md
```

##  API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

| DELETE | `/api/tasks/:id` | Delete task |



