# TransparencyTracker

A full-stack web application that collects detailed product information through intelligent dynamic questioning and generates comprehensive Product Transparency Reports. Built with modern technologies and AI-powered smart logic for enhanced data collection.

## 🚀 Features

### Core Functionality

- **Multi-step Product Assessment Form**: Intuitive wizard-style form with conditional logic
- **AI-Powered Dynamic Questions**: Smart follow-up questions generated using Google's Gemini AI
- **Product Transparency Scoring**: Automated scoring system for sustainability, quality, and transparency
- **PDF Report Generation**: Professional transparency reports with visual analytics
- **Real-time Data Validation**: Intelligent product validation and scoring logic

### User Experience

- **Clean, Modern UI**: Built with Radix UI components and Tailwind CSS
- **Responsive Design**: Optimized for desktop and mobile devices
- **Dark/Light Theme Support**: User preference-based theming
- **Interactive Charts**: Visual representation of transparency scores using Recharts
- **Toast Notifications**: Real-time feedback for user actions

### Technical Features

- **Authentication System**: Secure user registration and login
- **Database Integration**: PostgreSQL with Drizzle ORM for type-safe queries
- **Session Management**: Express sessions with PostgreSQL storage
- **Real-time Updates**: WebSocket support for live data updates
- **File Upload**: Support for product images and documents

## 🛠️ Tech Stack

### Frontend

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **TanStack Query** for server state management
- **Wouter** for client-side routing
- **Framer Motion** for animations
- **Recharts** for data visualization

### Backend

- **Node.js** with Express
- **TypeScript** for type safety
- **PostgreSQL** database
- **Drizzle ORM** for database operations
- **Passport.js** for authentication
- **Express Sessions** for session management

### AI/ML Services

- **Google Gemini AI** for question generation and scoring
- **Puppeteer** for PDF generation
- **Natural Language Processing** for smart product analysis

### Development Tools

- **ESBuild** for fast bundling
- **Drizzle Kit** for database migrations
- **Cross-env** for environment variable management

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v18 or higher)
- **PostgreSQL** database
- **Google Gemini API Key** for AI functionality

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/swaransheel/TransparentPro.git
cd TransparencyTracker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/transparency_tracker

# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Session Configuration
SESSION_SECRET=your_session_secret_here

# Application Configuration
NODE_ENV=development
PORT=5000
```

### 4. Database Setup

```bash
# Push database schema
npm run db:push
```

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 📱 Application Routes

- **`/`** - Landing page with product transparency overview
- **`/assessment`** - Multi-step product assessment form
- **`/report/:productId`** - View generated transparency report

## 🤖 AI API Documentation

### Generate Questions Endpoint

**POST** `/api/products/:id/questions`

Generates dynamic follow-up questions based on product data using Gemini AI.

**Request Body:**

```json
{
  "name": "Eco-Friendly Water Bottle",
  "category": "Home & Kitchen",
  "brand": "GreenBottle Co.",
  "description": "Reusable water bottle made from recycled materials",
  "materials": "Recycled plastic, stainless steel"
}
```

**Response:**

```json
{
  "questions": [
    {
      "questionText": "What percentage of recycled materials is used in production?",
      "category": "sustainability",
      "importance": "high",
      "orderIndex": 1
    }
  ]
}
```

### Transparency Score Endpoint

**POST** `/api/products/:id/score`

Calculates transparency scores based on collected product data.

**Response:**

```json
{
  "overallScore": 8.5,
  "sustainabilityScore": 9.0,
  "qualityScore": 8.2,
  "transparencyScore": 8.3,
  "insights": ["High sustainability rating due to recycled materials"],
  "recommendations": ["Consider adding more supply chain transparency"]
}
```

## 📊 Sample Product & Generated Report

### Sample Product Input

```json
{
  "name": "Organic Cotton T-Shirt",
  "category": "Clothing",
  "brand": "EcoWear",
  "description": "100% organic cotton t-shirt with sustainable manufacturing",
  "materials": "Organic cotton",
  "manufacturingCountry": "India",
  "certifications": ["GOTS", "OEKO-TEX"],
  "weight": "200g",
  "dimensions": "L: 70cm, W: 50cm"
}
```

### AI-Generated Questions

1. "What specific organic certification standards does your cotton meet?"
2. "Can you provide details about your water usage in the manufacturing process?"
3. "What is your supply chain transparency policy for cotton sourcing?"
4. "How do you ensure fair labor practices in your manufacturing facilities?"
5. "What packaging materials do you use and are they recyclable?"

### Generated Report Highlights

- **Overall Transparency Score**: 8.7/10
- **Sustainability**: 9.2/10 (Organic materials, certified production)
- **Quality**: 8.5/10 (Standard certifications, clear specifications)
- **Supply Chain**: 8.4/10 (Some transparency gaps identified)

## 🏗️ Project Structure

```
TransparencyTracker/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility libraries
├── server/                # Express backend application
│   ├── services/          # Business logic services
│   │   ├── gemini.ts      # AI question generation
│   │   └── pdf.ts         # Report generation
│   ├── routes.ts          # API route definitions
│   └── db.ts             # Database configuration
├── shared/                # Shared TypeScript schemas
└── attached_assets/       # Project documentation
```

## 🚀 Build and Deploy

### Production Build

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Database Migration

```bash
npm run db:push
```

## 🧪 Development

### Type Checking

```bash
npm run check
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - TypeScript type checking
- `npm run db:push` - Push database schema changes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Repository**: [TransparentPro](https://github.com/swaransheel/TransparentPro)
- **Owner**: [@swaransheel](https://github.com/swaransheel)

## 📞 Support

For support or questions, please open an issue in the GitHub repository or contact the development team.

---

_Built with ❤️ for product transparency and sustainability_
