"use client";
import { useCart } from "@/components/shared/CartContext";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const { cartItems, cartCount, removeFromCart, updateQuantity, clearCart } =
    useCart();

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  console.log("Cart Item",cartItems);

  // Calculate shipping cost (70 BDT as shown in your image)
  const shippingCost = 70;
  const grandTotal = totalPrice + shippingCost;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 text-sm">
          <li>
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              Home
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mx-1 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700 font-medium">Cart List</span>
            </div>
          </li>
        </ol>
      </nav>

      <h1 className="text-2xl font-bold mb-6">Your Cart ({cartCount} items)</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg mb-4">Your cart is empty</p>
          <Link
            href="/"
            className="px-6 py-2 bg-cyan-700 text-white rounded-md"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div
                key={`${item?._id}-${item?.size}`}
                className="border border-gray-200 rounded-lg p-6 flex flex-col sm:flex-row"
              >
                {/* Product Image */}
                <div className="w-full sm:w-32 h-32 relative mb-4 sm:mb-0">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>

                {/* Product Info */}
                <div className="sm:ml-6 flex-grow">
                  <h3 className="text-lg font-medium">{item.title}</h3>
                  <p className="text-gray-600 mt-1">Size: {item.size}</p>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.size, item.quantity - 1)
                        }
                        className="px-3 py-1 border border-gray-300 rounded-l-md"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-4 py-1 border-t border-b border-gray-300">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.size, item.quantity + 1)
                        }
                        className="px-3 py-1 border border-gray-300 rounded-r-md"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold">
                        BDT {item.price * item.quantity}
                      </p>
                      <button
                        onClick={() => removeFromCart(item?._id, item.size)}
                        className="text-sm text-red-500 mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>

              {/* Order Items */}
              <div className="space-y-3 mb-6">
                {cartItems.map((item) => (
                  <div
                    key={`summary-${item.id}-${item.size}`}
                    className="flex justify-between"
                  >
                    <span>{item.title}</span>
                    <span>BDT {item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>BDT {totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>BDT {shippingCost}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2">
                  <span>TOTAL</span>
                  <span>BDT {grandTotal}</span>
                </div>
              </div>

              <Link href="/checkout" passHref>
                <button className="w-full mt-6 py-3 bg-cyan-700 text-white rounded-md hover:bg-cyan-800">
                  Checkout
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
