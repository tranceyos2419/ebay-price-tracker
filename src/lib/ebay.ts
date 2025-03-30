import axios from "axios";
import { prisma } from "@/lib/prisma";
import { EbayApiErrorResponse, EbayItemResponse } from "@/types/interfaces";
import { config } from "@/lib/config";

const ebayApi = axios.create({
  baseURL: config.API_BASE_URL,
  headers: {
    "X-EBAY-C-MARKETPLACE-ID": "EBAY_US",
    Accept: "application/json",
  },
});

const MAX_RETRIES = 3;
const BASE_DELAY = 1000;

let cachedToken: string | null = null;
let tokenExpiration: number | null = null;

async function refreshAccessToken(refreshToken: string): Promise<string> {
  try {
    const response = await axios.post(
      config.TOKEN_URL,
      `grant_type=refresh_token&refresh_token=${encodeURIComponent(refreshToken)}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(`${config.EBAY_CLIENT_ID}:${config.EBAY_CLIENT_SECRET}`).toString("base64")}`,
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
      config.TOKEN_URL,
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: config.EBAY_REDIRECT_URI,
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(`${config.EBAY_CLIENT_ID}:${config.EBAY_CLIENT_SECRET}`).toString("base64")}`,
        },
      },
    );

    const { access_token, refresh_token, refresh_token_expires_in } =
      response.data;
    cachedToken = access_token;

    await prisma.userToken.create({
      data: {
        refresh_token,
        expires_at: new Date(Date.now() + refresh_token_expires_in * 1000), // Use refresh_token_expires_in
      },
    });
  } catch (error) {
    console.error("Failed to exchange code for tokens: ", error);
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
          minimum_best_offer: item.minimum_best_offer,
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
