# Flight Search Engine Backend

This repository contains the backend service for a flight search engine application. It is built using NestJS and integrates with the Amadeus Self-Service API to provide real-time flight offers and location search capabilities.

## Features

- **Flight Search:** Retrieves real-time flight offers including pricing, airline information, and flight duration.
- **Location Search:** Provides autocomplete functionality for airports and cities based on IATA codes or keywords.
- **Caching:** Implements in-memory caching to optimize response times and reduce external API calls.
- **Error Handling:** Centralized exception handling and retry mechanisms for external API resilience.
- **API Documentation:** Integrated Swagger UI for API exploration and testing.

## Tech Stack

- **Framework:** NestJS (Node.js)
- **Language:** TypeScript
- **External API:** Amadeus Self-Service API (v1 & v2)
- **Caching:** cache-manager
- **Validation:** class-validator, class-transformer
- **HTTP Client:** @nestjs/axios

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
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
   Create a `.env` file in the root directory and add the following configuration:

   ```env
   PORT=3000

   # Amadeus API Configuration
   AMADEUS_API_KEY=your_api_key
   AMADEUS_API_SECRET=your_api_secret
   AMADEUS_BASE_URL=https://test.api.amadeus.com
   AMADEUS_AUTH_BASE_URL=https://test.api.amadeus.com/v1/security/oauth2/token
   AMADEUS_TIMEOUT=20000

   # Front Configuration to allow request
   FRONTEND_URL="http://localhost:3001"

   # Cache Configuration
   CACHE_TTL=300
   CACHE_MAX=100
   CACHE_TOKEN_TTL="1740"
   ```

## Running the Application

### Development

```bash
npm run start:dev
```

### Production

```bash
npm run build
npm run start:prod
```

The server will start on `http://localhost:3000` (or the port specified in `.env`).

## API Documentation

Once the application is running, you can access the Swagger documentation at:

```
http://localhost:3000/api
```

### Key Endpoints

#### 1. Search Flights

Retrieves flight offers based on origin, destination, and date.

- **Endpoint:** `GET /flights/search`
- **Parameters:**
  - `origin` (Required): 3-letter IATA code (e.g., MEX)
  - `destination` (Required): 3-letter IATA code (e.g., MAD)
  - `departureDate` (Required): YYYY-MM-DD (e.g., 2025-12-25)
  - `maxPrice` (Optional): Maximum price filter.
  - `nonStop` (Optional): Boolean to filter direct flights.

#### 2. Search Locations

Finds airports and cities matching a keyword.

- **Endpoint:** `GET /flights/locations`
- **Parameters:**
  - `keyword` (Required): Search term (min 3 characters, e.g., "Lon").

## Project Structure

```
src/
├── amadeus/           # Amadeus API integration service
├── auth/              # Authentication handling for Amadeus
├── cache/             # Caching configuration
├── common/            # Global filters and utilities
├── config/            # Environment configuration
├── flights/           # Flight search logic and controllers
│   ├── dto/           # Data Transfer Objects
│   ├── interfaces/    # TypeScript interfaces
│   ├── flights.controller.ts
│   └── flights.service.ts
└── main.ts            # Application entry point
```

## License

This project is private and intended for evaluation purposes.
