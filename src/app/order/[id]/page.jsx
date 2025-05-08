"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { useFormik } from "formik";
import { toast } from "react-toastify";

export default function OrderPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `https://hoktokserver-1.onrender.com/api/product/${id}`
        );
        if (res?.status === 200) {
          setProduct(res.data);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setQuantity(1);
  };

  const increaseQuantity = () => {
    if (selectedSize && quantity < selectedSize?.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
    setCursorPosition({ x: e.clientX, y: e.clientY });
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
      address: "",
      delivery: "inside",
      payment: "cod",
      note: ""
    },
    onSubmit: async (values) => {
      try {
        const orderData = {
          customer: {
            name: values.name,
            phone: values.phone,
            address: values.address
          },
          delivery: {
            type: values.delivery,
            cost: values.delivery === "inside" ? 70 : 120
          },
          payment: {
            method: values.payment,
            amount: product.price * quantity + (values.delivery === "inside" ? 70 : 120)
          },
          items: [{
            product: id,
            name: product.name,
            size: selectedSize.size,
            price: product.price,
            quantity: quantity
          }],
          subtotal: product.price * quantity,
          total: product.price * quantity + (values.delivery === "inside" ? 70 : 120),
          note: values.note
        };

        const response = await axios.post(
          "https://hoktokserver-1.onrender.com/api/orders",
          orderData
        );

        if (response.status === 200 || response.status === 201) {
          toast.success("Order placed successfully!");
          router.push(`/confirmation/${response.data?.orderNo}`);
        }
      } catch (error) {
        console.error("Order submission failed:", error);
        toast.error("Failed to place order. Please try again.");
      }
    },
    validate: values => {
      const errors = {};
      if (!values.name) errors.name = "Required";
      if (!values.phone) errors.phone = "Required";
      if (!values.address) errors.address = "Required";
      if (!selectedSize) errors.size = "Please select a size";
      return errors;
    }
  });

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!product) return <div className="text-center py-20">Product not found</div>;

  const shippingCost = formik.values.delivery === "inside" ? 70 : 120;
  const total = (product.price * quantity) + shippingCost;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 text-sm">
          <li>
            <button onClick={() => router.push("/")} className="text-gray-500 hover:text-gray-700">
              Home
            </button>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-4 h-4 mx-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700 font-medium">Order Now</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Summary */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-4">Your Order</h2>
          
          {/* Image Gallery */}
          <div className="flex flex-col gap-4 mb-6">
            {/* Thumbnails */}
            <div className="flex gap-2 order-2 lg:order-1">
              {product?.images?.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-16 h-16 border-2 rounded-md overflow-hidden transition-all ${
                    selectedImage === index
                      ? "border-cyan-700"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>

            {/* Main Image with Zoom */}
            <div className="relative order-1 lg:order-2">
              <div
                className="relative w-full h-64 sm:h-80 bg-gray-100 rounded-lg overflow-hidden"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setShowZoom(true)}
                onMouseLeave={() => setShowZoom(false)}
              >
                {product?.images?.[selectedImage] ? (
                  <Image
                    src={product.images[selectedImage]}
                    alt={product?.name}
                    fill
                    className="object-contain"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span>No image available</span>
                  </div>
                )}

                {/* Zoom Lens */}
                {showZoom && (
                  <div
                    className="absolute pointer-events-none border border-white/50 bg-white/20"
                    style={{
                      width: "150px",
                      height: "150px",
                      left: `${cursorPosition.x - 75}px`,
                      top: `${cursorPosition.y - 75}px`,
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                )}
              </div>

              {/* Zoom Preview */}
              {showZoom && (
                <div className="hidden lg:block absolute top-0 left-full ml-6 w-80 h-80 border border-gray-200 rounded-lg overflow-hidden shadow-lg bg-white">
                  <div
                    className="w-full h-full bg-no-repeat"
                    style={{
                      backgroundImage: `url(${product?.images?.[selectedImage]})`,
                      backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      backgroundSize: "200%",
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-bold text-lg">{product.name}</h3>
            <p className="text-black">{product.price} TK</p>
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <h3 className="font-semibold text-black mb-3">Select Size:</h3>
            <div className="flex flex-wrap gap-2">
              {product.sizes?.map((size, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSizeSelect(size)}
                  className={`px-4 py-2 border rounded-md transition-colors ${
                    selectedSize?.size === size.size
                      ? "border-cyan-700 bg-cyan-50 text-cyan-700"
                      : size.stock > 0
                      ? "border-gray-300 hover:border-cyan-700 hover:bg-cyan-50 hover:text-cyan-700"
                      : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                  disabled={size.stock === 0}
                >
                  {size.size} {size.stock === 0 && "(Out of stock)"}
                </button>
              ))}
            </div>
            {formik.errors.size && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.size}</p>
            )}
          </div>

          {/* Quantity */}
          {selectedSize && (
            <div className="mb-6">
              <h3 className="font-semibold text-black mb-3">Quantity:</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={decreaseQuantity}
                    className="px-3 py-1 text-lg hover:bg-gray-100"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border-x border-gray-300">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    className="px-3 py-1 text-lg hover:bg-gray-100"
                    disabled={quantity >= selectedSize.stock}
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-black">
                  Available: {selectedSize.stock}
                </span>
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>{product.price * quantity} TK</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping:</span>
              <span>{shippingCost} TK</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-3 pt-3 border-t border-gray-200">
              <span>Total:</span>
              <span>{total} TK</span>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-4">Customer Information</h2>
          
          <form onSubmit={formik.handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="name">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-700"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="phone">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-700"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.phone}
                />
                {formik.touched.phone && formik.errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="address">
                  Delivery Address *
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-700"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.address}
                />
                {formik.touched.address && formik.errors.address && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.address}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Delivery Area</label>
                <div className="flex gap-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="delivery"
                      value="inside"
                      className="text-cyan-700 focus:ring-cyan-700"
                      checked={formik.values.delivery === "inside"}
                      onChange={formik.handleChange}
                    />
                    <span className="ml-2">Inside Dhaka (70 TK)</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="delivery"
                      value="outside"
                      className="text-cyan-700 focus:ring-cyan-700"
                      checked={formik.values.delivery === "outside"}
                      onChange={formik.handleChange}
                    />
                    <span className="ml-2">Outside Dhaka (120 TK)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Payment Method</label>
                <div className="space-y-2">
                  <label className="flex items-center p-3 border border-gray-300 rounded-md">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      className="text-cyan-700 focus:ring-cyan-700"
                      checked={formik.values.payment === "cod"}
                      onChange={formik.handleChange}
                    />
                    <span className="ml-2">Cash on Delivery</span>
                  </label>
                  <label className="flex items-center p-3 border border-gray-300 rounded-md">
                    <input
                      type="radio"
                      name="payment"
                      value="online"
                      className="text-cyan-700 focus:ring-cyan-700"
                      checked={formik.values.payment === "online"}
                      onChange={formik.handleChange}
                    />
                    <span className="ml-2">Online Payment</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="note">
                  Order Notes (Optional)
                </label>
                <textarea
                  id="note"
                  name="note"
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-700"
                  onChange={formik.handleChange}
                  value={formik.values.note}
                  placeholder="Any special instructions?"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-cyan-700 text-white rounded-md hover:bg-cyan-800 font-medium disabled:opacity-50"
                disabled={!selectedSize || formik.isSubmitting}
              >
                {formik.isSubmitting ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}