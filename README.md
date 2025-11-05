# SlotSwapper - Peer-to-Peer Time Slot Scheduling Application

## 🎯 Project Overview

**SlotSwapper** is a full-stack web application that enables users to swap time slots in their calendars with other users. Built as part of the ServiceHive Full Stack Intern technical challenge, this application demonstrates expertise in:

- RESTful API design with complex transaction logic
- JWT-based authentication and authorization
- Real-time state management
- Responsive UI/UX design
- Database schema design for relational data

### The Core Concept

Users manage their calendars with events/time slots. They can:
1. Mark busy slots as "SWAPPABLE"
2. Browse other users' swappable slots in the Marketplace
3. Request to swap their slot with another user's slot
4. Accept or reject incoming swap requests
5. Upon acceptance, the ownership of both slots is automatically exchanged

---

## 🛠️ Technology Stack

### Frontend
- **React 18.2** - Modern UI framework
- **React Router v6** - Client-side routing with protected routes
- **Bootstrap 5.3.8** - Responsive UI components
- **Axios** - HTTP client with JWT interceptors
- **date-fns** - Date formatting and manipulation
- **Material Icons** - Professional iconography

### Backend
- **Node.js + Express 4.18.2** - RESTful API server
- **MongoDB + Mongoose 7.6.3** - NoSQL database with ODM
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### Database Schema
- **Users**: Authentication and profile data
- **Events**: Time slots with ownership and status
- **SwapRequests**: Transaction records for slot exchanges

---

## ✅ Requirements Compliance Checklist

### 1. User Authentication ✅
- [x] Sign Up with Name, Email, Password
- [x] Login with JWT token generation
- [x] JWT sent as Bearer token in Authorization header
- [x] Protected routes requiring authentication
- [x] Password hashing with bcrypt

### 2. Backend: Calendar & Data Model ✅
**Event Schema:**
```javascript
{
  title: String (required),
  startTime: Date (required),
  endTime: Date (required),
  status: Enum ['BUSY', 'SWAPPABLE', 'SWAP_PENDING'],
  userId: ObjectId (reference to User)
}
```

**CRUD Endpoints:**
- [x] POST /api/events - Create new event
- [x] GET /api/events - Get user's events
- [x] GET /api/events/:id - Get single event
- [x] PUT /api/events/:id - Update event
- [x] DELETE /api/events/:id - Delete event

### 3. Backend: Swap Logic (Core Challenge) ✅

**GET /api/swaps/swappable**
- [x] Returns only SWAPPABLE slots from other users
- [x] Excludes logged-in user's own slots
- [x] Populated with user information

**POST /api/swaps/request**
- [x] Accepts `mySlotId` and `theirSlotId`
- [x] Validates both slots exist and are SWAPPABLE
- [x] Creates SwapRequest with PENDING status
- [x] Updates both slots to SWAP_PENDING status
- [x] Prevents slots from being offered in other swaps

**POST /api/swaps/respond/:id**
- [x] Accepts `action: 'accept' | 'reject'`
- [x] **If Rejected:**
  - Sets SwapRequest status to REJECTED
  - Resets both slots to SWAPPABLE
- [x] **If Accepted (Key Transaction):**
  - Marks SwapRequest as ACCEPTED
  - **Exchanges userId ownership between slots**
  - Sets both slots to BUSY status
- [x] Verifies user authorization (only target user can respond)

### 4. Frontend: UI/UX ✅

**Authentication:**
- [x] Sign Up page with form validation
- [x] Login page with error handling
- [x] JWT stored in localStorage
- [x] Auto-logout on token expiration

**Calendar/Dashboard View:**
- [x] Display user's events in calendar grid
- [x] Toggle between Calendar and List views
- [x] Create new events with modal form
- [x] Update event status (Make Swappable button)
- [x] Visual status indicators (color-coded badges)

**Marketplace View:**
- [x] Fetches from GET /api/swaps/swappable
- [x] Displays available slots from other users
- [x] "Request Swap" button on each slot
- [x] Modal to select user's own swappable slot
- [x] Responsive grid layout

**Notifications/Requests View:**
- [x] **Incoming Requests:** Swaps offered by others
  - Accept/Reject buttons
  - Shows both slots involved
- [x] **Outgoing Requests:** Swaps user has offered
  - Shows pending status
  - Displays target user info

**State Management:**
- [x] Dynamic updates without page refresh
- [x] React Context API for auth state
- [x] Optimistic UI updates
- [x] Protected routes (redirects to login if not authenticated)

---

## 🚀 Local Setup Instructions

### Prerequisites
- Node.js v14+ and npm
- MongoDB Atlas account (or local MongoDB installation)
- Git

### Step 1: Clone the Repository
```bash
git clone <your-github-repo-url>
cd slotswapper
```

### Step 2: Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in the `server` directory:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/slotswapper?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here_minimum_32_characters_long
```

4. Start the server:
```bash
npm start
# or for development with auto-restart:
npm run dev
```

Server will run on `http://localhost:5000`

