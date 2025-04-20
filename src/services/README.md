
# MongoDB Integration for Volt Consulting Group

This directory contains services that provide MongoDB integration for Volt Consulting Group's web application. The implementation includes a hybrid approach that works with both MongoDB (when properly configured with a backend API) and falls back to localStorage for development and demo purposes.

## Current Implementation

The current implementation uses a hybrid approach:

1. First attempts to connect to the MongoDB database through REST API endpoints
2. Falls back to localStorage if API calls fail (for development/demo purposes)

## Backend Setup (Required for Production)

To fully utilize MongoDB integration, you need to set up a backend server that connects to your MongoDB database. Here's a high-level overview:

1. Create a Node.js backend with Express
2. Connect to MongoDB using the provided connection string
3. Set up API endpoints that match the ones expected by the frontend services
4. Implement proper authentication and security

### MongoDB Connection String

```
mongodb+srv://volt:volt123@cluster0.5nf8mda.mongodb.net/volt?retryWrites=true&w=majority&appName=Cluster0
```

## API Endpoints Required

Your backend API should implement the following endpoints:

### Applications
- `GET /api/applications` - Get all applications
- `POST /api/applications` - Create a new application
- `PATCH /api/applications/:id` - Update application status

### Positions
- `GET /api/positions` - Get all positions
- `POST /api/positions` - Create a new position
- `PATCH /api/positions/:id` - Update a position
- `DELETE /api/positions/:id` - Delete a position

### Contact Messages
- `GET /api/contact` - Get all contact messages
- `POST /api/contact` - Create a new contact message

### Admin Authentication
- `POST /api/admin/verify` - Verify admin password

## Security Considerations

1. **IMPORTANT**: The MongoDB connection string should never be exposed in the frontend code
2. Always implement proper authentication and authorization on your API endpoints
3. Use environment variables for sensitive information
4. Consider implementing rate limiting to prevent abuse

## Next Steps

1. **Create a Backend API**: Implement a Node.js/Express backend with MongoDB integration
2. **Update API URL**: Once deployed, update the `API_URL` constant in `mongoDBService.ts`
3. **Test Thoroughly**: Ensure both APIs and fallback mechanisms work correctly

For any questions or issues, please contact the development team.
