"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  AddRecordData,
  TrackingPageData,
  TableRowData,
} from "@/types/interfaces";
import { Prisma } from "@prisma/client";

async function checkEbayItemIdUniqueness(
  ebay_item_id: string,
  excludeId?: string,
): Promise<boolean> {
  const keyPage = await prisma.keyPage.findUnique({ where: { ebay_item_id } });
  const trackingPage = await prisma.trackingPage.findUnique({
    where: { ebay_item_id },
  });
  return (
    !(keyPage && keyPage.ebay_item_id !== excludeId) &&
    !(trackingPage && trackingPage.ebay_item_id !== excludeId)
  );
}

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
          status: page.status,
          message: page.message || "",
          last_updated_date: page.last_updated_date.toLocaleString(),
        }));

      return {
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
          status: keyPage.status,
          message: keyPage.message || undefined,
          last_updated_date: keyPage.last_updated_date.toLocaleString(),
        },
        page01: page01 || undefined,
        page02: page02 || undefined,
        page03: page03 || undefined,
      };
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

    const keyPage = await prisma.keyPage.create({
      data: {
        ebay_item_id: data.key_page_ebay_item_id,
        price: data.price || 0,
        minimum_best_offer: data.minimum_best_offer || 0,
        image_url:
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "New Item",
        status: "SUCCESS",
        message: "Key Page Added",
        last_updated_date: new Date(),
      },
    });

    await prisma.item.create({
      data: { key_page_id: keyPage.key_page_id },
    });

    const trackingPagesData: Prisma.TrackingPageCreateManyInput[] = [];
    const placeholderPrefix = `${keyPage.key_page_id}-placeholder`;

    if (data.page_01) {
      trackingPagesData.push({
        ebay_item_id: data.page_01,
        price: data.price || 0,
        image_url:
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        store_name: "Tracking Store 01",
        status: "SUCCESS",
        message: "Tracking Page 01",
        last_updated_date: new Date(),
        key_page_id: keyPage.key_page_id,
      });
    } else {
      trackingPagesData.push({
        ebay_item_id: `${placeholderPrefix}-01`,
        price: 0,
        image_url: "/file.svg",
        store_name: "Empty Store",
        status: "FAILED",
        message: "No Tracking Page",
        last_updated_date: new Date(),
        key_page_id: keyPage.key_page_id,
      });
    }

    if (data.page_02) {
      trackingPagesData.push({
        ebay_item_id: data.page_02,
        price: data.price || 0,
        image_url:
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        store_name: "Tracking Store 02",
        status: "SUCCESS",
        message: "Tracking Page 02",
        last_updated_date: new Date(),
        key_page_id: keyPage.key_page_id,
      });
    } else {
      trackingPagesData.push({
        ebay_item_id: `${placeholderPrefix}-02`,
        price: 0,
        image_url: "/file.svg",
        store_name: "Empty Store",
        status: "FAILED",
        message: "No Tracking Page",
        last_updated_date: new Date(),
        key_page_id: keyPage.key_page_id,
      });
    }

    if (data.page_03) {
      trackingPagesData.push({
        ebay_item_id: data.page_03,
        price: data.price || 0,
        image_url:
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        store_name: "Tracking Store 03",
        status: "SUCCESS",
        message: "Tracking Page 03",
        last_updated_date: new Date(),
        key_page_id: keyPage.key_page_id,
      });
    } else {
      trackingPagesData.push({
        ebay_item_id: `${placeholderPrefix}-03`,
        price: 0,
        image_url: "/file.svg",
        store_name: "Empty Store",
        status: "FAILED",
        message: "No Tracking Page",
        last_updated_date: new Date(),
        key_page_id: keyPage.key_page_id,
      });
    }

    let trackingPages: TrackingPageData[] = [];
    if (trackingPagesData.length > 0) {
      const createdPages = await prisma.trackingPage.createManyAndReturn({
        data: trackingPagesData,
      });

      trackingPages = createdPages.map((page) => ({
        key_page_id: page.key_page_id,
        ebay_item_id: page.ebay_item_id,
        price: page.price,
        image_url: page.image_url,
        store_name: page.store_name,
        status: page.status,
        message: page.message || "",
        last_updated_date: page.last_updated_date.toLocaleString(),
      }));
    }

    const newRow: TableRowData = {
      status: "SUCCESS",
      message: "New Item Added",
      timestamp: new Date().toLocaleString(),
      keyPage: {
        key_page_id: keyPage.key_page_id,
        ebay_item_id: keyPage.ebay_item_id,
        price: keyPage.price,
        minimum_best_offer: keyPage.minimum_best_offer,
        image_url: keyPage.image_url,
        title: keyPage.title,
        status: keyPage.status,
        message: keyPage.message,
        last_updated_date: keyPage.last_updated_date.toLocaleString(),
      },
      page01: trackingPages[0],
      page02: trackingPages[1],
      page03: trackingPages[2],
    };

    revalidatePath("/dashboard");
    return { success: true, message: "Record added successfully", newRow };
  } catch (error) {
    console.error("Error adding record:", error);
    return { success: false, message: "Failed to add record" };
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

    await prisma.keyPage.update({
      where: { ebay_item_id },
      data: {
        ebay_item_id: data.ebay_item_id,
        price: data.price,
        minimum_best_offer: data.minimum_best_offer,
        status: "SUCCESS",
        last_updated_date: new Date(),
      },
    });
    revalidatePath("/dashboard");
    return { success: true, message: "Key Page updated successfully" };
  } catch (error) {
    console.error("Error updating key page:", error);
    return { success: false, message: "Failed to update key page" };
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

    const isPlaceholder = originalEbayId.includes("-placeholder-");
    if (isPlaceholder) {
      const placeholderRecord = await prisma.trackingPage.findUnique({
        where: { ebay_item_id: originalEbayId },
        select: { key_page_id: true },
      });

      if (!placeholderRecord) {
        return { success: false, message: "Placeholder record not found" };
      }

      await prisma.trackingPage.delete({
        where: { ebay_item_id: originalEbayId },
      });

      await prisma.trackingPage.create({
        data: {
          ebay_item_id: data.ebay_item_id,
          price: 0,
          image_url:
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          store_name: "Tracking Store",
          status: "SUCCESS",
          message: "Tracking Page Created",
          last_updated_date: new Date(),
          key_page_id: placeholderRecord.key_page_id,
        },
      });
    } else {
      await prisma.trackingPage.update({
        where: { ebay_item_id: originalEbayId },
        data: {
          ebay_item_id: data.ebay_item_id,
          status: "SUCCESS",
          last_updated_date: new Date(),
        },
      });
    }

    revalidatePath("/dashboard");
    return { success: true, message: "Tracking page updated successfully" };
  } catch (error) {
    console.error("Error updating tracking page:", error);
    return { success: false, message: "Failed to update tracking page" };
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

    await prisma.trackingPage.deleteMany({
      where: { key_page_id: keyPage.key_page_id },
    });
    await prisma.item.deleteMany({
      where: { key_page_id: keyPage.key_page_id },
    });
    await prisma.keyPage.delete({
      where: { ebay_item_id },
    });

    revalidatePath("/dashboard");
    return { success: true, message: "Key Page and associated data deleted" };
  } catch (error) {
    console.error("Error deleting key page:", error);
    return { success: false, message: "Failed to delete key page" };
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
    return { success: true, message: "Tracking Page deleted and reordered" };
  } catch (error) {
    console.error("Error deleting tracking page:", error);
    return { success: false, message: "Failed to delete tracking page" };
  }
};

export const onAddTrackingPage = async (
  keyPageId: number,
  data: { ebay_item_id: string; price: number },
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

    const newTrackingPage = await prisma.trackingPage.create({
      data: {
        ebay_item_id: data.ebay_item_id,
        price: data.price,
        image_url:
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        store_name: "Tracking Store",
        status: "SUCCESS",
        message: "Tracking Page Added",
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
      status: newTrackingPage.status,
      message: newTrackingPage.message || "",
      last_updated_date: newTrackingPage.last_updated_date.toLocaleString(),
    };

    revalidatePath("/dashboard");
    return {
      success: true,
      message: "Tracking Page added successfully",
      newTrackingPage: trackingPageData,
    };
  } catch (error) {
    console.error("Error adding tracking page:", error);
    return { success: false, message: "Failed to add tracking page" };
  }
};
