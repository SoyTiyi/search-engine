export interface AmadeusToken {
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