### Step 3: Frontend Setup

1. Open new terminal and navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in the `client` directory (optional):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

Client will run on `http://localhost:3000`

### Step 4: Test the Application

1. Open browser to `http://localhost:3000`
2. Sign up with a new account
3. Create some events on your dashboard
4. Mark events as "SWAPPABLE"
5. Open in incognito/another browser to create a second user
6. Test the swap flow between two users

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |

**Example Request - Sign Up:**
```json
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Example Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Events (Calendar Management)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/events` | Create new event | Yes |
| GET | `/api/events` | Get user's events | Yes |
| GET | `/api/events/:id` | Get single event | Yes |
| PUT | `/api/events/:id` | Update event | Yes |
| DELETE | `/api/events/:id` | Delete event | Yes |

**Example Request - Create Event:**
```json
POST /api/events
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Team Meeting",
  "startTime": "2025-11-06T10:00:00Z",
  "endTime": "2025-11-06T11:00:00Z",
  "status": "BUSY"
}
```

**Example Response:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "Team Meeting",
  "startTime": "2025-11-06T10:00:00.000Z",
  "endTime": "2025-11-06T11:00:00.000Z",
  "status": "BUSY",
  "userId": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "createdAt": "2025-11-05T12:00:00.000Z",
  "updatedAt": "2025-11-05T12:00:00.000Z"
}
```

### Swaps (Core Feature)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/swaps/swappable` | Get all swappable slots (excluding own) | Yes |
| POST | `/api/swaps/request` | Create swap request | Yes |
| GET | `/api/swaps/my-requests` | Get incoming/outgoing swap requests | Yes |
| POST | `/api/swaps/respond/:id` | Accept/Reject swap request | Yes |

**Example Request - Create Swap Request:**
```json
POST /api/swaps/request
Authorization: Bearer <token>
Content-Type: application/json

{
  "mySlotId": "507f1f77bcf86cd799439012",
  "theirSlotId": "507f1f77bcf86cd799439013"
}
```

**Example Response:**
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "mySlot": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Team Meeting",
    "startTime": "2025-11-06T10:00:00.000Z",
    "status": "SWAP_PENDING"
  },
  "theirSlot": {
    "_id": "507f1f77bcf86cd799439013",
    "title": "Focus Block",
    "startTime": "2025-11-07T14:00:00.000Z",
    "status": "SWAP_PENDING"
  },
  "requestingUser": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe"
  },
  "targetUser": {
    "_id": "507f1f77bcf86cd799439015",
    "name": "Jane Smith"
  },
  "status": "PENDING",
  "createdAt": "2025-11-05T12:00:00.000Z"
}
```

**Example Request - Respond to Swap:**
```json
POST /api/swaps/respond/507f1f77bcf86cd799439014
Authorization: Bearer <token>
Content-Type: application/json

{
  "action": "accept"
}
```

**Example Response (Accepted):**
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "status": "ACCEPTED",
  "mySlot": {
    "userId": "507f1f77bcf86cd799439015", // Ownership exchanged!
    "status": "BUSY"
  },
  "theirSlot": {
    "userId": "507f1f77bcf86cd799439011", // Ownership exchanged!
    "status": "BUSY"
  }
}
```

---

## 🏗️ Architecture & Design Decisions

### Database Schema Design
- **Normalized structure** with separate collections for Users, Events, and SwapRequests
- **Status-based state machine** for Events (BUSY → SWAPPABLE → SWAP_PENDING → BUSY/SWAPPABLE)
- **Bidirectional references** in SwapRequest (mySlot, theirSlot, requestingUser, targetUser)

### Security Measures
- JWT tokens with 30-day expiration
- Password hashing with bcrypt (10 salt rounds)
- Protected routes with authentication middleware
- Ownership validation on all update/delete operations
- CORS configuration for secure cross-origin requests

### Frontend Architecture
- **Component-based design** with reusable components
- **Context API** for global authentication state
- **Service layer** for API calls (abstracted from components)
- **Protected routes** using React Router
- **Responsive design** with Bootstrap grid system and custom CSS

### Key Implementation Details

**Swap Transaction Logic:**
The most complex part is the atomic ownership exchange in `respondToSwapRequest()`:
```javascript
// Exchange ownership
const tempUserId = mySlot.userId;
mySlot.userId = theirSlot.userId;
theirSlot.userId = tempUserId;

mySlot.status = 'BUSY';
theirSlot.status = 'BUSY';

await mySlot.save();
await theirSlot.save();
```

**Preventing Double Swaps:**
When a swap request is created, both slots are marked as `SWAP_PENDING`, preventing them from appearing in `/api/swaps/swappable` and blocking concurrent swap requests.

---

## 🎨 UI/UX Features

