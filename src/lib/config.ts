import { Config } from "@/types/interfaces";

function loadConfig(): Config {
  const isSandbox = process.env.IS_SANDBOX === "true";

  const requiredVars = [
    isSandbox ? "SANDBOX_EBAY_CLIENT_ID" : "EBAY_CLIENT_ID",
    isSandbox ? "SANDBOX_EBAY_CLIENT_SECRET" : "EBAY_CLIENT_SECRET",
    isSandbox ? "SANDBOX_EBAY_REDIRECT_URI" : "EBAY_REDIRECT_URI",
    "IS_SANDBOX",
  ];

  for (const key of requiredVars) {
    if (!process.env[key]) {
      throw new Error(
        `${key} is not set in the environment. Please set it in your .env file.`,
      );
    }
  }

  const config: Config = {
    IS_SANDBOX: isSandbox,
    EBAY_CLIENT_ID: isSandbox
      ? process.env.SANDBOX_EBAY_CLIENT_ID!
      : process.env.EBAY_CLIENT_ID!,
    EBAY_CLIENT_SECRET: isSandbox
      ? process.env.SANDBOX_EBAY_CLIENT_SECRET!
      : process.env.EBAY_CLIENT_SECRET!,
    EBAY_REDIRECT_URI: isSandbox
      ? process.env.SANDBOX_EBAY_REDIRECT_URI!
      : process.env.EBAY_REDIRECT_URI!,
    AUTH_URL: isSandbox
      ? "https://auth.sandbox.ebay.com/oauth2/authorize"
      : "https://auth.ebay.com/oauth2/authorize",
    TOKEN_URL: isSandbox
      ? "https://api.sandbox.ebay.com/identity/v1/oauth2/token"
      : "https://api.ebay.com/identity/v1/oauth2/token",
    API_BASE_URL: isSandbox
      ? "https://api.sandbox.ebay.com/buy/browse/v1"
      : "https://api.ebay.com/buy/browse/v1",
  };

  return config;
}

export const config = loadConfig();
