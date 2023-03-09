import { isEmpty } from "lodash";
import Image from "next/image";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import AddToCart from "../cart/add-to-cart";

const Product = ({ product }) => {
  if (isEmpty(product)) {
    return null;
  }
  // console.log("product", product);

  const productType = product?.type ?? "";
  return (
    <div className="group flex flex-col bg-white border shadow-sm rounded-xl hover:shadow-md transition overflow-hidden">
      <Link href={`/products/${product?.slug}`} legacyBehavior>
        <a className="relative pt-[85%]">
          <Image
            src={product?.images?.[0]?.src ?? ""}
            alt="Image product"
            fill="cover"
            sizes="(max-width: 768px) 100%,
              (max-width: 1200px) 50%,
              33vw"
          />
        </a>
      </Link>
      <div className="p-4 md:p-5">
        <h3 className="mt-2 text-lg text-gray-800 font-semibold">
          {product.name}
        </h3>
        <div
          className="py-2"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(product?.price_html ?? ""),
          }}
        />
        {"simple" === productType ? (
          <AddToCart product={product} />
        ) : (
          <Link href={`/products/${product?.slug}`} legacyBehavior>
            <a className="inline-block bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
              Select Option
            </a>
          </Link>
        )}
      </div>
    </div>
  );
};
export default Product;
