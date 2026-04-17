declare namespace google.accounts.oauth2 {
  interface TokenResponse {
    error?: string;
    error_description?: string;
  }
}

declare global {
  interface Window {
    google: typeof google;
  }
}

export {};