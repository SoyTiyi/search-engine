# Flight Search Engine

A full-stack flight search application that integrates with the Amadeus Self-Service API to provide real-time flight offers, location search, and search history tracking. The project consists of a NestJS backend and a Next.js frontend, both containerized and ready for deployment.

## Architecture Overview

This monorepo contains two main components:

- **Backend (NestJS):** RESTful API that integrates with Amadeus API, handles caching, rate limiting, and persists search history.
- **Frontend (Next.js):** Modern, responsive web application with real-time search, autocomplete, and history management.

```
search-engine/
├── docker-compose.yml        # Full stack deployment
├── README.md                 # This file
├── search-engine-backend/    # NestJS API service
│   ├── src/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── README.md
└── search-engine-frontend/   # Next.js web application
    ├── app/
    ├── Dockerfile
    ├── docker-compose.yml
    └── README.md
```

## Features

### Backend
- Real-time flight search via Amadeus API
- Airport and city location autocomplete
- SQLite database for search history persistence
- In-memory caching for optimal performance
- Rate limiting and error handling
- Swagger API documentation
- Health check endpoints

### Frontend
- Intuitive flight search interface
- Debounced location autocomplete with IATA codes
- Responsive design (mobile-first)
- Flight results with detailed information
- Search history with replay functionality
- Loading states and error handling
- TypeScript type safety throughout

## Tech Stack

### Backend
- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** SQLite with TypeORM
- **External API:** Amadeus Self-Service API
- **Caching:** cache-manager
- **Container:** Docker & Docker Compose

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **UI Library:** React 19
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide React
- **Container:** Docker (multi-stage build)

## Prerequisites

- Node.js v20 or higher
- npm v10 or higher
- Docker & Docker Compose (recommended)
- Amadeus API credentials (API Key and Secret)

## Quick Start

### Option 1: Using Docker Compose (Recommended)

This is the easiest way to run both applications together from the root directory.

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd search-engine
   ```

2. Create a `.env` file in the root directory with your Amadeus API credentials:
   ```bash
   cat > .env << EOF
   AMADEUS_API_KEY=your_api_key_here
   AMADEUS_API_SECRET=your_api_secret_here
   EOF
   ```

3. Run both services from the root directory:
   ```bash
   docker-compose up --build
   ```

   This will start both the backend and frontend services with proper networking configured.

4. Access the applications:
   - **Frontend:** http://localhost:3001
   - **Backend API:** http://localhost:3000
   - **API Documentation:** http://localhost:3000/api

### Option 1B: Run Services Individually with Docker Compose

You can also run each service independently:

**Backend only:**
```bash
cd search-engine-backend
docker-compose up --build
```

**Frontend only** (requires backend running):
```bash
cd search-engine-frontend
docker-compose up --build
```

### Option 2: Manual Setup

#### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd search-engine-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your Amadeus credentials
   ```

4. Run the backend:
   ```bash
   # Development
   npm run start:dev

   # Production
   npm run build
   npm run start:prod
   ```

The backend will be available at http://localhost:3000.

#### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd search-engine-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   echo "BACKEND_URL=http://localhost:3000" > .env
   ```

4. Run the frontend:
   ```bash
   # Development
   npm run dev

   # Production
   npm run build
   npm run start
   ```

The frontend will be available at http://localhost:3001.

## API Endpoints

### Backend API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/flights/search` | Search flights by origin, destination, and date |
| GET | `/flights/locations` | Search airports and cities by keyword |
| GET | `/flights/history` | Retrieve search history |
| GET | `/health` | Health check endpoint |
| GET | `/api` | Swagger API documentation |

### Frontend API Routes

The frontend includes Next.js API routes that proxy requests to the backend:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/flights/search` | Proxy for flight search |
| POST | `/api/flights/locations` | Proxy for location search |
| GET | `/api/flights/history` | Proxy for search history |

## Environment Variables

### Backend (.env)

```env
# Server Configuration
PORT=3000

# Amadeus API Configuration (Required)
AMADEUS_API_KEY=your_api_key
AMADEUS_API_SECRET=your_api_secret
AMADEUS_BASE_URL=https://test.api.amadeus.com
AMADEUS_AUTH_BASE_URL=https://test.api.amadeus.com/v1/security/oauth2/token
AMADEUS_TIMEOUT=20000

# Frontend CORS Configuration
FRONTEND_URL=http://localhost:3001

# Cache Configuration
CACHE_TTL=1800
CACHE_MAX=100
CACHE_TOKEN_TTL=1740

