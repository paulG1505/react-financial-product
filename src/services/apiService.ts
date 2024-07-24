import axios from "axios";
import { Product } from "../interfaces/Products";

const BASE_URL =
  "https://tribu-ti-staffing-desarrollo-afangwbmcrhucqfh.z01.azurefd.net/ipf-msa-productosfinancieros";
const AUTHOR_ID = "1234";

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/bp/products`, {
      headers: {
        authorId: AUTHOR_ID,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};
export const createProduct = async (product: Product): Promise<void> => {
  try {
    if (!product.name || !product.description) {
      throw new Error("Name and description cannot be null");
    }
    await axios.post(`${BASE_URL}/bp/products`, product, {
      headers: {
        authorId: AUTHOR_ID,
      },
    });
  } catch (error) {
    console.error("Error creating product:", error);
  }
};

export const updateProduct = async (product: Product): Promise<void> => {
  try {
    if (!product.name || !product.description) {
      throw new Error("Name and description cannot be null");
    }
    await axios.put(`${BASE_URL}/bp/products`, product, {
      headers: {
        authorId: AUTHOR_ID,
      },
    });
  } catch (error) {
    console.error("Error updating product:", error);
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}/bp/products`, {
      headers: {
        authorId: AUTHOR_ID,
      },
      params: {
        id,
      },
    });
  } catch (error) {
    console.error("Error deleting product:", error);
  }
};

export const verifyProduct = async (id: string): Promise<boolean> => {
  try {
    const response = await axios.get(`${BASE_URL}/bp/products/verification`, {
      headers: {
        authorId: AUTHOR_ID,
      },
      params: {
        id,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error verifying product:", error);
    return false;
  }
};
