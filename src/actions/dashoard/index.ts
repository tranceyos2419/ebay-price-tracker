"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import {
  AddRecordData,
  TrackingPageData,
  TableRowData,
} from "@/types/interfaces";
import { fetchEbayItemData, exchangeCodeForTokens } from "@/lib/ebay";
import { redirect } from "next/navigation";
import { OAUTH_SCOPES } from "@/constants";
import { config } from "@/lib/config";

export const onLogout = async () => {
  try {
    await prisma.$transaction([prisma.userToken.deleteMany()]);
  } catch (error) {
    console.log("error while logging out: ", error);
  }
};

async function checkEbayItemIdUniqueness(
  ebay_item_id: string,
  excludeId?: string,
): Promise<boolean> {
  try {
    const [keyPage, trackingPage] = await prisma.$transaction([
      prisma.keyPage.findUnique({ where: { ebay_item_id } }),
      prisma.trackingPage.findUnique({ where: { ebay_item_id } }),
    ]);
    return (
      !(keyPage && keyPage.ebay_item_id !== excludeId) &&
      !(trackingPage && trackingPage.ebay_item_id !== excludeId)
    );
  } catch (error) {
    console.error("Error checking uniqueness:", error);
    throw error;
  }
}

function computeRowStatusAndMessage(row: TableRowData): {
  status: "SUCCESS" | "FAILED";
  message: string;
} {
  const components = [
    {
      name: "Key Page",
      status: row.keyPage.status,
      message: row.keyPage.message,
    },
    ...(row.page01
      ? [
          {
            name: "Page 01",
            status: row.page01.status,
            message: row.page01.message,
          },
        ]
      : []),
    ...(row.page02
      ? [
          {
            name: "Page 02",
            status: row.page02.status,
            message: row.page02.message,
          },
        ]
      : []),
    ...(row.page03
      ? [
          {
            name: "Page 03",
            status: row.page03.status,
            message: row.page03.message,
          },
        ]
      : []),
  ];

  const failedComponents = components.filter((c) => c.status === "FAILED");
  if (failedComponents.length > 0) {
    return {
      status: "FAILED",
      message: failedComponents
        .map((c) => `${c.name}: ${c.message}`)
        .join("\n"),
    };
  }
  return { status: "SUCCESS", message: "Successfully Updated" };
}

export const initiateOAuthFlow = async () => {
  const authUrl = `${config.AUTH_URL}?client_id=${config.EBAY_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(config.EBAY_REDIRECT_URI)}&scope=${encodeURIComponent(OAUTH_SCOPES)}&prompt=login`;
  redirect(authUrl);
};

export const handleOAuthCallback = async (code: string) => {
  try {
    await exchangeCodeForTokens(code);
  } catch (error) {
    console.error("OAuth callback error:", error);
    throw new Error("Failed to process OAuth callback");
  }
};

export const isAuthenticated = async (): Promise<boolean> => {
  const tokenRecord = await prisma.userToken.findFirst();
  return !!tokenRecord && tokenRecord.expires_at > new Date();
};

export const onFetchRecords = async (): Promise<{
  initialData: TableRowData[];
}> => {
  try {
    const keyPages = await prisma.keyPage.findMany({
      include: { TrackingPage: true },
      orderBy: { last_updated_date: "desc" },
    });

    const initialData: TableRowData[] = keyPages.map((keyPage) => {
      const trackingPages = keyPage.TrackingPage || [];
      const [page01, page02, page03] = trackingPages
        .slice(0, 3)
        .map((page) => ({
          key_page_id: page.key_page_id,
          ebay_item_id: page.ebay_item_id,
          price: page.price,
          image_url: page.image_url,
          store_name: page.store_name,
          status: page.status as "SUCCESS" | "FAILED",
          message: page.message || "",
          last_updated_date: page.last_updated_date.toLocaleString(),
        }));

      const row: TableRowData = {
        status: "SUCCESS",
        message: "Successfully Updated",
        timestamp: keyPage.last_updated_date.toLocaleString(),
        keyPage: {
          key_page_id: keyPage.key_page_id,
          ebay_item_id: keyPage.ebay_item_id,
          price: keyPage.price,
          minimum_best_offer: keyPage.minimum_best_offer,
          image_url: keyPage.image_url,
          title: keyPage.title,
          status: keyPage.status as "SUCCESS" | "FAILED",
          message: keyPage.message || undefined,
          last_updated_date: keyPage.last_updated_date.toLocaleString(),
        },
        page01,
        page02,
        page03,
      };

      const { status, message } = computeRowStatusAndMessage(row);
      row.status = status;
      row.message = message;

      return row;
    });

    return { initialData };
  } catch (error) {
    console.error("Error fetching records:", error);
    throw error;
  }
};

