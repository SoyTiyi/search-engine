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