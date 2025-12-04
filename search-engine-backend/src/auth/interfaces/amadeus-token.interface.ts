export interface AmadeusToken {
    accessToken: string;
    expiresIn: number;
}

export interface AmadeusTokenResponse {
    type: string;
    username: string;
    applicationName: string;
    clientId: string;
    tokenType: string;
    accessToken: string;
    expiresIn: number;
    state: string;
    scope: string;
}
