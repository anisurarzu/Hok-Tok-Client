"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/components/shared/CartContext";
import axios from "axios";

export default function ProductPage() {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState("description");
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState([]);
  console.log("product--------->", product);
  const { addToCart } = useCart();
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          "https://hoktokserver-1.onrender.com/api/product"
        );
        if (res?.status === 200) {
          console.log(res.data);

          const filteredProduct = res?.data.find(
            (product) => product._id === id
          );

          if (filteredProduct) {
            setProduct(filteredProduct);
          } else {
            setProducts(res.data);
          }
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, []);
  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
    setCursorPosition({ x: e.clientX, y: e.clientY });
  };

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

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size first");
      return;
    }
    addToCart(product, selectedSize, quantity);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 text-sm">
          <li>
            <a href="#" className="text-gray-500 hover:text-gray-700">
              Home
            </a>
          </li>
          {product?.category?.split(">").map((item, index) => (
            <li key={index}>
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
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  {item.trim()}
                </a>
              </div>
            </li>
          ))}
          <li aria-current="page">
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
              <span className="text-gray-700 font-medium">
                {product.subCategory}
              </span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Product Gallery Section */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Thumbnails */}
        <div className="flex lg:flex-col order-2 lg:order-1 gap-2">
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

        {/* Middle Column - Main Image with Zoom */}
        <div className="relative flex-1 order-1 lg:order-2">
          <div
            className="relative w-full h-80 sm:h-96 lg:h-[500px] bg-gray-100 rounded-lg overflow-hidden"
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
            <div className="hidden lg:block absolute top-0 left-full ml-6 w-96 h-96 border border-gray-200 rounded-lg overflow-hidden shadow-lg bg-white">
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

        {/* Right Column - Product Info */}
        <div className="lg:w-80 xl:w-96 order-3">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {product?.name}
          </h1>

          <div className="flex items-center mb-4">
            <button className="text-gray-500 hover:text-cyan-700">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
            </button>
          </div>

          <div className="mb-4">
            <span className="text-gray-500">No Review Yet</span>
          </div>

          <div className="mb-6">
            <span className="text-2xl font-bold text-gray-900">
              Tk. {product?.price}
            </span>
            <span className="text-lg text-gray-500 line-through ml-2">
              Tk. {product?.prevPrice}
            </span>
          </div>

          {/* Start from here */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Size:</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {product?.sizes?.map((size, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSizeSelect(size)}
                  className={`px-4 py-2 border rounded-md transition-colors ${
                    selectedSize?.size === size?.size
                      ? "border-cyan-700 bg-cyan-50 text-cyan-700"
                      : size?.stock > 0
                      ? "border-gray-300 hover:border-cyan-700 hover:bg-cyan-50 hover:text-cyan-700"
                      : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                  disabled={size.stock === 0}
                >
                  {size?.size}
                </button>
              ))}
            </div>

            {/* Quantity Display - Only shows when size is selected */}
            {selectedSize && selectedSize?.stock > 0 && (
              <div className="flex items-center gap-3">
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
                    disabled={quantity >= selectedSize?.stock}
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  + Stock Quantity: {selectedSize?.stock}
                </span>
              </div>
            )}

            {/* Out of stock message */}
            {selectedSize && selectedSize?.stock === 0 && (
              <p className="text-sm text-red-500">Out of stock</p>
            )}
          </div>

          {/* End Here */}

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize || selectedSize?.stock === 0}
              className={`px-6 py-3 border border-cyan-700 rounded-md transition-colors ${
                !selectedSize || selectedSize?.stock === 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "text-cyan-700 hover:bg-cyan-700 hover:text-white"
              }`}
            >
              Add To Cart
            </button>
          </div>
        </div>
      </div>

      {/* Description & Reviews Section */}
      <div className="mt-16 border-t border-gray-200 pt-8">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "description"
                ? "text-cyan-700 border-b-2 border-cyan-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("description")}
          >
            Description
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "reviews"
                ? "text-cyan-700 border-b-2 border-cyan-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews (0)
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "description" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Description</h3>
              <p className="text-gray-700">{product?.description}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">
                Size Chart - In Inches (Expected Deviation is less than 3%)
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border-b border-gray-200 text-left">
                        Size
                      </th>
                      <th className="py-2 px-4 border-b border-gray-200 text-left">
                        Chest
                      </th>
                      <th className="py-2 px-4 border-b border-gray-200 text-left">
                        Length
                      </th>
                      <th className="py-2 px-4 border-b border-gray-200 text-left">
                        Sleeve
                      </th>
                      <th className="py-2 px-4 border-b border-gray-200 text-left">
                        Shoulder
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {product?.sizes?.map((row, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-gray-50" : ""}
                      >
                        <td className="py-2 px-4 border-b border-gray-200">
                          {row.size}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          {row.chest}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          {row.length}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          {row.sleeve}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          {row.shoulder}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No reviews yet</p>
              <button className="px-6 py-2 bg-cyan-700 text-white rounded-md hover:bg-cyan-800 transition-colors">
                Write a Review
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Similar Products Section */}
      <div className="mt-16">
        <h2 className="text-xl font-bold mb-6">Similar Products</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {product?.similarProducts?.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-square bg-gray-100 relative">
                <Image
                  src={item?.img} // Replace with actual image
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-3">
                <h3 className="font-medium text-gray-900 mb-1">{item.title}</h3>
                <div className="flex items-center">
                  <span className="font-bold">Tk. {item.price}</span>
                  <span className="text-gray-500 text-sm line-through ml-2">
                    Tk. {item.originalPrice}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mt-1">No Review Yet</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
