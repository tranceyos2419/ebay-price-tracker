"use server";

import prisma from "@/lib/prisma";
import { TableViewProps } from "@/components/features/TableView";
import { revalidatePath } from "next/cache";

export const onFetchRecords = async (): Promise<{
  initialData: TableViewProps["initialData"];
}> => {
  try {
    const keyPages = await prisma.keyPage.findMany({
      include: {
        TrackingPage: true,
      },
    });

    const initialData: TableViewProps["initialData"] = keyPages
      .map((keyPage) => {
        const trackingPages = keyPage.TrackingPage || [];

        const [page01, page02, page03] = trackingPages
          .slice(0, 3)
          .map((page) => ({
            ebay_item_id: page.ebay_item_id,
            price: page.price,
            image_url: page.image_url,
            store_name: page.store_name,
            status: page.status,
            message: page.message || undefined,
            last_updated_date: page.last_updated_date.toLocaleString(),
          }));

        return {
          status: "Success",
          message: "Successfully Updated",
          timestamp: keyPage.last_updated_date.toLocaleString(),
          keyPage: {
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
      })
      .reverse();

    return { initialData };
  } catch (error) {
    console.error("Error fetching records:", error);
    throw error;
  }
};

interface AddRecordData {
  key_page: string;
  minimum_best_offer?: number;
  price?: number;
  page_01?: string;
  page_02?: string;
  page_03?: string;
}

export const onAddRecord = async (
  data: AddRecordData,
): Promise<{
  success: boolean;
  message: string;
  newRow?: TableViewProps["initialData"][0];
}> => {
  try {
    const keyPage = await prisma.keyPage.create({
      data: {
        ebay_item_id: data.key_page,
        price: data.price || 0,
        minimum_best_offer: data.minimum_best_offer || 0,
        image_url:
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "New Item",
        status: "active",
        message: "Key Page Added",
        last_updated_date: new Date(),
      },
    });

    await prisma.item.create({
      data: {
        key_page_id: keyPage.key_page_id,
      },
    });

    const trackingPagesData = [];
    if (data.page_01) {
      trackingPagesData.push({
        ebay_item_id: data.page_01,
        price: data.price || 0,
        image_url:
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        store_name: "Tracking Store 01",
        status: "active",
        message: "Tracking Page 01",
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
        status: "active",
        message: "Tracking Page 02",
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
        status: "active",
        message: "Tracking Page 03",
        last_updated_date: new Date(),
        key_page_id: keyPage.key_page_id,
      });
    }

    let trackingPages = [];
    if (trackingPagesData.length > 0) {
      trackingPages = await prisma.trackingPage.createManyAndReturn({
        data: trackingPagesData,
      });
    }

    const newRow: TableViewProps["initialData"][0] = {
      status: "Success",
      message: "New Item Added",
      timestamp: new Date().toLocaleString(),
      keyPage: {
        ebay_item_id: keyPage.ebay_item_id,
        price: keyPage.price,
        minimum_best_offer: keyPage.minimum_best_offer,
        image_url: keyPage.image_url,
        title: keyPage.title,
        status: keyPage.status,
        message: keyPage.message,
        last_updated_date: keyPage.last_updated_date.toLocaleString(),
      },
      page01: trackingPages[0]
        ? {
            ebay_item_id: trackingPages[0].ebay_item_id,
            price: trackingPages[0].price,
            image_url: trackingPages[0].image_url,
            store_name: trackingPages[0].store_name,
            status: trackingPages[0].status,
            message: trackingPages[0].message,
            last_updated_date:
              trackingPages[0].last_updated_date.toLocaleString(),
          }
        : undefined,
      page02: trackingPages[1]
        ? {
            ebay_item_id: trackingPages[1].ebay_item_id,
            price: trackingPages[1].price,
            image_url: trackingPages[1].image_url,
            store_name: trackingPages[1].store_name,
            status: trackingPages[1].status,
            message: trackingPages[1].message,
            last_updated_date:
              trackingPages[1].last_updated_date.toLocaleString(),
          }
        : undefined,
      page03: trackingPages[2]
        ? {
            ebay_item_id: trackingPages[2].ebay_item_id,
            price: trackingPages[2].price,
            image_url: trackingPages[2].image_url,
            store_name: trackingPages[2].store_name,
            status: trackingPages[2].status,
            message: trackingPages[2].message,
            last_updated_date:
              trackingPages[2].last_updated_date.toLocaleString(),
          }
        : undefined,
    };

    revalidatePath("/dashboard");
    return { success: true, message: "Record added successfully", newRow };
  } catch (error) {
    console.error("Error adding record:", error);
    return { success: false, message: "Failed to add record" };
  }
};
