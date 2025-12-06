export default () => ({
    server: {
        port: parseInt(process.env.PORT || '3000', 10),
    },
    amadeus: {
        apiKey: process.env.AMADEUS_API_KEY,
        apiSecret: process.env.AMADEUS_API_SECRET,
        baseUrl: process.env.AMADEUS_BASE_URL || 'https://test.api.amadeus.com/v1',
        authBaseUrl: process.env.AMADEUS_AUTH_BASE_URL || 'https://test.api.amadeus.com/v1/security/oauth2/token',
        timeout: parseInt(process.env.AMADEUS_TIMEOUT || '10000', 10),
    },
    frontend: {
        url: process.env.FRONTEND_URL || 'http://localhost:3001',
    },
    cache: {
        ttl: process.env.CACHE_TTL ? parseInt(process.env.CACHE_TTL, 10) : 1800,
        max: process.env.CACHE_MAX ? parseInt(process.env.CACHE_MAX, 10) : 100,
        tokenTtl: process.env.CACHE_TOKEN_TTL ? parseInt(process.env.CACHE_TOKEN_TTL, 10) : 1740,
    }
});