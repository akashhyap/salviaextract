import React, { useEffect, useState, useRef } from "react";
import { isEmpty } from "lodash";
import Image from "next/image";
import { deleteCartItem, updateCart } from "../../src/util/cart";
import DOMPurify from "isomorphic-dompurify";

const CartItem = ({ item, products, setCart }) => {
  const [productCount, setProductCount] = useState(item.quantity);
  const [updatingProduct, setUpdatingProduct] = useState(false);
  const [removingProduct, setRemovingProduct] = useState(false);
  const productImg = item?.data?.images?.[0] ?? "";

  // console.log("item", item);

  /**
   * Do not allow state update on an unmounted component.
   *
   * isMounted is used so that we can set it's value to false
   * when the component is unmounted.
   * This is done so that setState ( e.g setRemovingProduct ) in asynchronous calls
   * such as axios.post, do not get executed when component leaves the DOM
   * due to product/item deletion.
   * If we do not do this as unsubscription, we will get
   * "React memory leak warning- Can't perform a React state update on an unmounted component"
   *
   * @see https://dev.to/jexperton/how-to-fix-the-react-memory-leak-warning-d4i
   * @type {React.MutableRefObject<boolean>}
   */
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    // When component is unmounted, set isMounted.current to false.
    return () => {
      isMounted.current = false;
    };
  }, []);

  /*
   * Handle remove product click.
   *
   * @param {Object} event event
   * @param {Integer} Product Id.
   *
   * @return {void}
   */
  const handleRemoveProductClick = (event, cartKey) => {
    event.stopPropagation();

    // If the component is unmounted, or still previous item update request is in process, then return.
    if (!isMounted || updatingProduct) {
      return;
    }

    deleteCartItem(cartKey, setCart, setRemovingProduct);
  };

  /*
   * When user changes the qty from product input update the cart in localStorage
   * Also update the cart in global context
   *
   * @param {Object} event event
   *
   * @return {void}
   */
  const handleQtyChange = (event, cartKey, type) => {
    if (typeof window !== "undefined") {
      event.stopPropagation();
      let newQty;

      // If the previous cart request is still updatingProduct or removingProduct, then return.
      if (
        updatingProduct ||
        removingProduct ||
        ("decrement" === type && 1 === productCount)
      ) {
        return;
      }

      if (!isEmpty(type)) {
        newQty = "increment" === type ? productCount + 1 : productCount - 1;
      } else {
        // If the user tries to delete the count of product, set that to 1 by default ( This will not allow him to reduce it less than zero )
        newQty = event.target.value ? parseInt(event.target.value) : 1;
      }

      // Set the new qty in state.
      setProductCount(newQty);

      if (products.length) {
        updateCart(item?.key, newQty, setCart, setUpdatingProduct);
      }
    }
  };

  return (
    <div className="cart-item-wrap grid grid-cols-3 gap-6 mb-5 border border-brand-bright-grey p-5">
      <div className="col-span-1 cart-left-col">
        <figure>
          <Image
            width="150"
            height="150"
            alt={productImg?.alt ?? ""}
            src={!isEmpty(productImg?.src) ? productImg?.src : ""} // use normal <img> attributes as props
          />
        </figure>
      </div>

      <div className="col-span-2 cart-right-col">
        <div className="flex flex-col h-full">
          <div className="cart-product-title-wrap relative">
            <h2 className="text-2xl pb-2">{item?.data?.name}</h2>
            {/* {item?.data?.description ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(item?.data?.description),
                }}
              />
            ) : (
              ""
            )} */}
          </div>

          <footer className="cart-product-footer flex justify-between items-center py-4 border-t border-brand-bright-grey">
            <div className="">
              <span className="cart-total-price">
                {item?.currency}
                {item?.line_subtotal}
              </span>
            </div>

            {/*Qty*/}
            <div className="flex items-center border border-gray-300 p-2 rounded-md relative">
              {updatingProduct ? (
                <Image
                  className="absolute left-0 right-0 mx-auto bg-white"
                  width="30"
                  height="30"
                  src="/cart-spinner.gif"
                  alt="spinner"
                />
              ) : null}
              <button
                className={`decrement-btn text-2xl ${
                  updatingProduct ? "cursor-none" : ""
                }`}
                onClick={(event) =>
                  handleQtyChange(event, item?.cartKey, "decrement")
                }
              >
                -
              </button>
              <input
                type="number"
                min="1"
                style={{
                  textAlign: "center",
                  width: "50px",
                  paddingRight: "0",
                }}
                data-cart-key={item?.data?.cartKey}
                className={`woo-next-cart-qty-input ml-3 ${
                  updatingProduct ? "disabled" : ""
                } `}
                value={productCount}
                onChange={(event) => handleQtyChange(event, item?.cartKey, "")}
              />
              <button
                className={`increment-btn text-2xl ${
                  updatingProduct ? "cursor-none" : ""
                }`}
                onClick={(event) =>
                  handleQtyChange(event, item?.cartKey, "increment")
                }
              >
                +
              </button>
            </div>
            <button
              className="cart-remove-item"
              onClick={(event) => handleRemoveProductClick(event, item?.key)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 ml-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
