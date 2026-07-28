# Mentra.ai - Technical Documentation

## Project Overview

Mentra.ai is an AI-powered meeting platform that combines video conferencing with intelligent AI agents. The platform enables users to schedule and conduct meetings with AI assistants that can participate, transcribe, and summarize discussions in real-time.

### Core Features
- **User Authentication**: Email/password and social login (Google, GitHub)
- **AI Agent Management**: Create and configure custom AI agents with specific instructions
- **Meeting Scheduling**: Schedule meetings with AI agent participation
- **Video Conferencing**: Real-time video calls using Stream Video infrastructure
- **Calendar Integration**: Visual calendar for meeting management
- **AI-Powered Summarization**: Automatic meeting transcription and AI-generated summaries
- **Background Processing**: Asynchronous meeting processing using Inngest

---

## Technology Stack

### Frontend Framework
- **Next.js 15.3.2**: React framework with App Router for server-side rendering
- **React 19**: UI library with concurrent features
- **TypeScript 5**: Type-safe JavaScript development
- **Tailwind CSS 4**: Utility-first CSS framework
- **Turbo**: Next.js compiler for faster builds

### Database & ORM
- **PostgreSQL**: Primary database (hosted on Neon)
- **Drizzle ORM 0.44.4**: Type-safe SQL ORM with schema migrations
- **Drizzle Kit 0.31.4**: Database migration and management tools

### Authentication
- **Better Auth 1.2.8**: Modern authentication library
- **Providers**: Email/password, Google OAuth, GitHub OAuth
- **Session Management**: Server-side sessions with secure token handling

### Video & Real-time
- **Stream Video SDK 1.19.7**: Video conferencing infrastructure
- **Stream Node SDK 0.5.1**: Server-side Stream API integration
- **Stream OpenAI Realtime API 0.1.4**: Real-time AI integration

### AI & Background Processing
- **Inngest 3.40.2**: Background job processing and workflow orchestration
- **Inngest Agent Kit 0.9.0**: AI agent framework for background tasks
- **Google Gemini 1.15.0**: AI model for meeting summarization
- **Gemini 2.5 Flash**: High-performance AI model for text processing

### API & State Management
- **tRPC 11.1.2**: End-to-end type-safe APIs
- **TanStack Query 5.76.1**: Server state management and caching
- **Zod 3.25.7**: Schema validation and type inference

### UI Components
- **Radix UI**: Comprehensive component library (35+ components)
- **Lucide React 0.536.0**: Icon library
- **Shadcn/ui**: Reusable component patterns
- **React Hook Form 7.62.0**: Form state management
- **Sonner 2.0.7**: Toast notifications

### Development Tools
- **ESLint 9**: Code linting and quality
- **tsx 4.20.3**: TypeScript execution
- **ngrok**: Local tunneling for webhook testing

---

## Architecture

### Project Structure

```
mentraai/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Better Auth endpoints
│   │   │   ├── trpc/          # tRPC API handler
│   │   │   ├── inngest/       # Inngest webhook handler
│   │   │   └── webhook/       # Stream Video webhooks
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Main application pages
│   │   │   ├── agents/        # Agent management
│   │   │   ├── meetings/      # Meeting management
│   │   │   └── calendar/      # Calendar view
│   │   └── call/              # Video call interface
│   ├── modules/               # Feature modules
│   │   ├── agents/            # Agent module
│   │   ├── meetings/          # Meetings module
│   │   ├── calendar/          # Calendar module
│   │   ├── call/              # Video call module
│   │   └── auth/              # Auth UI components
│   ├── db/                    # Database configuration
│   │   ├── schema.ts          # Database schema definitions
│   │   └── index.ts           # Database connection
│   ├── lib/                   # Utility libraries
│   │   ├── auth.ts            # Better Auth server config
│   │   ├── auth-client.ts     # Better Auth client config
│   │   ├── stream-video.ts    # Stream Video client
│   │   ├── avatar.tsx         # Avatar generation
│   │   └── utils.ts           # General utilities
│   ├── trpc/                  # tRPC configuration
│   │   ├── init.ts            # tRPC initialization
│   │   ├── server.tsx         # Server-side tRPC
│   │   ├── client.tsx         # Client-side tRPC
│   │   ├── query-client.ts    # React Query client
│   │   └── routers/           # API route definitions
│   ├── inngest/               # Background job configuration
│   │   ├── client.ts          # Inngest client
│   │   └── functions.ts       # Job definitions
│   └── components/            # Shared UI components
├── drizzle/                   # Database migrations
├── public/                    # Static assets
└── package.json               # Dependencies
```