# Database Configuration
DB_PATH=search-engine.sqlite
```

### Frontend (.env)

```env
# Backend API URL
BACKEND_URL=http://localhost:3000
```

## Deployment

### Using Docker

Both applications include production-ready Dockerfiles:

#### Backend Deployment
```bash
cd search-engine-backend
docker build -t flight-search-backend .
docker run -p 3000:3000 --env-file .env flight-search-backend
```

#### Frontend Deployment
```bash
cd search-engine-frontend
docker build -t flight-search-frontend .
docker run -p 3001:3001 -e BACKEND_URL=http://backend:3000 flight-search-frontend
```

### Using Docker Compose

#### Full Stack Deployment (Both Services)

Deploy both backend and frontend together from the root directory:

```bash
cd search-engine
docker-compose up -d
```

This will:
- Start the backend on port 3000
- Start the frontend on port 3001
- Configure networking between services
- Set up health checks
- Persist database data in a volume

#### Individual Service Deployment

**Backend only:**
```bash
cd search-engine-backend
docker-compose up -d
```

**Frontend only:**
```bash
cd search-engine-frontend
docker-compose up -d
```

### Using Dokploy

Both applications are ready for Dokploy deployment:

1. **Backend Deployment:**
   - Connect the repository to Dokploy
   - Set project path to `search-engine-backend`
   - Configure environment variables (Amadeus credentials)
   - Dokploy will detect and use the Dockerfile

2. **Frontend Deployment:**
   - Connect the repository to Dokploy
   - Set project path to `search-engine-frontend`
   - Configure `BACKEND_URL` environment variable
   - Dokploy will detect and use the Dockerfile

## Project Structure

### Backend Structure
```
search-engine-backend/
├── src/
│   ├── amadeus/          # Amadeus API integration
│   ├── cache/            # Caching configuration
│   ├── common/           # Shared filters and interceptors
│   ├── config/           # Environment configuration
│   ├── flights/          # Flight search logic and DTOs
│   ├── health/           # Health check module
│   ├── app.module.ts
│   └── main.ts
├── Dockerfile
├── docker-compose.yml
└── README.md
```

### Frontend Structure
```
search-engine-frontend/
├── app/
│   ├── api/              # API route handlers
│   ├── components/       # React components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities and types
│   ├── history/          # History page
│   ├── layout.tsx
│   └── page.tsx
├── Dockerfile
└── README.md
```

## Testing the Application

1. Start both services using Docker Compose or manually
2. Open the frontend at http://localhost:3001
3. Search for a flight:
   - Origin: Type "LON" and select "London Heathrow Airport (LHR)"
   - Destination: Type "MAD" and select "Madrid Barajas Airport (MAD)"
   - Date: Select a future date
   - Click "Search Flights"
4. View flight results with prices and details
5. Navigate to History page to see your search
6. Access API documentation at http://localhost:3000/api

## Development

### Backend Development
```bash
cd search-engine-backend
npm run start:dev        # Start with hot reload
npm run test             # Run tests
npm run lint             # Run linter
```

### Frontend Development
```bash
cd search-engine-frontend
npm run dev              # Start development server
npm run build            # Build for production
npm run lint             # Run linter
```

## API Documentation

The backend includes Swagger documentation available at:
```
http://localhost:3000/api
```

This provides an interactive interface to explore and test all API endpoints.

## Performance Optimizations

### Backend
- Token caching to reduce Amadeus API calls
- In-memory result caching (30 minutes TTL)
- Request rate limiting
- Connection pooling
- Retry logic for failed requests

### Frontend
- Next.js standalone output for minimal bundle size
- Debounced location search (600ms)
- Code splitting and lazy loading
- Optimized fonts and images
- Static asset caching

## Error Handling

Both applications implement comprehensive error handling:

- **Backend:** Centralized exception filters, API error mapping, retry mechanisms
- **Frontend:** User-friendly error messages, loading states, fallback UI

## Future Enhancements

- User authentication and personalization
- Advanced search filters (class, stops, airlines)
- Round-trip and multi-city search
- Flight booking functionality
- Price tracking and alerts
- Email notifications
- Mobile applications (React Native)
- Internationalization (i18n)
- Analytics and monitoring
- CI/CD pipeline integration

## Troubleshooting

### Backend Issues

**Issue:** "Unauthorized" error when searching flights
- **Solution:** Verify your Amadeus API credentials in `.env`

**Issue:** "Cannot connect to database"
- **Solution:** Ensure write permissions in the project directory for SQLite

**Issue:** Rate limiting errors
- **Solution:** Implement exponential backoff or upgrade Amadeus API plan

### Frontend Issues

**Issue:** "Cannot connect to backend"
- **Solution:** Verify `BACKEND_URL` is correctly set and backend is running

**Issue:** Location search not working
- **Solution:** Type at least 4 characters to trigger search

**Issue:** Build fails in Docker
- **Solution:** Ensure `output: 'standalone'` is set in `next.config.ts`

## Security Considerations

- API keys stored in environment variables (never committed)
- Rate limiting enabled on backend
- CORS configured for frontend origin only
- Non-root Docker users for production
- Input validation on all endpoints
- SQL injection prevention via TypeORM

## Contributing

This project is part of a technical challenge. For questions or improvements:

1. Review the individual README files in each project directory
2. Check API documentation at `/api` endpoint
3. Review code comments and TypeScript types

## License

This project is for demonstration purposes as part of a technical challenge.

## Additional Resources

- **Backend Documentation:** [search-engine-backend/README.md](search-engine-backend/README.md)
- **Frontend Documentation:** [search-engine-frontend/README.md](search-engine-frontend/README.md)
- **Amadeus API Docs:** https://developers.amadeus.com
- **NestJS Documentation:** https://docs.nestjs.com
- **Next.js Documentation:** https://nextjs.org/docs
