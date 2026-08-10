# Mentra.ai - System Architecture Diagram

## High-Level Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        WebApp[Web Application<br/>Next.js + React + TypeScript]
        MobileApp[Mobile App<br/>Future]
    end

    subgraph "API Layer"
        NextJS[Next.js Server<br/>API Routes]
        tRPC[tRPC Router<br/>Type-Safe API]
        BetterAuth[Better Auth<br/>Authentication]
    end

    subgraph "Business Logic Layer"
        AgentsModule[Agents Module<br/>AI Agent Management]
        MeetingsModule[Meetings Module<br/>Meeting Management]
        CalendarModule[Calendar Module<br/>Scheduling]
        CallModule[Call Module<br/>Video Conferencing]
        AuthModule[Auth Module<br/>User Management]
    end

    subgraph "Background Processing"
        Inngest[Inngest<br/>Job Orchestration]
        AgentKit[Inngest Agent Kit<br/>AI Agent Framework]
        Gemini[Google Gemini AI<br/>Meeting Summarization]
    end

    subgraph "External Services"
        StreamVideo[Stream Video<br/>Video Infrastructure]
        GoogleAuth[Google OAuth]
        GitHubAuth[GitHub OAuth]
    end

    subgraph "Data Layer"
        PostgreSQL[(PostgreSQL<br/>Neon Database)]
        Drizzle[Drizzle ORM<br/>Database Access]
    end

    WebApp --> NextJS
    NextJS --> tRPC
    NextJS --> BetterAuth
    tRPC --> AgentsModule
    tRPC --> MeetingsModule
    tRPC --> CalendarModule
    CallModule --> StreamVideo
    BetterAuth --> GoogleAuth
    BetterAuth --> GitHubAuth
    AgentsModule --> Drizzle
    MeetingsModule --> Drizzle
    AuthModule --> Drizzle
    Drizzle --> PostgreSQL
    MeetingsModule --> Inngest
    Inngest --> AgentKit
    AgentKit --> Gemini
    Inngest --> Drizzle
```

## Detailed Component Architecture

```mermaid
graph TB
    subgraph "Frontend Architecture"
        subgraph "Pages"
            Landing[Landing Page]
            AuthPages[Auth Pages<br/>Sign In/Sign Up]
            Dashboard[Dashboard]
            AgentsPage[Agents Management]
            MeetingsPage[Meetings Management]
            CalendarPage[Calendar View]
            CallPage[Video Call Interface]
        end

        subgraph "Shared Components"
            UIComponents[UI Components<br/>Radix UI + Shadcn/ui]
            LayoutComponents[Layout Components<br/>Sidebar, Header]
            FormComponents[Form Components<br/>React Hook Form]
        end

        subgraph "Feature Modules"
            AgentsModuleUI[Agents Module UI]
            MeetingsModuleUI[Meetings Module UI]
            CalendarModuleUI[Calendar Module UI]
            CallModuleUI[Call Module UI]
            AuthModuleUI[Auth Module UI]
        end

        subgraph "State Management"
            ReactQuery[React Query<br/>Server State]
            LocalState[React State<br/>Component State]
        end

        subgraph "Client Libraries"
            tRPCClient[tRPC Client]
            AuthClient[Better Auth Client]
            StreamClient[Stream Video Client]
        end
    end

    Landing --> UIComponents
    AuthPages --> AuthModuleUI
    Dashboard --> LayoutComponents
    AgentsPage --> AgentsModuleUI
    MeetingsPage --> MeetingsModuleUI
    CalendarPage --> CalendarModuleUI
    CallPage --> CallModuleUI
    AgentsModuleUI --> tRPCClient
    MeetingsModuleUI --> tRPCClient
    CalendarModuleUI --> tRPCClient
    CallModuleUI --> StreamClient
    AuthModuleUI --> AuthClient
    tRPCClient --> ReactQuery
    AuthClient --> LocalState
```

## Backend API Architecture

```mermaid
graph TB
    subgraph "API Routes"
        AuthAPI[/api/auth/[...all]<br/>Better Auth Endpoints]
        tRPCAPI[/api/trpc/[trpc]<br/>tRPC Handler]
        InngestAPI[/api/inngest<br/>Inngest Webhook]
        WebhookAPI[/api/webhook<br/>Stream Webhooks]
    end

    subgraph "tRPC Routers"
        AgentsRouter[Agents Router<br/>CRUD Operations]
        MeetingsRouter[Meetings Router<br/>CRUD + Token Generation]
    end

    subgraph "Server Procedures"
        AgentsProcedures[Agents Procedures<br/>Create, Read, Update, Delete]
        MeetingsProcedures[Meetings Procedures<br/>Create, Read, Update, Delete<br/>Token Generation, Calendar Events]
    end

    subgraph "Business Logic"
        AgentEnhancement[AI Instructions Enhancement<br/>Gemini Integration]
        MeetingToken[Stream Token Generation<br/>User Upsert]
        CalendarQuery[Calendar Event Queries<br/>Date Filtering]
    end

    AuthAPI --> BetterAuth
    tRPCAPI --> tRPCRouter
    InngestAPI --> Inngest
    WebhookAPI --> StreamVideo
    tRPCRouter --> AgentsRouter
    tRPCRouter --> MeetingsRouter
    AgentsRouter --> AgentsProcedures
    MeetingsRouter --> MeetingsProcedures
    AgentsProcedures --> AgentEnhancement
    MeetingsProcedures --> MeetingToken
    MeetingsProcedures --> CalendarQuery
