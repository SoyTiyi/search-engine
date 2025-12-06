export interface ServerConfig {
    port: number;
}

export interface AmadeusConfig {
    apiKey: string;
    apiSecret: string;
    baseUrl: string;
    authBaseUrl: string;
    timeout: number;
}

export interface FrontendConfig {
    url: string;
}

export interface CacheConfig {
    ttl: number;
    max: number;
    tokenTtl: number;
}