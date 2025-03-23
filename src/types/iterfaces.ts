export interface InitialData {
  status: string;
  message: string;
  timestamp: string;
  keyPage?: {
    ebay_item_id: string;
    price: number;
    minimum_best_offer: number;
    image_url: string;
    title: string;
    status: string;
    message?: string;
  };
  page01?: {
    ebay_item_id: string;
    price: number;
    image_url: string;
    title: string;
    status: string;
    message?: string;
  };
  page02?: {
    ebay_item_id: string;
    price: number;
    image_url: string;
    title: string;
    status: string;
    message?: string;
  };
  page03?: {
    ebay_item_id: string;
    price: number;
    image_url: string;
    title: string;
    status: string;
    message?: string;
  };
}
export interface TableViewProps {
  initialData: InitialData[];
}