```

## Database Schema Architecture

```mermaid
erDiagram
    USER ||--o{ SESSION : has
    USER ||--o{ ACCOUNT : has
    USER ||--o{ VERIFICATION : has
    USER ||--o{ AGENTS : creates
    USER ||--o{ MEETINGS : schedules
    
    AGENTS ||--o{ MEETINGS : participates
    
    USER {
        text id PK
        text name
        text email UK
        boolean emailVerified
        text image
        timestamp createdAt
        timestamp updatedAt
    }
    
    SESSION {
        text id PK
        timestamp expiresAt
        text token UK
        timestamp createdAt
        timestamp updatedAt
        text ipAddress
        text userAgent
        text userId FK
    }
    
    ACCOUNT {
        text id PK
        text accountId
        text providerId
        text userId FK
        text accessToken
        text refreshToken
        text idToken
        timestamp accessTokenExpiresAt
        timestamp refreshTokenExpiresAt
        text scope
        text password
        timestamp createdAt
        timestamp updatedAt
    }
    
    VERIFICATION {
        text id PK
        text identifier
        text value
        timestamp expiresAt
        timestamp createdAt
        timestamp updatedAt
    }
    
    AGENTS {
        text id PK
        text name
        text userId FK
        text instructions
        timestamp createdAt
        timestamp updatedAt
    }
    
    MEETINGS {
        text id PK
        text name
        text userId FK
        text agentId FK
        enum status
        text instructions
        timestamp startedAt
        timestamp endedAt
        text transcriptUrl
        text recordingUrl
        text summary
        timestamp scheduledStartTime
        timestamp createdAt
        timestamp updatedAt
    }
```

## Authentication Flow Architecture

```mermaid
sequenceDiagram
    participant User as User
    participant Frontend as Frontend<br/>Next.js
    participant AuthAPI as Better Auth API
    participant DB as PostgreSQL
    participant Google as Google OAuth
    participant GitHub as GitHub OAuth

    User->>Frontend: Sign In Request
    Frontend->>AuthAPI: POST /api/auth/sign-in
    
    alt Email/Password
        AuthAPI->>DB: Validate Credentials
        DB-->>AuthAPI: User Data
        AuthAPI-->>Frontend: Session Token
    else Google OAuth
        Frontend->>Google: OAuth Redirect
        Google-->>Frontend: Authorization Code
        Frontend->>AuthAPI: Exchange Code
        AuthAPI->>Google: Get User Info
        Google-->>AuthAPI: User Profile
        AuthAPI->>DB: Create/Update User
        AuthAPI-->>Frontend: Session Token
    else GitHub OAuth
        Frontend->>GitHub: OAuth Redirect
        GitHub-->>Frontend: Authorization Code
        Frontend->>AuthAPI: Exchange Code
        AuthAPI->>GitHub: Get User Info
        GitHub-->>AuthAPI: User Profile
        AuthAPI->>DB: Create/Update User
        AuthAPI-->>Frontend: Session Token
    end
    
    Frontend->>Frontend: Store Session
    Frontend->>User: Redirect to Dashboard
```

## Meeting Processing Flow Architecture

```mermaid
sequenceDiagram
    participant User as User
    participant CallUI as Call Interface
    participant Stream as Stream Video
    participant Webhook as Webhook Handler
    participant Inngest as Inngest
    participant Gemini as Google Gemini AI
    participant DB as PostgreSQL

    User->>CallUI: Start Meeting
    CallUI->>Stream: Initialize Call
    Stream-->>CallUI: Call Active
    
    Note over Stream: Meeting in Progress<br/>Transcription Recording
    
    Stream->>Webhook: Call Ended Webhook
    Webhook->>DB: Update Meeting Status
    Webhook->>Inngest: Trigger Processing Event
    
    Inngest->>Inngest: Fetch Transcript
    Inngest->>DB: Get Speaker Info
    DB-->>Inngest: User/Agent Data
    
    Inngest->>Gemini: Summarize Transcript
    Gemini-->>Inngest: AI Summary
    
    Inngest->>DB: Save Summary & Update Status
    DB-->>Inngest: Confirmation
    
    Inngest-->>User: Processing Complete
    User->>CallUI: View Summary
```

## AI Agent Enhancement Flow

```mermaid
sequenceDiagram
    participant User as User
    participant Frontend as Frontend
    participant tRPC as tRPC API
    participant Gemini as Google Gemini AI
    participant DB as PostgreSQL

    User->>Frontend: Create Agent with Basic Instructions
    Frontend->>tRPC: agents.create()
    
    tRPC->>Gemini: Generate Enhanced Instructions
    Note over Gemini: System Prompt:<br/>"Create comprehensive,<br/>professional instructions<br/>for AI agent"
    
    Gemini-->>tRPC: Enhanced Instructions
    tRPC->>DB: Store Agent with Enhanced Instructions
    DB-->>tRPC: Confirmation
    
    tRPC-->>Frontend: Agent Created
    Frontend-->>User: Success Message
```

## Technology Stack Matrix

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 15.3.2 | React framework with App Router |
| | React 19 | UI library with concurrent features |
| | TypeScript 5 | Type-safe development |
| | Tailwind CSS 4 | Utility-first CSS framework |
| | Radix UI | Headless UI components |
| | Shadcn/ui | Component patterns |
| **Backend** | Next.js API Routes | Server-side API endpoints |
| | tRPC 11.1.2 | Type-safe API layer |
| | Drizzle ORM 0.44.4 | Database ORM |
| **Database** | PostgreSQL (Neon) | Primary database |
| **Authentication** | Better Auth 1.2.8 | Authentication library |
| | Google OAuth | Social login |
| | GitHub OAuth | Social login |
| **Video** | Stream Video SDK 1.19.7 | Video infrastructure |
| | Stream Node SDK 0.5.1 | Server-side Stream API |
| **AI/Processing** | Inngest 3.40.2 | Background job processing |
| | Inngest Agent Kit 0.9.0 | AI agent framework |
| | Google Gemini 1.15.0 | AI model for summarization |
| **State Management** | TanStack Query 5.76.1 | Server state management |
| | React Hook Form 7.62.0 | Form state management |
| **Validation** | Zod 3.25.7 | Schema validation |

## Deployment Architecture

```mermaid
graph TB
    subgraph "Development"
        LocalDev[Local Development<br/>npm run dev]
        Ngrok[ngrok Tunnel<br/>Webhook Testing]
    end

    subgraph "Production"
        Vercel[Vercel Deployment<br/>Next.js Hosting]
        Neon[Neon Database<br/>PostgreSQL Hosting]
        InngestCloud[Inngest Cloud<br/>Background Jobs]
        StreamCloud[Stream Cloud<br/>Video Infrastructure]
    end

    LocalDev --> Ngrok
    Vercel --> Neon
    Vercel --> InngestCloud
    Vercel --> StreamCloud
```

## Security Architecture

```mermaid
graph TB
    subgraph "Security Layers"
        Authentication[Authentication<br/>Better Auth]
        Authorization[Authorization<br/>Protected Procedures]
        DataValidation[Data Validation<br/>Zod Schemas]
        EnvironmentSecurity[Environment Security<br/>Secret Management]
        APISecurity[API Security<br/>tRPC Type Safety]
    end

    subgraph "Data Protection"
        Encryption[Data Encryption<br/>HTTPS/TLS]
        SessionManagement[Session Management<br/>Secure Tokens]
        InputSanitization[Input Sanitization<br/>SQL Injection Prevention]
        CORS[CORS Configuration<br/>Cross-Origin Protection]
    end

    Authentication --> Authorization
    Authorization --> DataValidation
    DataValidation --> EnvironmentSecurity
    EnvironmentSecurity --> APISecurity
    APISecurity --> Encryption
    Encryption --> SessionManagement
    SessionManagement --> InputSanitization
    InputSanitization --> CORS
```

## Module Dependencies

```mermaid
graph LR
    subgraph "Core Modules"
        DB[(Database)]
        Auth[Auth Module]
        tRPC[tRPC Router]
    end

    subgraph "Feature Modules"
        Agents[Agents Module]
        Meetings[Meetings Module]
        Calendar[Calendar Module]
        Call[Call Module]
    end

    subgraph "External Integrations"
        Stream[Stream Video]
        Inngest[Inngest]
        Gemini[Gemini AI]
    end

    Auth --> DB
    Agents --> DB
    Meetings --> DB
    Calendar --> DB
    Agents --> tRPC
    Meetings --> tRPC
    Calendar --> tRPC
    Call --> Stream
    Meetings --> Inngest
    Inngest --> Gemini
    Agents --> Gemini
```

## Data Flow Architecture

```mermaid
graph TB
    subgraph "Input Layer"
        UserActions[User Actions]
        Webhooks[External Webhooks]
        ScheduledJobs[Scheduled Jobs]
    end

    subgraph "Processing Layer"
        APIHandlers[API Handlers]
        BusinessLogic[Business Logic]
        BackgroundJobs[Background Jobs]
        AIProcessing[AI Processing]
    end

    subgraph "Data Layer"
        Database[(Database)]
        Cache[Cache Layer]
        FileStorage[File Storage]
    end

    subgraph "Output Layer"
        Responses[API Responses]
        Notifications[Notifications]
        Updates[Data Updates]
    end

    UserActions --> APIHandlers
    Webhooks --> APIHandlers
    ScheduledJobs --> BackgroundJobs
    APIHandlers --> BusinessLogic
    BusinessLogic --> Database
    BackgroundJobs --> AIProcessing
    AIProcessing --> Database
    Database --> Cache
    BusinessLogic --> FileStorage
    Database --> Responses
    BackgroundJobs --> Notifications
    Database --> Updates
```

## Scalability Architecture

```mermaid
graph TB
    subgraph "Load Balancing"
        LB[Load Balancer]
    end

    subgraph "Application Servers"
        Server1[Next.js Server 1]
        Server2[Next.js Server 2]
        Server3[Next.js Server N]
    end

    subgraph "Background Workers"
        Worker1[Inngest Worker 1]
        Worker2[Inngest Worker 2]
    end

    subgraph "Data Layer"
        PrimaryDB[(Primary Database)]
        ReplicaDB[(Read Replica)]
        Cache[(Redis Cache)]
    end

    subgraph "CDN"
        CDN[Content Delivery Network]
    end

    LB --> Server1
    LB --> Server2
    LB --> Server3
    Server1 --> PrimaryDB
    Server2 --> PrimaryDB
    Server3 --> PrimaryDB
    Server1 --> ReplicaDB
    Server2 --> ReplicaDB
    Server3 --> ReplicaDB
    Server1 --> Cache
    Server2 --> Cache
    Server3 --> Cache
    Worker1 --> PrimaryDB
    Worker2 --> PrimaryDB
    Server1 --> CDN
    Server2 --> CDN
    Server3 --> CDN
```

## Monitoring & Observability

```mermaid
graph TB
    subgraph "Application Monitoring"
        APM[APM Monitoring]
        ErrorTracking[Error Tracking]
        Performance[Performance Metrics]
    end

    subgraph "Logging"
        ApplicationLogs[Application Logs]
        AccessLogs[Access Logs]
        ErrorLogs[Error Logs]
    end

    subgraph "Alerting"
        Alerts[Alerting System]
        Notifications[Notification Channels]
    end

    subgraph "Analytics"
        UserAnalytics[User Analytics]
        SystemAnalytics[System Analytics]
        BusinessAnalytics[Business Analytics]
    end

    APM --> ApplicationLogs
    ErrorTracking --> ErrorLogs
    Performance --> ApplicationLogs
    ApplicationLogs --> Alerts
    ErrorLogs --> Alerts
    Alerts --> Notifications
    APM --> UserAnalytics
    Performance --> SystemAnalytics
    ApplicationLogs --> BusinessAnalytics
```

## Key Design Patterns

1. **Module-Based Architecture**: Each feature (agents, meetings, calendar) is organized as a separate module with its own UI, server logic, and hooks.

2. **Type-Safe API Layer**: tRPC provides end-to-end type safety between frontend and backend, eliminating API contract mismatches.

3. **Background Job Processing**: Inngest handles async tasks like meeting processing, ensuring the main application remains responsive.

4. **AI Enhancement**: Google Gemini AI is used to enhance user instructions for AI agents, providing more sophisticated agent behavior.

5. **Real-time Communication**: Stream Video SDK provides real-time video conferencing with built-in transcription capabilities.

6. **ORM-Based Data Access**: Drizzle ORM provides type-safe database queries with schema migrations.

7. **Component Composition**: Radix UI and Shadcn/ui provide a foundation of accessible, composable UI components.

8. **Authentication Abstraction**: Better Auth provides a unified interface for multiple authentication providers (email/password, Google, GitHub).

## Future Scalability Considerations

1. **Horizontal Scaling**: Next.js can be scaled horizontally behind a load balancer
2. **Database Scaling**: Neon supports read replicas for improved read performance
3. **CDN Integration**: Static assets can be served through CDN for better performance
4. **Microservices**: Background processing can be separated into microservices
5. **Caching Layer**: Redis can be added for caching frequently accessed data
6. **Message Queue**: Additional message queues can be added for complex workflows
7. **Multi-region Deployment**: Application can be deployed across multiple regions