const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;

const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL,
  consumerKey: process.env.WC_CONSUMER_KEY,
  consumerSecret: process.env.WC_CONSUMER_SECRET,
  version: "wc/v3",
});

/**
 * Get Products.
 *
 * @return {Promise<void>}
 */
export const getProductsData = async (perPage = 50) => {
  return await api.get("products", {
    per_page: perPage || 50,
  });
};

/**
 * Get Single Product By Slug.
 *
 * @return {Promise<void>}
 */
export const getProductBySlug = async (productSlug = "") => {
  return await api.get("products", {
    slug: productSlug,
  });
};

/**
 * Get Product Variations.
 *
 * @param {number} productId - The ID of the product to fetch variations for.
 * @param {number} perPage - The number of variations to return per page (default is 50).
 * @return {Promise<void>}
 */
export const getProductVariationsData = async (productId) => {
  return await api.get(`products/${productId}/variations`);
};
