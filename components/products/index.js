import { isArray, isEmpty } from "lodash";
import Product from "./product";

const Products = ({ products }) => {
  if (isEmpty(products) || !isArray(products)) {
    return null;
  }
  console.log("products", products);
  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 lg:mb-14">
        {products.length
          ? products.map((product) => {
               return <Product key={product?.id} product={product} />;
            })
          : null}
      </div>
    </div>
  );
};

export default Products;
