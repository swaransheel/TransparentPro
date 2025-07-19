# Product Transparency Website - Replit.md

## Overview

This is a full-stack Product Transparency Website that collects detailed product information through dynamic follow-up questions, stores the data, and generates comprehensive transparency reports. The application uses AI-powered question generation to create intelligent, category-specific assessments and produces professional PDF reports with scoring metrics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack Query for server state, React Hook Form for form state
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Build Tool**: Vite with custom configuration for monorepo setup

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Style**: RESTful APIs with structured error handling
- **File Structure**: Monorepo with shared schema between client and server

### Build and Development Setup
- **Development**: Hot module replacement via Vite middleware
- **Production Build**: Separate builds for client (Vite) and server (esbuild)
- **Type Safety**: Shared TypeScript interfaces between frontend and backend
- **Path Aliases**: Configured for clean imports (@/, @shared/)

## Key Components

### Database Schema (PostgreSQL + Drizzle)
- **Users Table**: Authentication and user management
- **Products Table**: Core product information with status tracking (draft/in_progress/completed)
- **Questions Table**: AI-generated and custom questions with categorization (sustainability/quality/transparency)
- **Reports Table**: Generated transparency reports with multiple scoring dimensions

### AI Integration
- **Question Generation**: Google Gemini AI integration for dynamic, context-aware question creation
- **Scoring System**: Multi-dimensional transparency scoring (overall, sustainability, quality, transparency)
- **Content Analysis**: AI-powered insights and recommendations based on responses

### PDF Generation
- **Technology**: Puppeteer for HTML-to-PDF conversion
- **Report Structure**: Professional reports with scoring visualizations, question summaries, and recommendations
- **Styling**: CSS-based report layouts with responsive design

### Form System
- **Multi-step Wizard**: Progressive disclosure with step validation
- **Dynamic Questions**: AI-generated follow-up questions based on product category and previous responses
- **Validation**: Zod schema validation with React Hook Form integration
- **Progress Tracking**: Visual progress indicators and step navigation

### UI Components
- **Design System**: Shadcn/ui components with consistent theming
- **Accessibility**: ARIA-compliant components with keyboard navigation
- **Responsive Design**: Mobile-first approach with responsive breakpoints
- **Dark Mode**: CSS custom properties for theme switching

## Data Flow

### Product Assessment Flow
1. User creates new product with basic information
2. AI generates category-specific questions based on product data
3. User progresses through multi-step form answering questions
4. System calculates transparency scores based on completeness and quality of responses
5. PDF report generation with scoring, insights, and recommendations
6. Report preview and download functionality

### API Data Flow
- **RESTful Endpoints**: Structured CRUD operations for products, questions, and reports
- **Real-time Updates**: Form state synchronization with server
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Validation**: Server-side validation matching client-side schemas

## External Dependencies

### Core Dependencies
- **Database**: Neon Database (serverless PostgreSQL)
- **AI Service**: Google Gemini API for question generation and scoring
- **PDF Generation**: Puppeteer for report creation
- **Authentication**: Ready for session-based auth with connect-pg-simple
- **Styling**: Tailwind CSS with PostCSS processing

### Development Tools
- **Type Checking**: TypeScript with strict configuration
- **Database Migrations**: Drizzle Kit for schema management
- **Development Server**: Vite with Express middleware integration
- **Error Handling**: Runtime error overlay for development

### UI Libraries
- **Component Library**: Radix UI primitives with custom styling
- **Form Handling**: React Hook Form with Zod validation
- **Animations**: CSS transitions and Tailwind animation utilities
- **Icons**: Lucide React icon library

## Deployment Strategy

### Build Process
- **Client Build**: Vite builds optimized React bundle to `dist/public`
- **Server Build**: esbuild bundles Express server to `dist/index.js`
- **Static Assets**: Client assets served by Express in production
- **Environment**: Environment-specific configurations for database and API keys

### Database Setup
- **Schema Management**: Drizzle migrations in `migrations/` directory
- **Connection**: Neon Database with connection pooling
- **Environment Variables**: `DATABASE_URL` required for database connection

### Environment Configuration
- **Development**: Local development with Vite dev server
- **Production**: Single Node.js process serving both API and static files
- **Required Environment Variables**:
  - `DATABASE_URL`: PostgreSQL connection string
  - `GEMINI_API_KEY`: Google Gemini API access for AI features
  - `NODE_ENV`: Environment designation (development/production)

### API Endpoints Structure
- `GET/POST /api/products` - Product CRUD operations
- `GET/POST /api/products/:id/questions` - Question management
- `POST /api/products/:id/generate-questions` - AI question generation
- `GET/POST /api/products/:id/report` - Report generation and retrieval
- `GET /api/products/:id/report/pdf` - PDF download endpoint

The application is designed as a production-ready system with comprehensive error handling, type safety, and scalable architecture suitable for product transparency assessments across various industries.