import React, { useContext, useState } from "react";
import { AppContext } from "../context";
import CartItem from "./cart-item";

import Link from "next/link";
import { clearCart } from "../../src/util/cart";

const CartItemsContainer = () => {
  const [cart, setCart] = useContext(AppContext);
  const { cartItems, totalPrice, totalQty } = cart || {};
  const [isClearCartProcessing, setClearCartProcessing] = useState(false);

  // Clear the entire cart.
  const handleClearCart = async (event) => {
    event.stopPropagation();

    if (isClearCartProcessing) {
      return;
    }

    await clearCart(setCart, setClearCartProcessing);
  };

  const checkoutUrl =
    "https://woocommerce-186938-3327038.cloudwaysapps.com/cart";

    function setCartDataToCookies() {
      document.cookie = `cart=${JSON.stringify(cartItems)}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/; domain=.woocommerce-186938-3327038.cloudwaysapps.com; SameSite=None; Secure`;
    
      console.log("document.cookie=>", document.cookie);
    }
    
    

  return (
    <div className="content-wrap-cart max-w-6xl mx-auto py-10">
      <h1 className="font-semibold uppercase pb-5">Cart</h1>
      {cart ? (
        <div className="woo-next-cart-table-row grid lg:grid-cols-3 gap-4">
          {/*Cart Items*/}
          <div className="woo-next-cart-table lg:col-span-2 mb-md-0 mb-5">
            {cartItems.length &&
              cartItems.map((item) => (
                <CartItem
                  key={item.product_id}
                  item={item}
                  products={cartItems}
                  setCart={setCart}
                />
              ))}
          </div>

          {/*Cart Total*/}
          <div className="woo-next-cart-total-container lg:col-span-1 p-5 pt-0">
            <h2 className="pb-2">Cart Total</h2>
            <div className="grid grid-cols-3 bg-gray-100 mb-4">
              <p className="col-span-2 p-2 mb-0">Total({totalQty})</p>
              <p className="col-span-1 p-2 mb-0">
                {cartItems?.[0]?.currency ?? ""}
                {totalPrice.toFixed(2)}
              </p>
            </div>

            <div className="flex justify-between">
              {/*Clear entire cart*/}
              <div className="clear-cart">
                <button
                  className="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-gray-600 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-800"
                  onClick={(event) => handleClearCart(event)}
                  disabled={isClearCartProcessing}
                >
                  <span className="woo-next-cart">
                    {!isClearCartProcessing ? "Clear Cart" : "Clearing..."}
                  </span>
                </button>
              </div>

              {/*Checkout*/}

              {/* <a
                href={checkoutUrl}
                onClick={setCartDataToCookies}
                className="duration-500 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded-lg shadow bg-white hover:bg-gray-100 ml-3"
              >
                Checkout
              </a> */}
              <button
                onClick={setCartDataToCookies}
                className="duration-500 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded-lg shadow bg-white hover:bg-gray-100 ml-3"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-14">
          <h2>No items in the cart</h2>
          <Link href="/">
            <button className="text-white duration-500 bg-brand-orange hover:bg-brand-royal-blue font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:focus:ring-yellow-900">
              <span className="woo-next-cart-checkout-txt">
                Add New Products
              </span>
              <i className="fas fa-long-arrow-alt-right" />
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default CartItemsContainer;
