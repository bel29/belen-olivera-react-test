export interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  description?: string;
  image?: string;
}
export interface ProductInsUpdProps {
  edit?: boolean;
}

export interface ProductState {
  products: Product[];
  currentPage: number;
  totalPages: number;
}
