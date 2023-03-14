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

/**
 * Create an Order in WooCommerce.
 *
 * @param {Object} orderData - The order data.
 * @param {string} consumerKey - The WooCommerce Rest API consumer key.
 * @param {string} consumerSecret - The WooCommerce Rest API consumer secret.
 * @returns {Promise<Object>} The created order.
 */
export const createOrder = async (orderData, consumerKey, consumerSecret) => {
  const api = new WooCommerceRestApi({
    url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL,
    consumerKey: consumerKey,
    consumerSecret: consumerSecret,
    version: "wc/v3",
  });

  return await api.post("orders", orderData);
};