### Module Architecture

Each feature module follows a consistent structure:

```
modules/[feature]/
├── hooks/              # Custom React hooks
├── params.ts           # URL parameter schemas
├── schema.ts           # Zod validation schemas
├── server/             # Server-side logic
│   └── procedures.ts   # tRPC procedures
└── ui/                 # UI components
    ├── components/     # Reusable components
    └── views/          # Page-level components
```

---

## Database Schema

### Core Tables

#### User Management
- **user**: User accounts with authentication data
- **session**: User sessions for authentication
- **account**: OAuth provider accounts
- **verification**: Email verification tokens

#### Application Data
- **agents**: AI agent configurations
- **meetings**: Meeting records with status tracking

### Schema Details

```typescript
// User Table
- id: string (primary key)
- name: string
- email: string (unique)
- emailVerified: boolean
- image: string (avatar URL)
- createdAt: timestamp
- updatedAt: timestamp

// Agent Table
- id: string (primary key, nanoid)
- name: string
- userId: string (foreign key to user)
- instructions: string (AI system prompt)
- createdAt: timestamp
- updatedAt: timestamp

// Meeting Table
- id: string (primary key, nanoid)
- name: string
- userId: string (foreign key to user)
- agentId: string (foreign key to agent)
- status: enum (upcoming, active, completed, cancelled, processing)
- instructions: string
- startedAt: timestamp
- endedAt: timestamp
- transcriptUrl: string
- recordingUrl: string
- summary: string
- scheduledStartTime: timestamp with timezone
- createdAt: timestamp
- updatedAt: timestamp
```

### Relationships
- Users → Sessions (one-to-many)
- Users → Accounts (one-to-many)
- Users → Agents (one-to-many)
- Users → Meetings (one-to-many)
- Agents → Meetings (one-to-many)

---

## API Architecture

### tRPC Router Structure

```typescript
appRouter = {
  agents: {
    create: Create new agent
    getMany: List agents with pagination
    getOne: Get single agent
    update: Update agent
    delete: Delete agent
  },
  meetings: {
    create: Create new meeting
    getMany: List meetings with filters
    getOne: Get single meeting
    update: Update meeting
    delete: Delete meeting
    generateToken: Generate Stream Video token
  }
}
```

### API Endpoints

#### Authentication (`/api/auth/[...all]`)
- Better Auth handler for all authentication operations
- Supports email/password, Google, GitHub login
- Session management and token refresh

#### tRPC API (`/api/trpc/[trpc]`)
- Type-safe API procedures
- Automatic client-side type inference
- Integrated with React Query for caching

#### Inngest Webhook (`/api/inngest`)
- Receives background job events
- Triggers meeting processing workflows
- Handles async task completion

#### Stream Webhooks (`/api/webhook`)
- Receives Stream Video events
- Handles call state changes
- Triggers meeting completion workflows

---

## Authentication Flow

### Setup
Better Auth configured with:
- **Email/Password**: Traditional authentication
- **Google OAuth**: Social login integration
- **GitHub OAuth**: Developer social login
- **Session Management**: Secure server-side sessions

### Configuration
```typescript
// Server-side (auth.ts)
betterAuth({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: { clientId, clientSecret },
    github: { clientId, clientSecret }
  },
  database: drizzleAdapter(db, { provider: "pg", schema })
})

// Client-side (auth-client.ts)
createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL
})
```

### Flow
1. User initiates login from `/auth/sign-in` or `/auth/sign-up`
2. Credentials sent to Better Auth API
3. Server validates and creates session
4. Session token stored in HTTP-only cookie
5. Client uses session for authenticated requests
6. tRPC procedures validate session via `protectedProcedure`

---

## Video Calling Architecture

### Stream Video Integration

#### Client Setup
```typescript
// Stream Video Client Initialization
const client = new StreamVideoClient({
  apiKey: process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY,
  user: { id, name, image },
  token: generatedToken
})
```

#### Call Flow
1. **Token Generation**: Server generates user-specific token via tRPC
2. **Client Initialization**: Stream Video client initialized with user credentials
3. **Call Creation**: Call object created with meeting ID
4. **Device Management**: Camera/microphone permissions requested
5. **Call Joining**: User joins the video call
6. **Media Streaming**: Real-time audio/video via WebRTC
7. **Call Termination**: Cleanup and webhook trigger

#### Components
- **CallLobby**: Pre-call setup with device testing
- **CallActive**: Active call interface with controls
- **CallEnded**: Post-call summary and navigation
- **CallConnect**: Stream Video client initialization
- **CallProvider**: Authentication and user context

