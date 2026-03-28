import { useEffect } from "react";

interface PageMeta {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
}

/**
 * Hook to update page meta tags for SEO
 * Uses document.title and meta tags for maximum compatibility
 */
export const usePageMeta = (meta: PageMeta) => {
  useEffect(() => {
    // Set page title
    document.title = meta.title;

    // Update/create meta description
    let descMeta = document.querySelector('meta[name="description"]');
    if (!descMeta) {
      descMeta = document.createElement("meta");
      descMeta.setAttribute("name", "description");
      document.head.appendChild(descMeta);
    }
    descMeta.setAttribute("content", meta.description);

    // Update/create meta keywords if provided
    if (meta.keywords) {
      let keywordsMeta = document.querySelector('meta[name="keywords"]');
      if (!keywordsMeta) {
        keywordsMeta = document.createElement("meta");
        keywordsMeta.setAttribute("name", "keywords");
        document.head.appendChild(keywordsMeta);
      }
      keywordsMeta.setAttribute("content", meta.keywords);
    }

    // Update Open Graph image if provided
    if (meta.ogImage) {
      let ogImage = document.querySelector('meta[property="og:image"]');
      if (!ogImage) {
        ogImage = document.createElement("meta");
        ogImage.setAttribute("property", "og:image");
        document.head.appendChild(ogImage);
      }
      ogImage.setAttribute("content", meta.ogImage);
    }

    return () => {
      // Cleanup: restore to defaults
      document.title = "Varnika - Handmade Gifts & Unique Crafts";
    };
  }, [meta]);
};
