export interface AddRecordData {
  key_page_ebay_item_id: string;
  minimum_best_offer?: number;
  price?: number;
  page_01?: string;
  page_02?: string;
  page_03?: string;
}

export interface DataModalFormData {
  key_page_ebay_item_id: string;
  minimum_best_offer?: number;
  price?: number;
  page_01?: string;
  page_02?: string;
  page_03?: string;
}

export interface DataModalFormErrors {
  key_page_ebay_item_id?: string;
  minimum_best_offer?: string;
  price?: string;
  page_01?: string;
  page_02?: string;
  page_03?: string;
}

export interface TrackingPageData {
  key_page_id: number;
  ebay_item_id: string;
  price: number;
  image_url: string;
  store_name: string;
  status: "SUCCESS" | "FAILED";
  message: string;
  last_updated_date: string;
}

export interface KeyPageData {
  key_page_id: number;
  ebay_item_id: string;
  price: number;
  minimum_best_offer: number;
  image_url: string;
  title: string;
  status: "SUCCESS" | "FAILED";
  message: string | undefined;
  last_updated_date: string;
}

export interface TableRowData {
  status: "SUCCESS" | "FAILED";
  message: string;
  timestamp: string;
  keyPage: KeyPageData;
  page01?: TrackingPageData;
  page02?: TrackingPageData;
  page03?: TrackingPageData;
}
