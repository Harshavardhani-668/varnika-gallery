import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FormattedProduct } from "@/types/product";

const fetchProducts = async (): Promise<FormattedProduct[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products from database:", error);
    throw new Error("Failed to fetch products");
  }

  return (data || []).map((p: any) => ({
    id: p.product_id,
    name: p.product_name,
    shortDescription: p.short_description || "",
    longDescription: p.long_description || "",
    brand: p.brand || "Varnika",
    modelNumber: p.model_number || "",
    category: p.category || "",
    subcategory: p.subcategory || "",
    tags: p.tags?.split(",").map((t: string) => t.trim()).filter(Boolean) || [],
    color: p.color_variant || "",
    regularPrice: Number(p.regular_price) || 0,
    salePrice: p.sale_price ? Number(p.sale_price) : null,
    imageUrl: p.image_url_1 || "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=800&fit=crop",
    imageUrl2: p.image_url_2,
    imageUrl3: p.image_url_3,
    stock: Number(p.stock) || 0,
    rating: Number(p.rating) || 0,
    reviewCount: Number(p.review_count) || 0,
    customizable: p.customizable === true,
    featured: p.featured === true,
  }));
};

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
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