### Visual Design
- **Gradient headers** with professional color schemes
- **Material Icons** for intuitive navigation
- **Status badges** with color coding:
  - 🔴 BUSY (Red)
  - 🟢 SWAPPABLE (Green)
  - 🟠 SWAP_PENDING (Orange)
- **Hover animations** with transform and shadow effects
- **Smooth transitions** using cubic-bezier timing functions

### Responsive Design
- **Mobile-first approach** with Bootstrap breakpoints
- **Responsive calendar** that adapts to screen size
- **Touch-friendly** button sizes and spacing
- **Hamburger menu** on mobile devices

---

## 🧪 Testing Recommendations

### Manual Testing Checklist
1. **Authentication Flow:**
   - [ ] Sign up with new account
   - [ ] Login with credentials
   - [ ] Access protected routes
   - [ ] Logout and verify token removal

2. **Event Management:**
   - [ ] Create event with all fields
   - [ ] View events in calendar
   - [ ] Update event status to SWAPPABLE
   - [ ] Delete event

3. **Swap Flow (Two Browser Sessions):**
   - [ ] User A creates and marks slot as SWAPPABLE
   - [ ] User B views slot in Marketplace
   - [ ] User B requests swap with their swappable slot
   - [ ] Verify both slots show SWAP_PENDING
   - [ ] User A sees incoming request
   - [ ] User A accepts swap
   - [ ] Verify ownership exchange
   - [ ] Verify both slots now show BUSY

4. **Edge Cases:**
   - [ ] Try swapping non-swappable slot
   - [ ] Try accessing another user's swap request
   - [ ] Try creating swap with own slot
   - [ ] Verify end time > start time validation

---

## 🚧 Challenges Faced & Solutions

### Challenge 1: Atomic Swap Transaction
**Problem:** Ensuring both slots are updated atomically without race conditions.

**Solution:** Sequential await calls with transaction-like logic:
```javascript
await mySlot.save();
await theirSlot.save();
await swapRequest.save();
```

### Challenge 2: State Synchronization
**Problem:** Calendar not updating after swap acceptance.

**Solution:** Implemented callback pattern with `onSuccess` props and `fetchEvents()` refetch after mutations.

### Challenge 3: API Route Mismatch
**Problem:** Frontend calling wrong endpoints causing 404 errors.

**Solution:** Centralized service layer with consistent route naming:
- `/api/swaps/swappable`
- `/api/swaps/request`
- `/api/swaps/my-requests`
- `/api/swaps/respond/:id`

---

## 📦 Project Structure

```
slotswapper/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── auth/       # Login, Signup, ProtectedRoute
│   │   │   ├── common/     # Navbar, Loader, ErrorMessage
│   │   │   ├── events/     # Calendar, EventList, CreateForm
│   │   │   ├── layout/     # Layout wrappers, Footer
│   │   │   └── swaps/      # SwapList, SwapRequestCard
│   │   ├── context/        # React Context for auth
│   │   ├── pages/          # Page-level components
│   │   ├── services/       # API service layer
│   │   └── utils/          # Helper functions
│   └── package.json
│
├── server/                 # Node.js/Express backend
│   ├── config/             # Database connection
│   ├── controllers/        # Business logic
│   │   ├── authController.js
│   │   ├── eventController.js
│   │   └── swapController.js
│   ├── middleware/         # JWT authentication
│   ├── models/             # Mongoose schemas
│   │   ├── User.js
│   │   ├── Event.js
│   │   └── SwapRequest.js
│   ├── routes/             # API route definitions
│   │   ├── auth.js
│   │   ├── events.js
│   │   └── swaps.js
│   ├── server.js           # Entry point
│   └── package.json
│
└── README.md               # This file
```

---

## 🎯 Future Enhancements (Bonus Features)

### Planned Improvements
- [ ] **Unit/Integration Tests:** Jest/Mocha for backend API testing
- [ ] **Real-time Notifications:** WebSocket integration for instant swap notifications
- [ ] **Deployment:** Frontend on Vercel, Backend on Render/Heroku
- [ ] **Containerization:** Docker + docker-compose for one-command setup
- [ ] **Email Notifications:** Nodemailer for swap request alerts
- [ ] **Calendar Integration:** Google Calendar sync
- [ ] **Advanced Filtering:** Search/filter in Marketplace
- [ ] **Swap History:** Transaction log with undo capability

---

## 🙏 Acknowledgments

This project was built as part of the **ServiceHive Full Stack Intern** technical challenge. It demonstrates:
- Full-stack development capabilities
- Complex API design with transactional logic
- Modern React patterns and state management
- Database schema design
- Security best practices
- Responsive UI/UX design

---

## 📝 License

MIT License - Feel free to use this project for learning purposes.

---

## 👤 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

---

## 📞 Contact & Support

If you have any questions or need clarification about the implementation:
- Open an issue on GitHub
- Email: your.email@example.com

---

**Built with ❤️ for ServiceHive**
