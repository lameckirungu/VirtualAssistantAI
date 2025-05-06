# Architecture Overview

## Overview

This application is a business management system with an AI-powered virtual assistant that helps with inventory management, order processing, and customer support. It features a full-stack architecture with a React frontend and Express backend, using PostgreSQL (via Neon Database serverless) for data storage and implementing NLP capabilities for chat-based interactions.

## System Architecture

The application follows a client-server architecture with clear separation of concerns:

### Frontend (Client)

- **Framework**: React with TypeScript
- **UI Components**: Uses shadcn/ui (based on Radix UI) for component library
- **Styling**: Tailwind CSS for utility-first styling
- **State Management**: React Query for server state management
- **Routing**: Wouter for lightweight client-side routing

### Backend (Server)

- **Framework**: Express.js with TypeScript
- **API Pattern**: RESTful API architecture
- **Database Access**: Drizzle ORM for type-safe database interactions
- **NLP Processing**: Custom NLP implementation with intent classification, entity extraction, and response generation

### Database

- **Type**: PostgreSQL (via Neon's serverless offering)
- **ORM**: Drizzle ORM with schema definitions
- **Schema Management**: Drizzle Kit for migrations

### Shared Code

- **Location**: `/shared` directory contains code shared between client and server
- **Schema Definitions**: Zod for runtime type validation combined with Drizzle schema

## Key Components

### Client-Side Components

1. **Layout Components**
   - `Layout.tsx`: Main layout wrapper with header and sidebar
   - `Header.tsx`: Top application bar
   - `Sidebar.tsx`: Navigation sidebar

2. **Page Components**
   - `Dashboard.tsx`: Main dashboard with chat interface and business insights
   - `Inventory.tsx`: Inventory management interface
   - `Orders.tsx`: Order management interface
   - `Analytics.tsx`: Business analytics and reporting
   - `Settings.tsx`: Application settings

3. **Feature Components**
   - `ChatInterface.tsx`: The virtual assistant chat interface
   - `BusinessInsights.tsx`: KPI display component
   - `IntentAnalytics.tsx`: Shows analytics on conversation intents
   - `RecentOrders.tsx`: Displays recent orders

4. **UI Components**
   - UI components from shadcn/ui library (buttons, cards, inputs, etc.)

### Server-Side Components

1. **API Routes**
   - RESTful endpoints for resources (inventory, orders, etc.)
   - `/api/chat` endpoint for NLP processing

2. **Services**
   - `inventory-service.ts`: Business logic for inventory management
   - `order-service.ts`: Business logic for order processing

3. **NLP Components**
   - `intent-classifier.ts`: Classifies user messages into predefined intents
   - `entity-extractor.ts`: Extracts relevant entities from user messages
   - `response-generator.ts`: Generates appropriate responses based on intent and entities

4. **Storage Abstraction**
   - `storage.ts`: Interface defining database operations
   - Database implementation using Drizzle ORM

## Data Flow

### Chat Assistant Flow

1. User sends a message through the chat interface
2. Request is sent to `/api/chat` endpoint
3. Server processes the message:
   - Intent classifier determines the user's intent
   - Entity extractor identifies relevant entities in the message
   - Response generator creates an appropriate response based on intent and entities
4. Server queries or updates database as needed (e.g., checking inventory, placing orders)
5. Response is returned to the client and displayed in the chat interface

### Inventory Management Flow

1. User interacts with inventory management UI
2. Requests for inventory data go to inventory API endpoints
3. Server retrieves/updates inventory data through the storage layer
4. Data is returned to the client and rendered in the UI

### Order Processing Flow

1. Orders can be created either through the chat interface or orders UI
2. Order requests are sent to order API endpoints
3. Server processes orders, including updating inventory levels
4. Order confirmations/updates are returned to the client

## Database Schema

The database schema consists of several key tables:

1. **Users**
   - Basic user information with authentication details
   - Role-based access control (admin vs. regular user)

2. **Products**
   - Inventory items with details like name, SKU, price, quantity
   - Includes inventory management fields like reorder points

3. **Orders**
   - Order information including status, items, customer details

4. **Conversations**
   - Stores chat conversations for context and analytics

5. **Analytics**
   - Aggregated data for business insights and reporting

## External Dependencies

### Frontend Dependencies

- **@radix-ui** components for accessible UI elements
- **@tanstack/react-query** for server state management
- **tailwindcss** for styling
- **clsx** and **class-variance-authority** for conditional class composition
- **wouter** for client-side routing
- **cmdk** for command interfaces
- **recharts** for data visualization

### Backend Dependencies

- **express** for server framework
- **drizzle-orm** for database ORM
- **@neondatabase/serverless** for serverless PostgreSQL
- **zod** for validation
- **crypto** for generating UUIDs

## Deployment Strategy

The application is configured for deployment on Replit with automatic scaling:

1. **Development Environment**
   - Vite dev server with HMR for frontend
   - Server with auto-restart for backend

2. **Build Process**
   - Vite builds the frontend static assets
   - esbuild bundles the server code

3. **Production Deployment**
   - Frontend assets are served statically
   - Backend runs as a Node.js process
   - Configuration for autoscaling via Replit

4. **Database**
   - Uses Neon's serverless PostgreSQL for production
   - Local development can use a PostgreSQL instance

## Authentication and Authorization

The application implements a basic authentication system:

1. **User Authentication**
   - Username/password authentication
   - Session management via PostgreSQL

2. **Authorization**
   - Role-based access control (admin vs. regular user)
   - Different permissions based on user roles

## Conclusion

This business management system leverages modern web technologies to create a responsive and intelligent assistant for business operations. The architecture separates concerns between frontend and backend while sharing types and schemas. The NLP capabilities enable natural language interactions for managing inventory and orders, providing a more intuitive user experience than traditional form-based interfaces.

The modular design allows for future extensions, such as adding more sophisticated NLP models, integrating with external services, or expanding the business logic to cover additional domains.