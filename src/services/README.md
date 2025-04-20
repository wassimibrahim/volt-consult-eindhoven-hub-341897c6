
# MongoDB Integration Guide

## Backend Setup Required

To implement the MongoDB integration, you need to set up a Node.js/Express backend with the following:

### MongoDB Connection
Use this connection string in your backend (never in frontend):
```
mongodb+srv://volt:volt123@cluster0.5nf8mda.mongodb.net/volt?retryWrites=true&w=majority&appName=Cluster0
```

### Required API Endpoints

Your backend needs to implement these endpoints:

#### Applications
- `GET /api/applications` - Get all applications
- `POST /api/applications` - Create new application

#### Messages
- `GET /api/messages` - Get all messages
- `POST /api/messages` - Create new message

#### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `POST /api/auth` - Authenticate user

### Mongoose Models

Here are the Mongoose schemas you'll need:

```javascript
// Application Schema
const applicationSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  position: String,
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'accepted', 'rejected'],
    default: 'pending'
  },
  cv: String,
  motivationLetter: String,
  createdAt: { type: Date, default: Date.now }
});

// Message Schema
const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

// User Schema
const userSchema = new mongoose.Schema({
  email: String,
  name: String,
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  createdAt: { type: Date, default: Date.now }
});
```

### Security Considerations

1. Never expose MongoDB connection string in frontend code
2. Implement proper authentication and authorization
3. Use environment variables for sensitive information
4. Implement input validation
5. Set up CORS properly
6. Implement rate limiting

