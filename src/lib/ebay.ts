import axios from "axios";
import { prisma } from "@/lib/prisma";
import { EbayApiErrorResponse, EbayItemResponse } from "@/types/interfaces";

const ebayApi = axios.create({
  baseURL: "https://api.ebay.com/buy/browse/v1",
  headers: {
    "X-EBAY-C-MARKETPLACE-ID": "EBAY_US",
    Accept: "application/json",
  },
});

const MAX_RETRIES = 3;
const BASE_DELAY = 1000;
const CLIENT_ID = process.env.EBAY_CLIENT_ID!;
const CLIENT_SECRET = process.env.EBAY_CLIENT_SECRET!;
const REDIRECT_URI = process.env.EBAY_REDIRECT_URI!;

let cachedToken: string | null = null;
let tokenExpiration: number | null = null;

async function refreshAccessToken(refreshToken: string): Promise<string> {
  try {
    const response = await axios.post(
      "https://api.ebay.com/identity/v1/oauth2/token",
      `grant_type=refresh_token&refresh_token=${encodeURIComponent(refreshToken)}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
        },
      },
    );
    cachedToken = response.data.access_token;
    tokenExpiration = Date.now() + response.data.expires_in * 1000;
    return cachedToken!;
  } catch (error) {
    console.error("Failed to refresh OAuth token:", error);
    throw new Error("Token refresh failed");
  }
}

async function getOAuthToken(): Promise<string> {
  if (cachedToken && tokenExpiration && Date.now() < tokenExpiration - 60000) {
    return cachedToken;
  }

  const tokenRecord = await prisma.userToken.findFirst({
    orderBy: { created_at: "desc" },
  });

  if (!tokenRecord) {
    throw new Error("No refresh token found. Please authenticate with eBay.");
  }

  return await refreshAccessToken(tokenRecord.refresh_token);
}

export async function exchangeCodeForTokens(code: string): Promise<void> {
  try {
    const response = await axios.post(
      "https://api.ebay.com/identity/v1/oauth2/token",
      `grant_type=authorization_code&code=${encodeURIComponent(code)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
        },
      },
    );

    const {
      access_token,
      refresh_token,
      expires_in,
      refresh_token_expires_in,
    } = response.data;
    cachedToken = access_token;
    tokenExpiration = Date.now() + expires_in * 1000;

    await prisma.userToken.create({
      data: {
        refresh_token,
        expires_at: new Date(Date.now() + refresh_token_expires_in * 1000),
      },
    });
  } catch (error) {
    console.error("Failed to exchange code for tokens:", error);
    throw new Error("Failed to obtain OAuth tokens");
  }
}

export async function fetchEbayItemData(itemId: string): Promise<{
  success: boolean;
  data?: {
    price: number;
    minimum_best_offer?: number;
    image_url: string;
    title: string;
    store_name?: string;
  };
  logError?: string;
  error?: string;
}> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const token = await getOAuthToken();
      const response = await ebayApi.get<EbayItemResponse>(
        `/item/v1|${itemId}|0`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 5000,
        },
      );

      const item = response.data;
      return {
        success: true,
        data: {
          price: parseFloat(item.price.value),
          minimum_best_offer: item.buyingOptions.includes("BEST_OFFER")
            ? parseFloat(item.price.value) * 0.8
            : undefined,
          image_url: item.image.imageUrl,
          title: item.title,
          store_name: item.seller.store_name || item.seller.username,
        },
      };
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? (error.response?.data as EbayApiErrorResponse)?.errors?.[0]
            ?.message || error.message
        : "Unknown error";
      if (attempt === MAX_RETRIES) {
        return {
          success: false,
          logError: `Failed to fetch eBay item ${itemId} after ${MAX_RETRIES} attempts: ${errorMessage}`,
          error: errorMessage,
        };
      }
      const delay = BASE_DELAY * Math.pow(2, attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  return { success: false, error: "Unexpected retry failure" };
}
