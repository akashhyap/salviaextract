/**
 * Internal Dependencies.
 */
import { HEADER_FOOTER_ENDPOINT } from "../../util/constants/endpoints";
import { getProductsData, getProductBySlug, getProductVariationsData  } from "../../util/products";
import Layout from "../../../components/layout";
import SingleProduct from "../../../components/single-product";

/**
 * External Dependencies.
 */
import axios from "axios";
import { useRouter } from "next/router";

export default function Product({ headerFooter, product, productVariations }) {
//   console.log("productVariations slug", productVariations);
  const router = useRouter();

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <Layout
      headerFooter={headerFooter || {}}
      // seo={ product?.yoast_head_json ?? {} }
      uri={`/product/${product?.slug ?? ""}`}
    >
      <SingleProduct product={product} productVariations={productVariations} />
    </Layout>
  );
}

export async function getStaticProps({ params }) {
  const { slug } = params || {};
  const { data: headerFooterData } = await axios.get(HEADER_FOOTER_ENDPOINT);
  const { data: product } = await getProductBySlug(slug);

  const productVariations = await Promise.all(
    product.map(async (product) => {
      const { data: variations } = await getProductVariationsData(product.id);
      return { id: product.id, variations };
    })
  );

  return {
    props: {
      headerFooter: headerFooterData?.data ?? {},
      product: product.length ? product[0] : {},
      productVariations,
    },
    revalidate: 1,
  };
}

export async function getStaticPaths() {
  const { data: products } = await getProductsData();

  // Expected Data Shape: [{ params: { slug: 'pendant' } }, { params: { slug: 'shirt' } }],
  const pathsData = [];

  products.length &&
    products.map((product) => {
      if (product.slug) {
        pathsData.push({ params: { slug: product.slug ?? "" } });
      }
    });

  return {
    paths: pathsData,
    fallback: true,
  };
}
