import { useQuery } from "@tanstack/react-query";
import { Product, FormattedProduct, formatProduct } from "@/types/product";

const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbxSs1egVeB7AQkWt8ijyl9Zwt34sMW3DaJDk1NyCUBBBB_D9aKY5pPKe7luO3pAIBGmKg/exec";

const fetchProducts = async (): Promise<FormattedProduct[]> => {
  const response = await fetch(SHEET_API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  const data: Product[] = await response.json();
  return data.map(formatProduct);
};

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    refetchOnWindowFocus: true,
  });
};

export const useFeaturedProducts = () => {
  const { data: products, ...rest } = useProducts();
  return {
    data: products?.filter((p) => p.featured).slice(0, 5),
    ...rest,
  };
};

export const useProduct = (id: string) => {
  const { data: products, ...rest } = useProducts();
  return {
    data: products?.find((p) => p.id === id),
    ...rest,
  };
};

export const useCategories = () => {
  const { data: products, ...rest } = useProducts();
  
  const categories = products?.reduce((acc, product) => {
    if (product.category && !acc.includes(product.category)) {
      acc.push(product.category);
    }
    return acc;
  }, [] as string[]) || [];
  
  return { data: categories, ...rest };
};
