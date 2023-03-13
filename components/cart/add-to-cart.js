import { isEmpty } from "lodash";
import { addToCart } from "../../src/util/cart";
import { useContext, useState } from "react";
import { AppContext } from "../context";
import Link from "next/link";
import cx from "classnames";

const AddToCart = ({ product, selectedVariation }) => {
  //   console.log("selectedVariation:", selectedVariation);
  const [cart, setCart] = useContext(AppContext);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [loading, setLoading] = useState(false);
  const addToCartBtnClasses = cx(
    "duration-500 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow",
    {
      "bg-white hover:bg-gray-100": !loading,
      "bg-gray-200": loading,
    }
  );

  if (isEmpty(product)) {
    return null;
  }

  return (
    <>
      {"simple" === product?.type ? <button
        className={addToCartBtnClasses}
        onClick={() =>
          addToCart(
            product?.id ?? 0,
            1,
            selectedVariation,
            setCart,
            setIsAddedToCart,
            setLoading
          )
        }
        disabled={loading}
      >
        {loading ? "Adding..." : "Add to cart"}
      </button>: null}

      {"variable" === product?.type ? <button
        className={addToCartBtnClasses}
        onClick={() =>
          addToCart(
            product?.id ?? 0,
            1,
            selectedVariation,
            setCart,
            setIsAddedToCart,
            setLoading
          )
        }
        disabled={!selectedVariation}
      >
        {loading ? "Adding..." : "Add to cart"}
      </button>: null}
      {isAddedToCart && !loading ? (
        <Link href="/cart" legacyBehavior>
          <a className="bg-white hover:bg-gray-100 text-gray-800 font-semibold ml-4 py-2 px-4 border border-gray-400 rounded shadow">
            View cart
          </a>
        </Link>
      ) : null}
    </>
  );
};

export default AddToCart;