### Error Handling
- Device not found errors handled gracefully
- Fallback to join without media devices
- WebSocket connection failure handling
- Network instability recovery

---

## AI Agent System

### Agent Creation
Users create AI agents with:
- **Name**: Display name for the agent
- **Instructions**: System prompt defining agent behavior
- **Capabilities**: Configured via prompt engineering

### Agent Usage in Meetings
- Agents are assigned to meetings during scheduling
- Agents participate in video calls via Stream Video
- Agents can transcribe and analyze conversations
- AI summarization uses agent context

### Technical Implementation
```typescript
// Agent Schema
{
  id: nanoid(),
  name: string,
  userId: string,
  instructions: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

---

## Meeting Processing Pipeline

### Background Processing with Inngest

#### Workflow Trigger
1. Meeting ends via Stream Video webhook
2. Webhook triggers `meetings/processing` event
3. Inngest picks up the event asynchronously

#### Processing Steps

**Step 1: Fetch Transcript**
- Fetch transcript from Stream Video URL
- Parse JSONL format transcript
- Handle authentication and access errors

**Step 2: Speaker Identification**
- Extract speaker IDs from transcript
- Query database for user and agent information
- Map speaker IDs to names

**Step 3: AI Summarization**
- Use Inngest Agent Kit with Gemini 2.5 Flash
- Feed transcript with speaker information
- Generate structured summary with:
  - Executive summary
  - Key decisions
  - Action items
  - Discussion points
  - Next steps

**Step 4: Database Update**
- Update meeting record with summary
- Change status to "completed"
- Store processing metadata

### Inngest Configuration
```typescript
const meetingsProcessing = inngest.createFunction(
  { id: "meetings/processing" },
  { event: "meetings/processing" },
  async ({ event, step }) => {
    // Multi-step processing workflow
  }
)
```

---

## Calendar System

### Features
- **Visual Calendar**: Monthly grid view with event display
- **Event Filtering**: Filter by status, agent, date range
- **Event Cards**: Detailed event information
- **Navigation**: Month/year navigation
- **Responsive Design**: Mobile-friendly layout

### Technical Implementation
- **react-day-picker**: Date selection and calendar grid
- **Custom Components**: Calendar grid, header, event cards
- **State Management**: Local component state with URL params
- **Dark Theme**: Consistent violet/purple dark theme

---

## UI/UX Design System

### Theme Configuration
- **Color Palette**: Dark violet/purple theme
  - Primary: violet-500, purple-600
  - Background: slate-900, black
  - Accents: fuchsia, emerald for variety
- **Typography**: Geist font (Next.js default)
- **Components**: Radix UI primitives with custom styling

### Component Library
- **shadcn/ui**: Base component patterns
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Consistent iconography

### Responsive Design
- Mobile-first approach
- Breakpoint-based layouts
- Touch-friendly controls
- Adaptive video call interface

---

## Development Workflow

### Environment Setup
```bash
# Install dependencies
npm install

# Database setup
npm run db:push        # Push schema to database
npm run db:studio      # Open Drizzle Studio

