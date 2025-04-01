import axios from "axios";
import { prisma } from "@/lib/prisma";
import { EbayApiErrorResponse, GetItemResponse } from "@/types/interfaces";
import { config } from "@/lib/config";
import { parseStringPromise } from "xml2js";

const tradingApi = axios.create({
  baseURL: "https://api.ebay.com/ws/api.dll",
  headers: {
    "X-EBAY-API-COMPATIBILITY-LEVEL": "1399",
    "X-EBAY-API-SITEID": "0",
    "Content-Type": "text/xml",
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

      const xmlRequest = `
        <?xml version="1.0" encoding="utf-8"?>
        <GetItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
          <RequesterCredentials>
            <eBayAuthToken>${token}</eBayAuthToken>
          </RequesterCredentials>
          <ItemID>${itemId}</ItemID>
        </GetItemRequest>
      `;

      const response = await tradingApi.post("", xmlRequest, {
        headers: {
          "X-EBAY-API-CALL-NAME": "GetItem",
          Authorization: `Bearer ${token}`,
        },
        timeout: 5000,
      });

      const parsedResponse = (await parseStringPromise(
        response.data,
      )) as GetItemResponse;

      const item = parsedResponse.GetItemResponse?.Item?.[0];
      if (!item) {
        throw new Error("Item not found or access denied");
      }

      const listingDetails = item.ListingDetails?.[0];
      const minimumBestOffer = listingDetails?.MinimumBestOfferPrice?.[0]
        ? parseFloat(listingDetails.MinimumBestOfferPrice[0]._)
        : undefined;
      const convertedBuyItNowPrice = listingDetails?.ConvertedBuyItNowPrice?.[0]
        ? parseFloat(listingDetails.ConvertedBuyItNowPrice[0]._)
        : NaN;
      const convertedStartPrice = listingDetails?.ConvertedStartPrice?.[0]
        ? parseFloat(listingDetails.ConvertedStartPrice[0]._)
        : NaN;
      const buyItNowPrice = listingDetails?.BuyItNowPrice?.[0]
        ? parseFloat(listingDetails.BuyItNowPrice[0]._)
        : NaN;
      const startPrice = item.StartPrice?.[0]
        ? parseFloat(item.StartPrice[0]._)
        : NaN;

      // Prioritize converted prices, then original prices, default to 0
      const price =
        !isNaN(convertedBuyItNowPrice) && convertedBuyItNowPrice > 0
          ? convertedBuyItNowPrice
          : !isNaN(convertedStartPrice) && convertedStartPrice > 0
            ? convertedStartPrice
            : !isNaN(buyItNowPrice) && buyItNowPrice > 0
              ? buyItNowPrice
              : !isNaN(startPrice) && startPrice > 0
                ? startPrice
                : 0;

      const title = item.Title?.[0] || "Untitled";
      const imageUrl = item.PictureDetails?.[0]?.PictureURL?.[0] || "";
      const storeName = item.Seller?.[0]?.UserID?.[0];

      return {
        success: true,
        data: {
          price,
          minimum_best_offer: minimumBestOffer,
          image_url: imageUrl,
          title,
          store_name: storeName,
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
