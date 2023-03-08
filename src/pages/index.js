import Products from "../../components/products";
import Layout from "../../components/layout";
import Image from "next/image";
import axios from "axios";
import { getProductsData, getProductVariationsData } from "@/util/products";

export default function Home({ headerFooter, products, productVariations }) {
  // console.log("productVariations",productVariations);
  // return null
  return (
      <Layout headerFooter={headerFooter}>
        <Products products={products} />
      </Layout>
  );
}

export async function getStaticProps() {
  const { data: headerFooterData } = await axios.get(
    `${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/wp-json/rae/v1/header-footer?header_location_id=hcms-menu-header&footer_location_id=hcms-menu-footer`
  );

  const { data: products } = await getProductsData();

  const productVariations = await Promise.all(
    products.map(async (product) => {
      const { data: variations } = await getProductVariationsData(product.id);
      return { id: product.id, variations };
    })
  );

  return {
    props: {
      headerFooter: headerFooterData?.data ?? {},
      products: products ?? {},
      productVariations
    },
    revalidate: 1,
  };
}