# Development server
npm run dev            # Start Next.js dev server
npm run dev:webhook    # Start ngrok for webhooks
npm run inngest:dev    # Start Inngest dev server
```

### Database Migrations
```bash
npm run db:generate     # Generate migration files
npm run db:push        # Apply migrations
npm run db:reset       # Reset database
```

### Code Quality
```bash
npm run lint           # Run ESLint
npm run build          # Production build
```

---

## Deployment Considerations

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `NEXT_PUBLIC_APP_URL`: Application base URL
- `NEXT_PUBLIC_STREAM_VIDEO_API_KEY`: Stream Video API key
- `STREAM_VIDEO_SECRET_KEY`: Stream Video secret key
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth secret
- `GITHUB_CLIENT_ID`: GitHub OAuth client ID
- `GITHUB_CLIENT_SECRET`: GitHub OAuth secret
- `GEMINI_API_KEY`: Google Gemini API key
- `INNGEST_SIGNING_KEY`: Inngest webhook signing key

### Deployment Platforms
- **Vercel**: Recommended for Next.js deployment
- **Neon**: PostgreSQL database hosting
- **Inngest Cloud**: Background job processing
- **Stream Video**: Video infrastructure

### ngrok Configuration
Used for local development webhook testing:
- Exposes localhost:3000 to public URL
- Enables Stream Video webhook delivery
- Allows OAuth callback testing
- Free tier limitations may affect WebSocket connections

---

## Security Considerations

### Authentication
- HTTP-only session cookies
- Secure token generation
- OAuth 2.0 flow for social login
- CSRF protection via Better Auth

### API Security
- tRPC protected procedures
- Session validation on all mutations
- Type-safe input validation with Zod
- SQL injection prevention via Drizzle ORM

### Data Protection
- Encrypted database connections
- Secure Stream Video token generation
- Environment variable secrets management
- User data isolation via foreign keys

### Webhook Security
- Inngest signing key validation
- Stream Video webhook signature verification
- Origin validation for ngrok URLs

---

## Performance Optimizations

### Frontend
- Next.js server-side rendering
- React Query caching and deduplication
- Code splitting via dynamic imports
- Image optimization with Next.js Image
- Turbopack for faster development builds

### Backend
- Database query optimization with proper indexing
- Connection pooling via Neon serverless
- Async processing with Inngest
- Stream Video CDN for media delivery

### Database
- Foreign key constraints for data integrity
- Indexed columns for common queries
- Cascade deletes for cleanup
- Timestamp-based queries for filtering

---

## Troubleshooting

### Common Issues

#### ngrok WebSocket Failures
- **Symptom**: "SFU WS connection failed to open after 5000ms"
- **Cause**: ngrok free tier WebSocket limitations
- **Solution**: Use localhost:3000 for testing or upgrade ngrok plan

#### Device Not Found Errors
- **Symptom**: "Requested device not found" for microphone
- **Cause**: No microphone device connected or permissions denied
- **Solution**: Connect microphone or use "Continue Without Media" option

#### Auth 403 Errors
- **Symptom**: "Invalid origin" when using ngrok
- **Cause**: Better Auth origin validation
- **Solution**: Set `NEXT_PUBLIC_APP_URL` to ngrok URL

#### Transcript Parsing Errors
- **Symptom**: "Expected JSONL format but received XML/HTML"
- **Cause**: Stream Video access permissions or URL expiration
- **Solution**: Check Stream Video API credentials and URL validity

---

## Future Enhancements

### Planned Features
- Real-time transcription display during calls
- Multi-language support for AI summarization
- Advanced agent customization with memory
- Meeting analytics and insights
- Calendar integration with external providers
- Mobile applications (iOS/Android)
- Advanced video features (screen sharing, recording)

### Technical Improvements
- WebSocket fallback for ngrok limitations
- Enhanced error monitoring and logging
- Performance monitoring with APM tools
- Automated testing suite
- CI/CD pipeline optimization
- Database query optimization
- Caching strategy implementation

---

## Algorithms and AI Models Used

### Speech Processing

#### Whisper-1 (OpenAI)
- **Purpose**: Speech-to-text transcription
- **Usage**: Transcribes user audio during calls for AI processing
- **Features**: High accuracy, multiple language support, real-time transcription
- **Integration**: Configured via `input_audio_transcription.model: 'whisper-1'`

#### Server VAD (Voice Activity Detection)
- **Purpose**: Detect when user starts/stops speaking
- **Usage**: Enables natural turn-taking in conversations
- **Configuration**:
  ```typescript
  turn_detection: {
    type: 'server_vad',
    threshold: 0.5,           // Sensitivity threshold
    prefix_padding_ms: 300,   // Audio buffer before speech
    silence_duration_ms: 500, // Wait time before responding
  }
  ```
- **Algorithm**: Energy-based voice detection with silence thresholding

### Natural Language Processing

#### GPT-4o Realtime (OpenAI)
- **Purpose**: Real-time voice conversation AI
- **Usage**: Processes user speech and generates voice responses
- **Model**: `gpt-4o-realtime-preview-2024-12-17`
- **Features**: Low-latency voice processing, context awareness, natural conversation flow
- **Integration**: Stream Video OpenAI Realtime API

#### Gemini 2.5 Flash (Google)
- **Purpose**: Meeting transcript summarization
- **Usage**: Analyzes meeting transcripts and generates structured summaries
- **Features**: Fast processing, structured output, business context understanding
- **Integration**: Inngest Agent Kit for background processing

### Authentication & Security

#### Better Auth Algorithms
- **Session Management**: Secure token generation and validation
- **OAuth 2.0 Flow**: Social authentication (Google, GitHub)
- **Password Hashing**: Secure password storage (bcrypt/argon2)
- **CSRF Protection**: Cross-site request forgery prevention

### Database & Data Processing

#### Drizzle ORM Query Optimization
- **Purpose**: Type-safe database queries
- **Algorithms**: SQL query generation, connection pooling, query caching
- **Features**: Prepared statements, parameterized queries, foreign key optimization

#### PostgreSQL Query Planner
- **Purpose**: Database query optimization
- **Algorithms**: Cost-based optimization, index selection, join optimization
- **Features**: Query parallelization, materialized views, partitioning

### Video & Real-time Processing

#### WebRTC (Web Real-Time Communication)
- **Purpose**: Peer-to-peer audio/video streaming
- **Algorithms**: ICE (Interactive Connectivity Establishment), STUN/TURN protocols
- **Features**: NAT traversal, adaptive bitrate, codec negotiation

#### SFU (Selective Forwarding Unit)
- **Purpose**: Media server for video calls
- **Algorithms**: Media routing, bandwidth management, quality adaptation
- **Integration**: Stream Video infrastructure

#### Stream Video SDK Algorithms
- **Purpose**: Video call management
- **Features**: Participant synchronization, state management, event handling
- **Optimization**: Adaptive streaming, error recovery, connection pooling

### Background Processing

#### Inngest Workflow Engine
- **Purpose**: Background job orchestration
- **Algorithms**: Event-driven processing, step execution, retry logic
- **Features**: Distributed execution, state persistence, error handling

#### JSONL Parsing
- **Purpose**: Parse Stream Video transcript format
- **Algorithm**: Line-by-line JSON parsing for streaming data
- **Usage**: Meeting transcript processing pipeline

### API & Type Safety

#### tRPC Type Inference
- **Purpose**: End-to-end type safety
- **Algorithm**: TypeScript type propagation across client-server boundary
- **Features**: Automatic type generation, validation, IDE autocomplete

#### Zod Schema Validation
- **Purpose**: Runtime type validation
- **Algorithm**: Schema-based validation with detailed error messages
- **Features**: Type coercion, nested validation, custom validators

### UI/UX Algorithms

#### React Concurrent Rendering
- **Purpose**: Improved UI performance
- **Algorithm**: Time-slicing, priority-based rendering
- **Features**: Interruptible rendering, suspense boundaries, progressive loading

#### TanStack Query Caching
- **Purpose**: Server state management
- **Algorithm**: Cache invalidation, stale-while-revalidate, background refetching
- **Features**: Automatic deduplication, optimistic updates, pagination

### Calendar & Date Processing

#### date-fns Algorithms
- **Purpose**: Date manipulation and formatting
- **Algorithms**: Calendar calculations, timezone handling, date arithmetic
- **Features**: Locale support, formatting, parsing

#### react-day-picker
- **Purpose**: Calendar grid generation
- **Algorithm**: Month calculation, day positioning, event mapping
- **Features**: Navigation, selection, responsive layout

### Avatar Generation

#### DiceBear Algorithms
- **Purpose**: Generate unique avatars from text
- **Algorithm**: Deterministic hash-based avatar generation
- **Features**: Multiple styles, consistent output, seed-based generation

### Search & Filtering

#### Database Query Filtering
- **Purpose**: Search and filter agents/meetings
- **Algorithms**: 
  - ILIKE for case-insensitive text search
  - Index-based filtering for status, agentId
  - Pagination with offset/limit
- **Features**: Multi-condition filtering, sorting, result counting

### Summary of Algorithm Categories

| Category | Algorithms/Models | Purpose |
|----------|------------------|---------|
| **Speech Processing** | Whisper-1, Server VAD | Speech-to-text, voice detection |
| **NLP** | GPT-4o Realtime, Gemini 2.5 Flash | Voice AI, text summarization |
| **Authentication** | Better Auth, OAuth 2.0 | User authentication, session management |
| **Database** | Drizzle ORM, PostgreSQL Query Planner | Data storage, query optimization |
| **Video** | WebRTC, SFU, Stream Video SDK | Real-time video/audio streaming |
| **Background Jobs** | Inngest, JSONL Parsing | Async processing, transcript parsing |
| **Type Safety** | tRPC, Zod | API type safety, validation |
| **UI Performance** | React Concurrent, TanStack Query | Rendering optimization, caching |
| **Date Processing** | date-fns, react-day-picker | Calendar operations, date manipulation |
| **Avatar Generation** | DiceBear | Deterministic avatar creation |
| **Search** | ILIKE, Index-based filtering | Text search, result filtering |

## Conclusion

Mentra.ai represents a modern, full-stack application that combines cutting-edge technologies to deliver an AI-powered meeting experience. The architecture prioritizes type safety, developer experience, and scalability while maintaining a focus on user experience and performance.

The modular structure allows for easy feature additions and modifications, while the integration of modern tools like tRPC, Inngest, and Stream Video provides a robust foundation for building complex, real-time applications with AI capabilities.
