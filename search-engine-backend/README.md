# Flight Search Engine Backend

This repository contains the backend service for a flight search engine tech challenge. It is built using NestJS and integrates with the Amadeus Self-Service API to provide real-time flight offers, location search capabilities, and search history tracking.

## Features

- **Flight Search:** Retrieves real-time flight offers including pricing, airline information, and flight duration.
- **Location Search:** Provides autocomplete functionality for airports and cities based on IATA codes or keywords.
- **Search History:** Persists user search queries using a SQLite database.
- **Caching:** Implements in-memory caching to optimize response times and reduce external API calls.
- **Rate Limiting:** Protects the API from abuse with global request throttling.
- **Health Checks:** Provides system health status monitoring.
- **Docker Support:** Fully containerized application for easy deployment.
- **Error Handling:** Centralized exception handling and retry mechanisms for external API resilience.
- **API Documentation:** Integrated Swagger UI for API exploration and testing.

## Tech Stack

- **Framework:** NestJS (Node.js)
- **Language:** TypeScript
- **Database:** SQLite with TypeORM
- **External API:** Amadeus Self-Service API (v1 & v2)
- **Containerization:** Docker & Docker Compose
- **Caching:** cache-manager
- **Validation:** class-validator, class-transformer
- **HTTP Client:** @nestjs/axios

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Docker & Docker Compose (Optional, for containerized execution)
- Amadeus API Credentials (API Key and API Secret)

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd search-engine-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the root directory (you can use `.env.example` as a reference):

   ```env
   PORT=3000

   # Amadeus API Configuration
   AMADEUS_API_KEY=your_api_key
   AMADEUS_API_SECRET=your_api_secret
   AMADEUS_BASE_URL=https://test.api.amadeus.com
   AMADEUS_AUTH_BASE_URL=https://test.api.amadeus.com/v1/security/oauth2/token
   AMADEUS_TIMEOUT=20000

   # Frontend Configuration
   FRONTEND_URL="http://localhost:3001"

   # Cache Configuration
   CACHE_TTL=1800
   CACHE_MAX=100
   CACHE_TOKEN_TTL=1740

   # Database Configuration (Optional)
   DB_PATH=search-engine.sqlite
   ```

## Running the Application

### Using Docker (Recommended)

The easiest way to run the application is using Docker Compose. This will set up the API and handle the database persistence automatically.

1. Ensure your `.env` file is configured.
2. Run the following command:

   ```bash
   docker-compose up --build
   ```

The application will be available at `http://localhost:3000`.

### Manual Execution

#### Development

```bash
npm run start:dev
```

#### Production

```bash
npm run build
npm run start:prod
```

## API Documentation

Once the application is running, you can access the Swagger documentation at:

```
http://localhost:3000/api
```

### Key Endpoints

#### 1. Search Flights
Retrieves flight offers based on origin, destination, and date.
- **Endpoint:** `GET /flights/search`
- **Parameters:** `origin`, `destination`, `departureDate`, `returnDate` (optional), `adults` (optional).

#### 2. Location Search
Finds airports and cities matching a keyword.
- **Endpoint:** `GET /flights/locations`
- **Parameters:** `keyword` (e.g., "Lon").

#### 3. Search History
Retrieves the history of performed searches.
- **Endpoint:** `GET /flights/history`

#### 4. Health Check
Checks the status of the application.
- **Endpoint:** `GET /health`

## Project Structure

```
src/
├── amadeus/       # Integration with Amadeus API
├── auth/          # Authentication logic (if applicable)
├── cache/         # Caching configuration
├── common/        # Shared filters, guards, and interceptors
├── config/        # Environment configuration
├── flights/       # Flight search logic, controllers, and DTOs
│   ├── dto/       # Data Transfer Objects
│   ├── entities/  # Database entities (SearchHistory)
│   └── interfaces/# TypeScript interfaces
├── health/        # Health check module
├── app.module.ts  # Root module
└── main.ts        # Application entry point
```
