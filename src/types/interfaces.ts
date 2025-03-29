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

export interface Price {
  value: string;
  currency: string;
}

export interface Image {
  imageUrl: string;
  width: number;
  height: number;
}

export interface Seller {
  username: string;
  feedbackPercentage: string;
  feedbackScore: number;
  store_name?: string;
}

export interface EbayItemResponse {
  itemId: string;
  sellerItemRevision?: string;
  title: string;
  shortDescription?: string;
  price: Price;
  minimum_best_offer?: number;
  image: Image;
  seller: Seller;
  buyingOptions: string[];
  description?: string;
  legacyItemId?: string;
}

export interface EbayApiErrorResponse {
  errors?: Array<{
    message?: string;
    longMessage?: string;
  }>;
}

export interface Config {
  IS_SANDBOX: boolean;
  EBAY_CLIENT_ID: string;
  EBAY_CLIENT_SECRET: string;
  EBAY_REDIRECT_URI: string;
  AUTH_URL: string;
  TOKEN_URL: string;
  API_BASE_URL: string;
}
