"use client";
import { useCart } from "@/components/shared/CartContext";
import Link from "next/link";
import { useFormik } from "formik";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function CheckoutPage() {
  const { cartItems, clearCart,removeFromCart } = useCart();

  
  const router = useRouter();

  const subtotal = cartItems.reduce(
    (total, item) => total + (item.price * item.quantity),
    0
  );
  const shippingCost = 70;
  const total = subtotal + shippingCost;

  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
      address: "",
      delivery: "inside",
      payment: "cod",
      note: "",
      discountCode: ""
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const orderData = {
          customer: {
            name: values.name,
            phone: values.phone,
            address: values.address
          },
          delivery: {
            type: values.delivery,
            cost: shippingCost
          },
          payment: {
            method: values.payment,
            amount: total
          },
          items: cartItems.map(item => ({
            product: item?.id,
            name: item?.title,
            size: item.size,
            price: item.price,
            quantity: item.quantity
          })),
          subtotal,
          total,
          note: values.note
        };

        // Replace with your actual API endpoint
        const response = await axios.post(
          "https://hoktokserver-1.onrender.com/api/orders",
          orderData
        );

        if (response.status === 200 || response.status === 201) {
          toast.success("Order placed successfully!");
          clearCart();
          // removeFromCart(item?._id, item.size)
          router.push(`/confirmation/${response.data?.orderNo}`);
        }
      } catch (error) {
        console.error("Order submission failed:", error);
        toast.error("Failed to place order. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
    validate: values => {
      const errors = {};
      if (!values.name) errors.name = "Required";
      if (!values.phone) errors.phone = "Required";
      if (!values.address) errors.address = "Required";
      return errors;
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
      {/* Breadcrumbs */}
      <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-2 text-sm">
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
              <span className="text-gray-700 font-medium">Checkout</span>
            </div>
          </li>
        </ol>
      </nav>

      <form onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Details Section */}
          <div className="lg:col-span-1">
            <h2 className="text-lg font-bold mb-5">Shipping Details</h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-medium mb-1" htmlFor="name">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-700"
                  required
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                />
                {formik.touched.name && formik.errors.name ? (
                  <div className="text-red-500 text-xs mt-1">{formik.errors.name}</div>
                ) : null}
              </div>

              <div>
                <label className="block text-xs font-medium mb-1" htmlFor="phone">
                  Your Phone *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-700"
                  required
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.phone}
                />
                {formik.touched.phone && formik.errors.phone ? (
                  <div className="text-red-500 text-xs mt-1">{formik.errors.phone}</div>
                ) : null}
              </div>

              <div>
                <label className="block text-xs font-medium mb-1" htmlFor="address">
                  Your Address *
                </label>
                <textarea
                  id="address"
                  name="address"
                  placeholder="Enter your address"
                  rows={3}
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-700"
                  required
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.address}
                />
                {formik.touched.address && formik.errors.address ? (
                  <div className="text-red-500 text-xs mt-1">{formik.errors.address}</div>
                ) : null}
              </div>

              <div>
                <label className="block text-xs font-medium mb-2">Delivery Type</label>
                <div className="flex gap-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="delivery"
                      value="inside"
                      className="text-cyan-700 focus:ring-cyan-700 text-sm"
                      checked={formik.values.delivery === "inside"}
                      onChange={formik.handleChange}
                    />
                    <span className="ml-2 text-sm">Inside Dhaka</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="delivery"
                      value="outside"
                      className="text-cyan-700 focus:ring-cyan-700 text-sm"
                      checked={formik.values.delivery === "outside"}
                      onChange={formik.handleChange}
                    />
                    <span className="ml-2 text-sm">Outside Dhaka</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-2">Select Payment</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="border border-gray-300 rounded-md p-3 flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      className="text-cyan-700 focus:ring-cyan-700 text-sm"
                      checked={formik.values.payment === "cod"}
                      onChange={formik.handleChange}
                    />
                    <span className="ml-2 text-sm">Cash on Delivery</span>
                  </label>
                  <label className="border border-gray-300 rounded-md p-3 flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      value="online"
                      className="text-cyan-700 focus:ring-cyan-700 text-sm"
                      checked={formik.values.payment === "online"}
                      onChange={formik.handleChange}
                    />
                    <span className="ml-2 text-sm">Online Payment</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="lg:col-span-1">
            <h2 className="text-lg font-bold mb-5">Order Summary</h2>
            
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              {/* Order Items */}
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={`${item._id}-${item.size}`} className="flex justify-between text-sm">
                    <span>{item?.title} | {item.size}</span>
                    <span>BDT {item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>BDT {subtotal}</span>
                </div>

                {/* <div className="flex justify-between items-center text-sm">
                  <span>Gift Card / Discount code</span>
                  <div className="flex">
                    <input
                      type="text"
                      name="discountCode"
                      placeholder="Enter code"
                      className="px-3 py-1.5 border border-gray-300 rounded-l-md text-xs w-28 focus:outline-none focus:ring-1 focus:ring-cyan-700"
                      onChange={formik.handleChange}
                      value={formik.values.discountCode}
                    />
                    <button 
                      type="button"
                      className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-r-md text-xs hover:bg-gray-300"
                    >
                      Apply
                    </button>
                  </div>
                </div> */}

                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>BDT {shippingCost}</span>
                </div>

                <div className="flex justify-between font-bold pt-3">
                  <span className="text-sm">TOTAL</span>
                  <span className="text-base">BDT {total}</span>
                </div>
              </div>

              <div className="mt-5">
                <label className="block text-xs font-medium mb-1" htmlFor="note">
                  Order Note
                </label>
                <textarea
                  id="note"
                  name="note"
                  placeholder="Any special instructions?"
                  rows={2}
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-700"
                  onChange={formik.handleChange}
                  value={formik.values.note}
                />
              </div>

              <button 
                type="submit"
                className="w-full mt-5 py-2.5 bg-cyan-700 text-white rounded-md hover:bg-cyan-800 font-medium text-sm disabled:opacity-50"
                disabled={formik.isSubmitting || cartItems.length === 0}
              >
                {formik.isSubmitting ? "Processing..." : "Confirm Order"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}