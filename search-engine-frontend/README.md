# Flight Search Engine Frontend

This repository contains the frontend application for a flight search engine tech challenge. It is built using Next.js 16 and React 19, providing a modern, responsive interface for searching flights, viewing flight offers, and managing search history.

## Features

- **Flight Search Interface:** User-friendly form with autocomplete location search and date selection.
- **Real-time Location Autocomplete:** Debounced search with IATA codes and detailed location information.
- **Flight Results Display:** Comprehensive flight cards showing airline, times, duration, pricing, and availability.
- **Search History:** View and replay previous searches with detailed search records.
- **Responsive Design:** Mobile-first approach with optimized layouts for all screen sizes.
- **Loading States:** Skeleton screens and spinners for smooth user experience.
- **Error Handling:** Graceful error messages and fallback UI states.
- **Type Safety:** Full TypeScript implementation with strict type checking.
- **Docker Support:** Production-ready containerized deployment with multi-stage builds.
- **Modern Styling:** Tailwind CSS 4 with custom design system.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **UI Library:** React 19
- **Styling:** Tailwind CSS 4 with PostCSS
- **Icons:** Lucide React (556+ icons)
- **Date Utilities:** date-fns
- **HTTP Client:** Native Fetch API
- **Containerization:** Docker (multi-stage build)
- **Utilities:** clsx, tailwind-merge

## Prerequisites

- Node.js (v20 or higher)
- npm (v10 or higher)
- Docker (Optional, for containerized execution)
- Backend API running (see search-engine-backend repository)

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd search-engine-frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the root directory:

   ```env
   BACKEND_URL=http://localhost:3000
   ```

## Running the Application

### Using Docker Compose (Recommended)

The easiest way to run the application is using Docker Compose.

1. Create a `.env` file with the backend URL (or use default):
   ```bash
   echo "BACKEND_URL=http://localhost:3000" > .env
   ```

2. Run with Docker Compose:
   ```bash
   docker-compose up --build
   ```

The application will be available at `http://localhost:3001`.

**Note:** Ensure the backend is running on the specified `BACKEND_URL` before starting the frontend.

### Using Docker

For manual Docker execution:

```bash
docker build -t flight-search-frontend .
docker run -p 3001:3001 -e BACKEND_URL=http://localhost:3000 flight-search-frontend
```

### Manual Execution

#### Development

```bash
npm run dev
```

The application will start on `http://localhost:3001`.

#### Production

```bash
npm run build
npm run start
```

## Application Structure

```
app/
├── api/                      # API route handlers
│   └── flights/
│       ├── search/          # Flight search endpoint
│       ├── locations/       # Location autocomplete endpoint
│       └── history/         # Search history endpoint
├── components/              # Reusable React components
│   ├── FlightCard.tsx      # Individual flight offer display
│   ├── Header.tsx          # Navigation header
│   ├── LocationInput.tsx   # Autocomplete location input
│   └── SearchForm.tsx      # Main search form
├── hooks/                   # Custom React hooks
│   ├── useHistory.ts       # Search history management
│   ├── useLocations.ts     # Location search logic
│   ├── useSearch.ts        # Flight search state
│   └── useSearchForm.ts    # Search form state
├── lib/                     # Utilities and types
│   ├── type.ts             # TypeScript interfaces
│   └── utils.ts            # Helper functions
├── history/                 # History page route
│   └── page.tsx
├── globals.css             # Global styles and theme
├── layout.tsx              # Root layout
└── page.tsx                # Home page (search)
```

## Key Pages and Routes

### User-Facing Pages

#### Home Page (`/`)
The main search interface where users can:
- Search for flights by origin, destination, and date
- View flight results with detailed information
- Swap origin and destination locations
- See loading states during search

#### History Page (`/history`)
View previous search history with:
- Origin, destination, and date information
- Number of results found
- Timestamp of when search was performed
- Quick replay option to re-run searches

### API Routes

#### POST `/api/flights/search`
Proxies flight search requests to the backend.
- **Body:** `{ origin, destination, departureDate }`
- **Returns:** Array of flight offers

#### POST `/api/flights/locations`
Proxies location autocomplete requests to the backend.
- **Body:** `{ keyword }`
- **Returns:** Array of matching locations

#### GET `/api/flights/history`
Retrieves search history from the backend.
- **Returns:** Array of search history records

## Components

### SearchForm
Main search interface with location inputs, date picker, and submit button.
- Validates all required fields before enabling search
- Swap button to exchange origin and destination
- Loading state during search
- Responsive layout (stacks on mobile)

### LocationInput
Autocomplete input for airport and city selection.
- Minimum 4 characters required for search
- Debounced API calls (600ms)
- Displays IATA codes and detailed location names
- Distinguishes airports from other location types
- Click-outside detection to close dropdown

