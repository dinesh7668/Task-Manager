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

| DELETE | API Calling|



