"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Spin } from "antd";
import { motion } from "framer-motion";
import Spinner from "@/components/loader/Spinner";

export default function SolidShirt() {
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [sortOption, setSortOption] = useState("featured");
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  console.log("Price Range", priceRange);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          "https://hoktokserver-1.onrender.com/api/product"
        );
        if (res?.status === 200) {
          const filteredProducts = res?.data.filter(
            (product) => product.subCategory === "SOLID Shirt"
          );
          setProducts(filteredProducts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, []);

  const handleSizeToggle = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  // Loading component
  const LoadingSpinner = () => (
    <div className="w-full flex justify-center items-center py-20">
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Spin
          size="large"
          indicator={
            <div className="w-12 h-12 border-4 border-cyan-600 border-t-transparent rounded-full" />
          }
        />
      </motion.div>
    </div>
  );

  // Skeleton loader for product grid
  const ProductSkeleton = () => (
    <div className="bg-white rounded shadow-sm overflow-hidden">
      <div className="relative h-64 w-full bg-gray-200 animate-pulse"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        <div className="h-8 bg-gray-200 rounded mt-4 animate-pulse"></div>
      </div>
    </div>
  );
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  // Fetch products by price range
  const fetchProductsByPrice = async (min, max) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://hoktokserver-1.onrender.com/api/product/price/${min}/${max}`
      );
      if (response?.status === 200) {
        const filteredProducts = response?.data.filter(
          (product) => product.subCategory === "SOLID Shirt"
        );
        setProducts(filteredProducts);
      }
    } catch (error) {
      console.error("Error fetching products by price:", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced version of the fetch function
  const debouncedFetch = debounce(fetchProductsByPrice, 500);

  // Handle price range change
  const handlePriceChange = (e) => {
    const newMax = parseInt(e.target.value);
    setPriceRange([priceRange[0], newMax]);
    debouncedFetch(priceRange[0], newMax);
  };

  // Initial load
  useEffect(() => {
    fetchProductsByPrice(priceRange[0], priceRange[1]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="text-sm text-gray-600">
          <Link href="/" className="hover:text-cyan-700">
            Home
          </Link>
          {" > "}
          <Link href="/category" className="hover:text-cyan-700">
            Category
          </Link>
          {" > "}
          <span className="text-gray-800 font-medium">Solid SHIRT</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4">
        {loading ? (
          <Spinner
            size="xl"
            primaryColor="text-blue-400"
            secondaryColor="text-purple-400"
            speed="normal"
            style="cosmic"
            text="Loading...."
            className="my-8"
          />
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters Sidebar */}
            <div className="w-full md:w-1/4 bg-white p-6 rounded shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-md font-medium mb-3">Price</h3>
                <div className="flex justify-between mb-2">
                  <span>Min: {priceRange[0].toLocaleString()}</span>
                  <span>Max: {priceRange[1].toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="500"
                  value={priceRange[1]}
                  onChange={handlePriceChange}
                  className="w-full"
                />
              </div>

              {/* Size */}
              <div className="mb-6">
                <h3 className="text-md font-medium mb-3">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {["S", "M", "L", "XL"].map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSizeToggle(size)}
                      className={`px-3 py-1 border rounded-full text-sm ${
                        selectedSizes.includes(size)
                          ? "bg-cyan-700 text-white border-cyan-700"
                          : "bg-white text-gray-700 border-gray-300 hover:border-cyan-700"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Products Section */}
            <div className="w-full md:w-3/4">
              {/* Header */}
              <div className="bg-white p-4 rounded shadow-sm mb-4 flex justify-between items-center">
                <h1 className="text-xl font-semibold">Solid SHIRT</h1>
                <div className="text-sm text-gray-600">
                  {products.length} items found in SOLID SHIRT
                </div>
              </div>

              {/* Sort Options */}
              <div className="bg-white p-4 rounded shadow-sm mb-4 flex justify-end">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-1 text-sm"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading
                  ? Array(8)
                      .fill(0)
                      .map((_, index) => <ProductSkeleton key={index} />)
                  : products?.map((product) => (
                      <div
                        key={product?._id}
                        className="bg-white rounded shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                      >
                        {/* Product Image */}
                        <div className="relative h-64 w-full">
                          <Link href={`/product/${product._id}`}>
                            <Image
                              src={
                                product?.images?.[0] || "/placeholder-image.jpg"
                              }
                              alt={product.name || "Product image"}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                            />
                          </Link>
                        </div>

                        {/* Product Info */}
                        <div className="p-4">
                          <h3 className="font-medium text-gray-800 mb-1">
                            {product.name}
                          </h3>
                          <div className="flex items-center gap-2 mb-3">
                            <p className="text-gray-700 font-medium">
                              {product.price} TK
                            </p>
                            {product.prevPrice && (
                              <p className="text-gray-500 line-through text-sm">
                                {product.prevPrice} TK
                              </p>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 mb-3">
                            No Review Yet
                          </div>
                          <div className="flex gap-2 mt-auto">
                            <div className="flex-1">
                              <button
                                className="w-full bg-cyan-700 text-white py-2 rounded hover:bg-cyan-800 transition-colors"
                                onClick={() =>
                                  router.push(`/product/${product._id}`)
                                }
                              >
                                View Details
                              </button>
                            </div>
                            <div className="flex-1">
                              <button
                                className="w-full bg-cyan-700 text-white py-2 rounded hover:bg-cyan-800 transition-colors"
                                onClick={() =>
                                  router.push(`/order/${product._id}`)
                                }
                              >
                                Order Now
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
