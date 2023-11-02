interface AzureAdConfig {
    clientId: string;
    scopes: string;
    authority: string;
    redirectUrl: string;
}

const azureAdConfig: AzureAdConfig = {
    clientId: null,
    scopes: null,
    authority: null,
    redirectUrl:null,
};

export const AzureAdConfig = azureAdConfig;
