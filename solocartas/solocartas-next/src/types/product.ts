export interface Store {
  id: number;
  name: string;
  website_url: string;
}

export interface ProductPrice {
  id: number;
  price: number;
  url: string;
  scrapped_at: string; // Consider using Date type if you parse it
  store: Store;
}

export interface ProductListItem {
  id: number;
  name: string;
  img_url: string;
  min_price: number;
  game: string;
  edition: string;
  language: string;
  description: string;
  condition: string;
  product_type: string;
}

export interface ProductDetailData extends ProductListItem {
  prices: ProductPrice[];
}

// For the catalog query parameters
export interface ProductFilters {
  name?: string;
  min_price?: number;
  max_price?: number;
  game?: string;
  product_type?: string;
  skip?: number;
  limit?: number;
}