export const onAddRecord = async (
  data: AddRecordData,
): Promise<{
  success: boolean;
  message: string;
  newRow?: TableRowData;
}> => {
  try {
    const idsToCheck = [
      data.key_page_ebay_item_id,
      data.page_01,
      data.page_02,
      data.page_03,
    ].filter(Boolean) as string[];
    for (const id of idsToCheck) {
      if (!(await checkEbayItemIdUniqueness(id))) {
        return { success: false, message: `eBay Item ID ${id} already exists` };
      }
    }

    const keyPageEbayResult = await fetchEbayItemData(
      data.key_page_ebay_item_id,
    );

    const trackingPageResults = await Promise.all(
      [data.page_01, data.page_02, data.page_03]
        .filter(Boolean)
        .map((id) => fetchEbayItemData(id!)),
    );

    const result = await prisma.$transaction(async (tx) => {
      // Key Page
      const keyPage = await tx.keyPage.create({
        data: {
          ebay_item_id: data.key_page_ebay_item_id,
          price: keyPageEbayResult.success ? keyPageEbayResult.data!.price : 0,
          minimum_best_offer: keyPageEbayResult.success
            ? data.minimum_best_offer ||
              (keyPageEbayResult.data!.minimum_best_offer ?? 0)
            : 0,
          image_url: keyPageEbayResult.success
            ? keyPageEbayResult.data!.image_url
            : "",
          title: keyPageEbayResult.success
            ? keyPageEbayResult.data!.title
            : "Unknown",
          status: keyPageEbayResult.success ? "SUCCESS" : "FAILED",
          message: keyPageEbayResult.success
            ? "Successfully Updated"
            : keyPageEbayResult.error || "Failed to fetch key page data",
          last_updated_date: new Date(),
        },
      });

      await tx.item.create({
        data: { key_page_id: keyPage.key_page_id },
      });

      // Tracking Pages
      const trackingPagesData: Prisma.TrackingPageCreateManyInput[] = [];
      const trackingPages: TrackingPageData[] = [];

      trackingPageResults.forEach((result, index) => {
        const ebayId = [data.page_01, data.page_02, data.page_03][index];
        if (ebayId) {
          const pageData: Prisma.TrackingPageCreateManyInput = {
            ebay_item_id: ebayId,
            price: result.success ? result.data!.price : 0,
            image_url: result.success ? result.data!.image_url : "",
            store_name: result.success
              ? result.data!.store_name || `Tracking Store ${index + 1}`
              : `Tracking Store ${index + 1}`,
            status: result.success ? "SUCCESS" : "FAILED",
            message: result.success
              ? "Successfully Updated"
              : result.error || "Failed to fetch tracking page data",
            last_updated_date: new Date(),
            key_page_id: keyPage.key_page_id,
          };
          trackingPagesData.push(pageData);
          trackingPages.push({
            ...pageData,
            status: pageData.status as "SUCCESS" | "FAILED",
            last_updated_date: pageData.last_updated_date.toLocaleString(),
          });
        }
      });

      if (trackingPagesData.length > 0) {
        await tx.trackingPage.createMany({ data: trackingPagesData });
      }

      const newRow: TableRowData = {
        status: "SUCCESS", // Will be updated below
        message: "New Item Added", // Will be updated below
        timestamp: new Date().toLocaleString(),
        keyPage: {
          key_page_id: keyPage.key_page_id,
          ebay_item_id: keyPage.ebay_item_id,
          price: keyPage.price,
          minimum_best_offer: keyPage.minimum_best_offer,
          image_url: keyPage.image_url,
          title: keyPage.title,
          status: keyPage.status as "SUCCESS" | "FAILED",
          message: keyPage.message,
          last_updated_date: keyPage.last_updated_date.toLocaleString(),
        },
        page01: trackingPages[0],
        page02: trackingPages[1],
        page03: trackingPages[2],
      };

      const { status, message } = computeRowStatusAndMessage(newRow);
      newRow.status = status;
      newRow.message = message;

      return newRow;
    });

    revalidatePath("/dashboard");
    return {
      success: true,
      message: "Record added successfully",
      newRow: result,
    };
  } catch (error) {
    console.error("Error adding record:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return { success: false, message: `Failed to add record: ${errorMessage}` };
  }
};

export const onUpdateKeyPage = async (
  ebay_item_id: string,
  data: { price: number; minimum_best_offer: number; ebay_item_id: string },
): Promise<{ success: boolean; message: string }> => {
  try {
    if (
      data.ebay_item_id !== ebay_item_id &&
      !(await checkEbayItemIdUniqueness(data.ebay_item_id, ebay_item_id))
    ) {
      return {
        success: false,
        message: `eBay Item ID ${data.ebay_item_id} already exists`,
      };
    }

    const ebayResult = await fetchEbayItemData(data.ebay_item_id);
    const existingKeyPage = await prisma.keyPage.findUnique({
      where: { ebay_item_id },
    });

    if (!existingKeyPage) {
      return { success: false, message: "Key Page not found" };
    }

    const updatedData = ebayResult.success
      ? {
          ebay_item_id: data.ebay_item_id,
          price: data.price || ebayResult.data!.price,
          minimum_best_offer:
            data.minimum_best_offer ||
            (ebayResult.data!.minimum_best_offer ?? 0),
          image_url: ebayResult.data!.image_url,
          title: ebayResult.data!.title,
          status: "SUCCESS" as const,
          message: "Successfully Updated",
          last_updated_date: new Date(),
        }
      : {
          ebay_item_id: data.ebay_item_id,
          status: "FAILED" as const,
          message: ebayResult.error || "Failed to fetch key page data",
          last_updated_date: new Date(),
        };

    await prisma.keyPage.update({
      where: { ebay_item_id },
      data: updatedData,
    });

    revalidatePath("/dashboard");
    return { success: ebayResult.success, message: updatedData.message };
  } catch (error) {
    console.error("Error updating key page:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      message: `Failed to update key page: ${errorMessage}`,
    };
  }
};

export const onUpdateTrackingPage = async (
  originalEbayId: string,
  data: { ebay_item_id: string },
): Promise<{ success: boolean; message: string }> => {
  try {
    if (data.ebay_item_id !== originalEbayId) {
      if (!(await checkEbayItemIdUniqueness(data.ebay_item_id))) {
        return {
          success: false,
          message: `eBay Item ID ${data.ebay_item_id} already exists`,
        };
      }
    }

    const ebayResult = await fetchEbayItemData(data.ebay_item_id);
    const existingTrackingPage = await prisma.trackingPage.findUnique({
      where: { ebay_item_id: originalEbayId },
    });

    if (!existingTrackingPage) {
      return { success: false, message: "Tracking Page not found" };
    }

    const updatedData = ebayResult.success
      ? {
          ebay_item_id: data.ebay_item_id,
          price: ebayResult.data!.price,
          image_url: ebayResult.data!.image_url,
          store_name:
            ebayResult.data!.store_name || existingTrackingPage.store_name,
          status: "SUCCESS" as const,
          message: "Successfully Updated",
          last_updated_date: new Date(),
        }
      : {
          ebay_item_id: data.ebay_item_id,
          status: "FAILED" as const,
          message: ebayResult.error || "Failed to fetch tracking page data",
          last_updated_date: new Date(),
        };

    await prisma.trackingPage.update({
      where: { ebay_item_id: originalEbayId },
      data: updatedData,
    });

    revalidatePath("/dashboard");
    return { success: ebayResult.success, message: updatedData.message };
  } catch (error) {
    console.error("Error updating tracking page:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      message: `Failed to update tracking page: ${errorMessage}`,
    };
  }
};

export const onDeleteKeyPage = async (
  ebay_item_id: string,
): Promise<{ success: boolean; message: string }> => {
  try {
    const keyPage = await prisma.keyPage.findUnique({
      where: { ebay_item_id },
    });
    if (!keyPage) {
      return { success: false, message: "Key Page not found" };
    }

    await prisma.$transaction([
      prisma.trackingPage.deleteMany({
        where: { key_page_id: keyPage.key_page_id },
      }),
      prisma.item.deleteMany({ where: { key_page_id: keyPage.key_page_id } }),
      prisma.keyPage.delete({ where: { ebay_item_id } }),
    ]);

    revalidatePath("/dashboard");
    return { success: true, message: "Key Page and associated data deleted" };
  } catch (error) {
    console.error("Error deleting key page:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      message: `Failed to delete key page: ${errorMessage}`,
    };
  }
};

export const onDeleteTrackingPage = async (
  ebay_item_id: string,
): Promise<{ success: boolean; message: string }> => {
  try {
    const trackingPage = await prisma.trackingPage.findUnique({
      where: { ebay_item_id },
    });
    if (!trackingPage) {
      return { success: false, message: "Tracking Page not found" };
    }

    await prisma.trackingPage.delete({
      where: { ebay_item_id },
    });

    revalidatePath("/dashboard");
    return { success: true, message: "Tracking Page deleted" };
  } catch (error) {
    console.error("Error deleting tracking page:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      message: `Failed to delete tracking page: ${errorMessage}`,
    };
  }
};

export const onAddTrackingPage = async (
  keyPageId: number,
  data: { ebay_item_id: string },
): Promise<{
  success: boolean;
  message: string;
  newTrackingPage?: TrackingPageData;
}> => {
  try {
    if (!(await checkEbayItemIdUniqueness(data.ebay_item_id))) {
      return {
        success: false,
        message: `eBay Item ID ${data.ebay_item_id} already exists`,
      };
    }

    const keyPage = await prisma.keyPage.findUnique({
      where: { key_page_id: keyPageId },
    });
    if (!keyPage) {
      return { success: false, message: "Key Page not found" };
    }

    const ebayResult = await fetchEbayItemData(data.ebay_item_id);
    const status = ebayResult.success ? "SUCCESS" : "FAILED";
    const message = ebayResult.success
      ? "Successfully Updated"
      : ebayResult.error || "Failed to fetch tracking page data";

    const newTrackingPage = await prisma.trackingPage.create({
      data: {
        ebay_item_id: data.ebay_item_id,
        price: ebayResult.success ? ebayResult.data!.price : 0,
        image_url: ebayResult.success ? ebayResult.data!.image_url : "",
        store_name: ebayResult.success
          ? ebayResult.data!.store_name || "Tracking Store"
          : "Tracking Store",
        status,
        message,
        last_updated_date: new Date(),
        key_page_id: keyPageId,
      },
    });

    const trackingPageData: TrackingPageData = {
      key_page_id: newTrackingPage.key_page_id,
      ebay_item_id: newTrackingPage.ebay_item_id,
      price: newTrackingPage.price,
      image_url: newTrackingPage.image_url,
      store_name: newTrackingPage.store_name,
      status: newTrackingPage.status as "SUCCESS" | "FAILED",
      message: newTrackingPage.message || "",
      last_updated_date: newTrackingPage.last_updated_date.toLocaleString(),
    };

    revalidatePath("/dashboard");
    return {
      success: ebayResult.success,
      message,
      newTrackingPage: trackingPageData,
    };
  } catch (error) {
    console.error("Error adding tracking page:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      message: `Failed to add tracking page: ${errorMessage}`,
    };
  }
};
