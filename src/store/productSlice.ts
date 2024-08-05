import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../types/product/Product";
import { ProductState } from "../types/product/Product";

const initialState: ProductState = {
  products: [],
  currentPage: 1,
  totalPages: 1,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
      state.totalPages = Math.ceil((state.products.length || 0) / 3); // Asumiendo 4 productos por página
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload);
      state.totalPages = Math.ceil(state.products.length / 3);
    },
    editProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    deleteProduct: (state, action: PayloadAction<number>) => {
      state.products = state.products.filter((product) => product.id !== action.payload);
      state.totalPages = Math.ceil(state.products.length / 3);
    },
  },
});

export const { setProducts, setCurrentPage, addProduct, editProduct, deleteProduct } = productSlice.actions;
export default productSlice.reducer;