### FlightCard
Displays individual flight offers with:
- Airline name and flight number
- Departure and arrival times and locations
- Flight duration with visual indicator
- Price with currency formatting
- Available seats information
- Baggage allowance
- Selection button

### Header
Navigation header with:
- Brand logo and title
- Navigation links with active state
- Responsive design (hidden on mobile)

## Custom Hooks

### useSearch
Manages flight search state and API integration.
- **State:** offers, loading, searched, error
- **Methods:** handleSearch

### useSearchForm
Handles search form state and interactions.
- **State:** origin, destination, date
- **Methods:** handleSearch, handleSwap

### useLocations
Manages location autocomplete functionality.
- **State:** query, suggestions, isOpen, isLoading
- **Methods:** handleInputChange, handleSelect
- **Features:** Debouncing, click-outside detection

### useHistory
Fetches and manages search history.
- **State:** history, loading, error
- **Methods:** fetchHistory, refetch

## Utility Functions

- **`cn()`**: Combines and merges Tailwind CSS classes safely
- **`formatDuration()`**: Converts ISO 8601 duration to readable format (e.g., "2h 30m")
- **`formatTime()`**: Formats date strings to HH:mm format
- **`formatCurrency()`**: Formats numbers as currency using Intl API
- **`debounce()`**: Debounces function calls to reduce API requests

## Styling

The application uses Tailwind CSS 4 with a custom design system:

### Brand Colors
- **Navy:** `#202541` (primary text, backgrounds)
- **Teal:** `#4CD9CF` (accents)
- **Blue:** `#2A3478` (gradients)
- **Primary:** `#4C5FD9` (interactive elements)

### Typography
- **Primary Font:** Geist Sans
- **Monospace Font:** Geist Mono
- **Responsive Sizes:** Mobile-first with `md:` and `lg:` breakpoints

### Design Patterns
- Rounded corners on cards and inputs
- Subtle shadows and hover effects
- Gradient backgrounds on hero sections
- Consistent spacing using Tailwind scale

## Docker Configuration

The application uses a multi-stage Docker build for optimal production performance:

1. **Dependencies Stage:** Installs npm packages
2. **Builder Stage:** Builds the Next.js application
3. **Runner Stage:** Minimal production image

Key features:
- Alpine Linux base for small image size
- Non-root user for security
- Standalone output mode for optimized builds
- Runs on port 3001

## Environment Variables

- **BACKEND_URL:** URL of the backend API (default: `http://localhost:3000`)
- **NODE_ENV:** Environment mode (automatically set to `production` in Docker)
- **NEXT_TELEMETRY_DISABLED:** Disables Next.js telemetry in production

## Performance Optimizations

- **Code Splitting:** Automatic via Next.js App Router
- **Image Optimization:** Next.js built-in image handling
- **Font Optimization:** Self-hosted Geist fonts
- **Debounced Search:** Reduces API calls for location autocomplete
- **Standalone Build:** Minimal production bundle size
- **Static Asset Caching:** Public files served with cache headers

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ JavaScript features
- CSS Grid and Flexbox
- Fetch API

## Development

### Scripts

- **`npm run dev`**: Start development server on port 3001
- **`npm run build`**: Build production bundle
- **`npm run start`**: Start production server
- **`npm run lint`**: Run ESLint

### Code Style

- TypeScript strict mode enabled
- ESLint with Next.js recommended rules
- Component-based architecture
- Custom hooks for reusable logic
- Type-safe API integration

## Integration with Backend

The frontend communicates with the backend API through Next.js API routes that act as proxies. This approach provides:

- **CORS Handling:** Simplified cross-origin requests
- **Security:** Backend URL not exposed to client
- **Flexibility:** Easy to add middleware or caching
- **Type Safety:** Shared TypeScript interfaces

Ensure the backend is running before starting the frontend. Default backend URL is `http://localhost:3000`.

## Deployment

### Using Dokploy

1. Ensure your repository is connected to Dokploy
2. Set the `BACKEND_URL` environment variable in Dokploy
3. Dokploy will automatically build using the included Dockerfile
4. The application will be deployed and accessible on the configured domain

### Manual Deployment

1. Build the Docker image:
   ```bash
   docker build -t flight-search-frontend .
   ```

2. Run the container:
   ```bash
   docker run -p 3001:3001 -e BACKEND_URL=your-backend-url flight-search-frontend
   ```

## Future Enhancements

- User authentication and personalization
- Advanced search filters (class, stops, airlines)
- Flight booking functionality
- Multi-city and round-trip search
- Price alerts and tracking
- Saved searches and favorites
- Dark mode support
- Internationalization (i18n)
- Progressive Web App (PWA) capabilities
- Analytics integration

## License

This project is part of a technical challenge and is for demonstration purposes.
