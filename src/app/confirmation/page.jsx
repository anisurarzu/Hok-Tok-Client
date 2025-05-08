"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import { useCart } from "@/components/shared/CartContext";

export default function OrderConfirmationPage() {
  const { cartItems, clearCart } = useCart();
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();


  // Simulate fetching order details (replace with actual API call)
  useEffect(() => {
    const fetchOrderConfirmation = async () => {
      try {
        // For demo purposes, we'll use the cart items
        setTimeout(() => {
          setOrderDetails({
            orderId: `ORD-${id}`,
            date: new Date().toLocaleDateString(),
            items: cartItems,
            shippingAddress: "123 Main St, Dhaka, Bangladesh",
            paymentMethod: "Cash on Delivery",
            subtotal: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            shippingFee: 70,
            total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 70
          });
          setLoading(false);
          clearCart(); // Clear cart after successful order
        }, 1500);
      } catch (error) {
        toast.error("Failed to load order details");
        router.push("/");
      }
    };

    fetchOrderConfirmation();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-700"></div>
        </div>
        <p className="mt-4 text-lg">Loading your order details...</p>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-lg">No order details found.</p>
        <Link href="/" className="mt-4 inline-block px-6 py-2 bg-cyan-700 text-white rounded-md">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Order Confirmation Header */}
      <div className="text-center mb-10">
        <svg
          className="mx-auto h-12 w-12 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <h1 className="text-3xl font-bold text-gray-900 mt-4">Order Confirmed!</h1>
        <p className="mt-2 text-gray-600">
          Thank you for your purchase. Your order #{orderDetails.orderId} has been received.
        </p>
        <p className="text-gray-600">We have sent a confirmation to your email.</p>
      </div>
    </div>
  );
}