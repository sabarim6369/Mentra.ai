# Mentra.ai API Server

Express.js API server with MongoDB for Mentra.ai platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mentraai
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

4. Start MongoDB server (if not running locally)

5. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### Health Check
- `GET /health` - Server health check

### Authentication

#### Register User
- `POST /api/auth/register`
- Body:
  ```json
  {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- Response:
  ```json
  {
    "user": {
      "id": "user_123",
      "name": "John Doe",
      "email": "john@example.com",
      "image": null
    },
    "token": "jwt_token_here"
  }
  ```

#### Login User
- `POST /api/auth/login`
- Body:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- Response:
  ```json
  {
    "user": {
      "id": "user_123",
      "name": "John Doe",
      "email": "john@example.com",
      "image": null
    },
    "token": "jwt_token_here"
  }
  ```

#### Get User
- `GET /api/auth/user/:id`
- Response:
  ```json
  {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "image": null,
    "emailVerified": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
  ```

### Agents

#### Get All Agents
- `GET /api/agents?userId=user_123`
- Response:
  ```json
  [
    {
      "_id": "...",
      "id": "agent_abc",
      "name": "Sales Assistant",
      "userId": "user_123",
      "instructions": "You are a professional sales assistant...",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
  ```

#### Get Single Agent
- `GET /api/agents/:id`
- Response:
  ```json
  {
    "_id": "...",
    "id": "agent_abc",
    "name": "Sales Assistant",
    "userId": "user_123",
    "instructions": "You are a professional sales assistant...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
  ```

#### Create Agent
- `POST /api/agents`
- Body:
  ```json
  {
    "name": "Sales Assistant",
    "userId": "user_123",
    "instructions": "You are a professional sales assistant specializing in B2B software sales."
  }
  ```
- Response:
  ```json
  {
    "_id": "...",
    "id": "agent_abc",
    "name": "Sales Assistant",
    "userId": "user_123",
    "instructions": "You are a professional sales assistant specializing in B2B software sales.",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
  ```

#### Update Agent
- `PUT /api/agents/:id`
- Body:
  ```json
  {
    "name": "Updated Sales Assistant",
    "instructions": "Updated instructions here..."
  }
  ```
- Response:
  ```json
  {
    "_id": "...",
    "id": "agent_abc",
    "name": "Updated Sales Assistant",
    "userId": "user_123",
    "instructions": "Updated instructions here...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T01:00:00.000Z"
  }
  ```

#### Delete Agent
- `DELETE /api/agents/:id`
- Response:
  ```json
  {
    "message": "Agent deleted successfully"
  }
  ```

### Meetings

#### Get All Meetings
- `GET /api/meetings?userId=user_123&status=upcoming&agentId=agent_abc`
- Query Parameters:
  - `userId` (required): User ID
  - `status` (optional): Filter by status (upcoming, active, completed, cancelled, processing)
  - `agentId` (optional): Filter by agent ID
- Response:
  ```json
  [
    {
      "_id": "...",
      "id": "meeting_xyz",
      "name": "Sales Call with Client",
      "userId": "user_123",
      "agentId": "agent_abc",
      "status": "upcoming",
      "instructions": "Discuss product features and pricing",
      "startedAt": null,
      "endedAt": null,
      "transcriptUrl": null,
      "recordingUrl": null,
      "summary": null,
      "scheduledStartTime": "2024-01-15T10:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
  ```

#### Get Single Meeting
- `GET /api/meetings/:id`
- Response:
  ```json
  {
    "_id": "...",
    "id": "meeting_xyz",
    "name": "Sales Call with Client",
    "userId": "user_123",
    "agentId": "agent_abc",
    "status": "upcoming",
    "instructions": "Discuss product features and pricing",
    "startedAt": null,
    "endedAt": null,
    "transcriptUrl": null,
    "recordingUrl": null,
    "summary": null,
    "scheduledStartTime": "2024-01-15T10:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
  ```

#### Create Meeting
- `POST /api/meetings`
- Body:
  ```json
  {
    "name": "Sales Call with Client",
    "userId": "user_123",
    "agentId": "agent_abc",
    "instructions": "Discuss product features and pricing",
    "scheduledStartTime": "2024-01-15T10:00:00.000Z"
  }
  ```
- Response:
  ```json
  {
    "_id": "...",
    "id": "meeting_xyz",
    "name": "Sales Call with Client",
    "userId": "user_123",
    "agentId": "agent_abc",
    "status": "upcoming",
    "instructions": "Discuss product features and pricing",
    "startedAt": null,
    "endedAt": null,
    "transcriptUrl": null,
    "recordingUrl": null,
    "summary": null,
    "scheduledStartTime": "2024-01-15T10:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
  ```

#### Update Meeting
- `PUT /api/meetings/:id`
- Body (all fields optional):
  ```json
  {
    "name": "Updated Meeting Name",
    "status": "active",
    "instructions": "Updated instructions",
    "scheduledStartTime": "2024-01-16T10:00:00.000Z",
    "startedAt": "2024-01-15T10:00:00.000Z",
    "endedAt": "2024-01-15T11:00:00.000Z",
    "transcriptUrl": "https://example.com/transcript.jsonl",
    "recordingUrl": "https://example.com/recording.mp4",
    "summary": "Meeting summary here..."
  }
  ```
- Response:
  ```json
  {
    "_id": "...",
    "id": "meeting_xyz",
    "name": "Updated Meeting Name",
    "userId": "user_123",
    "agentId": "agent_abc",
    "status": "active",
    "instructions": "Updated instructions",
    "startedAt": "2024-01-15T10:00:00.000Z",
    "endedAt": "2024-01-15T11:00:00.000Z",
    "transcriptUrl": "https://example.com/transcript.jsonl",
    "recordingUrl": "https://example.com/recording.mp4",
    "summary": "Meeting summary here...",
    "scheduledStartTime": "2024-01-16T10:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
  ```

#### Delete Meeting
- `DELETE /api/meetings/:id`
- Response:
  ```json
  {
    "message": "Meeting deleted successfully"
  }
  ```

## Database Models

### User
- `id`: String (unique, required)
- `name`: String (required)
- `email`: String (unique, required)
- `emailVerified`: Boolean (default: false)
- `image`: String (optional)
- `password`: String (optional, hashed)
- `createdAt`: Date (auto)
- `updatedAt`: Date (auto)

### Agent
- `id`: String (unique, auto-generated with nanoid)
- `name`: String (required)
- `userId`: String (required, references User)
- `instructions`: String (required)
- `createdAt`: Date (auto)
- `updatedAt`: Date (auto)

### Meeting
- `id`: String (unique, auto-generated with nanoid)
- `name`: String (required)
- `userId`: String (required, references User)
- `agentId`: String (required, references Agent)
- `status`: String (enum: upcoming, active, completed, cancelled, processing)
- `instructions`: String (required)
- `startedAt`: Date (optional)
- `endedAt`: Date (optional)
- `transcriptUrl`: String (optional)
- `recordingUrl`: String (optional)
- `summary`: String (optional)
- `scheduledStartTime`: Date (optional)
- `createdAt`: Date (auto)
- `updatedAt`: Date (auto)

## Project Structure

```
server/
├── config/
│   └── database.js          # MongoDB connection
├── models/
│   ├── User.js              # User model
│   ├── Agent.js             # Agent model
│   └── Meeting.js           # Meeting model
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── agents.js            # Agent CRUD routes
│   └── meetings.js          # Meeting CRUD routes
├── .env.example             # Environment variables template
├── index.js                 # Main server file
├── package.json             # Dependencies
└── README.md                # This file
```

## Future Enhancements

- Authentication middleware for protected routes
- Input validation middleware
- Error handling middleware
- Rate limiting
- Pagination for list endpoints
- File upload for agent avatars
- Background job processing for meeting summarization
- Webhook integration for video conferencing
