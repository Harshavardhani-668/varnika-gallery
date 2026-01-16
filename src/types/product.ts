export interface Product {
  "Product ID": string;
  "Product Name": string;
  "Short Description": string;
  "Long Description": string;
  "Brand": string;
  "Model Number": string;
  "Category": string;
  "Subcategory": string;
  "Tags/Keywords": string;
  "Color/Variant": string;
  "Regular Price": number;
  "Sale Price": number | null;
  "Cost Price": number;
  "Image URL 1": string;
  "Image URL 2"?: string;
  "Image URL 3"?: string;
  "Stock": number;
  "Rating": number;
  "Review Count": number;
  "Customizable": boolean;
  "Featured": boolean;
}

export interface FormattedProduct {
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  brand: string;
  modelNumber: string;
  category: string;
  subcategory: string;
  tags: string[];
  color: string;
  regularPrice: number;
  salePrice: number | null;
  imageUrl: string;
  imageUrl2?: string;
  imageUrl3?: string;
  stock: number;
  rating: number;
  reviewCount: number;
  customizable: boolean;
  featured: boolean;
}

export const formatProduct = (product: Product): FormattedProduct => ({
  id: product["Product ID"],
  name: product["Product Name"],
  shortDescription: product["Short Description"] || "",
  longDescription: product["Long Description"] || "",
  brand: product["Brand"] || "Varnika",
  modelNumber: product["Model Number"] || "",
  category: product["Category"] || "",
  subcategory: product["Subcategory"] || "",
  tags: product["Tags/Keywords"]?.split(",").map((t) => t.trim()) || [],
  color: product["Color/Variant"] || "",
  regularPrice: Number(product["Regular Price"]) || 0,
  salePrice: product["Sale Price"] ? Number(product["Sale Price"]) : null,
  imageUrl: product["Image URL 1"] || "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=800&fit=crop",
  imageUrl2: product["Image URL 2"],
  imageUrl3: product["Image URL 3"],
  stock: Number(product["Stock"]) || 0,
  rating: Number(product["Rating"]) || 0,
  reviewCount: Number(product["Review Count"]) || 0,
  customizable: product["Customizable"] === true || String(product["Customizable"]).toUpperCase() === "TRUE",
  featured: product["Featured"] === true || String(product["Featured"]).toUpperCase() === "TRUE",
});
