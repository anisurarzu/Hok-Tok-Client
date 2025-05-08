"use client";
import {
  FiSearch,
  FiShoppingBag,
  FiUser,
  FiMenu,
  FiX,
  FiHome,
} from "react-icons/fi";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CiShoppingCart } from "react-icons/ci";
import { useCart } from "./CartContext";
import { useFormik } from "formik";
import axios from "axios";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { uniqueProductCount } = useCart();
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const handleShirtClick = (e) => {
    e.preventDefault();
    router.push("/category/shirt");
  };
  const formik = useFormik({
    initialValues: {
      searchQuery: "",
    },
    onSubmit: async (values) => {
      try {
        const response = await axios.get(
          `https://hoktokserver-1.onrender.com/api/product/name/${values.searchQuery}`
        );

        if (response.status === 200) {
          setSearchResults(response.data);
          setShowSearchModal(true);
        }
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
        setShowSearchModal(true);
      }
    },
  });
  const logoText = [
    "H",
    " ",
    "O",
    " ",
    "K",
    " ",
    " ",
    "T",
    " ",
    "O",
    " ",
    "K",
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Upper Navigation */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              {/* Logo Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                whileHover={{ rotate: -5 }}
              >
                <Image
                  src="/assets/hocToc.jpg"
                  alt="Hoktok Logo"
                  width={48}
                  height={48}
                  className="ml-2"
                />
              </motion.div>

              {/* Animated Text */}
              <motion.div
                className="flex"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                      delayChildren: 0.2,
                    },
                  },
                }}
              >
                {logoText.map((char, i) => (
                  <motion.span
                    key={i}
                    className="text-2xl font-light"
                    variants={{
                      hidden: {
                        opacity: 0,
                        y: 15,
                        scale: 0.7,
                      },
                      visible: {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: {
                          type: "spring",
                          stiffness: 400,
                        },
                      },
                    }}
                    whileHover={{
                      y: -3,
                      color: "#06b6d4",
                      textShadow: "0 2px 5px rgba(6, 182, 212, 0.3)",
                      transition: { duration: 0.15 },
                    }}
                    style={{
                      minWidth: char === " " ? "0.5em" : "auto",
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.div>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-xl"
              onClick={() => setMobileMenuOpen(true)}
            >
              <FiMenu />
            </button>
            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <form
                onSubmit={formik.handleSubmit}
                className="relative w-full max-w-xl"
              >
                <input
                  type="text"
                  name="searchQuery"
                  placeholder="Search products..."
                  className="w-full py-2.5 pl-4 pr-12 border border-gray-200 rounded-sm bg-gray-50 
                    text-gray-700 placeholder-gray-400
                    focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300
                    transition-all duration-200 text-sm"
                  value={formik.values.searchQuery}
                  onChange={formik.handleChange}
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-full px-4 flex items-center justify-center
                    border-l border-gray-200 bg-gray-600 hover:bg-black
                    transition-colors duration-200"
                >
                  <FiSearch className="text-white" />
                </button>
              </form>
            </div>
            {/* Modal Start */}
            {showSearchModal && (
              <div className="fixed inset-0 z-50 overflow-y-auto">
                {/* Backdrop with fade-in animation */}
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
                  onClick={() => setShowSearchModal(false)}
                ></div>

                {/* Modal container with slide-down animation */}
                <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                  <div
                    className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-headline"
                  >
                    {/* Modal header */}
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="text-xl font-semibold text-gray-800">
                        Search Results
                      </h3>
                      <button
                        onClick={() => setShowSearchModal(false)}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        aria-label="Close"
                      >
                        <FiX className="h-6 w-6" />
                      </button>
                    </div>

                    {/* Modal content */}
                    <div className="px-6 py-4">
                      {searchResults?.products?.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {searchResults.products.map((product) => (
                            <div
                              key={product._id}
                              className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200"
                            >
                              {/* Product Image with hover effect */}
                              <div className="relative h-64 w-full overflow-hidden">
                                <Image
                                  src={
                                    product?.images?.[0] ||
                                    "/placeholder-image.jpg"
                                  }
                                  alt={product.name || "Product image"}
                                  fill
                                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                  priority={false}
                                />
                              </div>

                              {/* Product Info */}
                              <div className="p-4">
                                <h3 className="font-medium text-gray-800 mb-1 hover:text-cyan-700 transition-colors line-clamp-2">
                                  {product.name}
                                </h3>

                                {/* Price section */}
                                <div className="flex items-center gap-2 mb-3">
                                  <p className="text-lg font-semibold text-cyan-700">
                                    {product.price} TK
                                  </p>
                                  {product.prevPrice && (
                                    <p className="text-gray-500 line-through text-sm">
                                      {product.prevPrice} TK
                                    </p>
                                  )}
                                </div>

                                {/* Action button */}
                                <button
                                  className="w-full bg-cyan-700 hover:bg-cyan-800 text-white py-2 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
                                  onClick={() => {
                                    setShowSearchModal(false);
                                    router.push(`/product/${product._id}`);
                                  }}
                                >
                                  <FiShoppingBag className="h-4 w-4" />
                                  View Details
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
                            <FiSearch className="h-6 w-6 text-gray-400" />
                          </div>
                          <h4 className="text-lg font-medium text-gray-900 mb-1">
                            No products found
                          </h4>
                          <p className="text-gray-500">
                            Try different search terms
                          </p>
                          <button
                            onClick={() => setShowSearchModal(false)}
                            className="mt-6 px-4 py-2 bg-cyan-700 text-white rounded-md hover:bg-cyan-800 transition-colors"
                          >
                            Close
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Modal footer (optional) */}
                    {searchResults?.products?.length > 0 && (
                      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-between items-center">
                        <p className="text-sm text-gray-500">
                          Showing {searchResults.products.length} results
                        </p>
                        <button
                          onClick={() => setShowSearchModal(false)}
                          className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
                        >
                          Close
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {/* Modal End */}

            {/* Icons */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/cart"
                className="relative p-2 rounded-md bg-cyan-700 hover:bg-cyan-500 text-white transition-all duration-200"
              >
                <CiShoppingCart className="text-xl" />
                {uniqueProductCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {uniqueProductCount > 9 ? "9+" : uniqueProductCount}
                  </span>
                )}
              </Link>

              {/* <button className="p-2 rounded-md bg-cyan-700 hover:bg-cyan-500 text-white transition-all duration-200">
                <FiUser className="text-xl" />
              </button> */}
            </div>
          </div>
        </div>
      </div>

      {/* Lower Navigation - Cyan Background */}
      <div className="hidden md:block bg-cyan-700">
        <div className="container mx-auto px-4 overflow-x-auto">
          <div className="flex items-center justify-between h-12 whitespace-nowrap">
            {/* Shop Now with Icon */}
            <Link
              href="/"
              className="flex items-center text-sm font-medium uppercase text-white hover:text-white pr-6"
            >
              <FiHome className="mr-2 text-lg" />
              Home
            </Link>

            {/* Category Links */}
            <div className="flex items-center gap-6">
              <Link
                href="/category/shirt"
                className="text-xs uppercase text-white hover:text-white"
                onClick={handleShirtClick}
              >
                SHIRT
              </Link>

              <Link
                href="/category/denim-jacket"
                className="text-xs uppercase text-white hover:text-white"
              >
                DENIM JACKET
              </Link>
              <Link
                href="/category/solid-shirt"
                className="text-xs uppercase text-white hover:text-white"
              >
                SOLID SHIRT
              </Link>
              <Link
                href="/category/chek-shirt"
                className="text-xs uppercase text-white hover:text-white"
              >
                CHEK SHIRT
              </Link>
              <Link
                href="/category/denim-shirt"
                className="text-xs uppercase text-white hover:text-white"
              >
                DENIM SHIRT
              </Link>
              <Link
                href="/category/pajama"
                className="text-xs uppercase text-white hover:text-white"
              >
                PAJAMA
              </Link>
              <Link
                href="/category/panjabi"
                className="text-xs uppercase text-white hover:text-white"
              >
                PANJABI
              </Link>
            </div>

            {/* Phone Number */}
            <div className="text-xs text-white pl-6">01580362188</div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
          <div className="container mx-auto px-4 py-4">
            {/* Mobile Menu Header */}
            <div className="flex justify-between items-center mb-8">
              <div className="text-2xl font-light tracking-[0.25em]">
                H O K T O K
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-md bg-gray-100"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            {/* Mobile Search */}
            <div className="relative mb-8">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full py-3 pl-4 pr-12 border border-gray-200 rounded-sm bg-gray-50 
                  text-gray-700 placeholder-gray-400
                  focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300
                  transition-all duration-200 text-sm"
              />
              <button
                className="absolute right-0 top-0 h-full px-4 flex items-center justify-center
                  border-l border-gray-200 bg-gray-600 hover:bg-black
                  transition-colors duration-200"
              >
                <FiSearch className="text-white" />
              </button>
            </div>

            {/* Mobile Navigation Links - Cyan Background Section */}
            <div className="bg-cyan-600 rounded-lg mb-6">
              <nav className="flex flex-col">
                <Link
                  href="/"
                  className="flex items-center py-3 px-4 text-sm uppercase font-medium text-white border-b border-cyan-500"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiHome className="mr-2 text-lg" />
                  Home
                </Link>
                <Link
                  href="/category/shirt"
                  className="py-3 px-4 text-sm uppercase text-white border-b border-cyan-500"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  SHIRT
                </Link>
                <Link
                  href="/category/denim-jacket"
                  className="py-3 px-4 text-sm uppercase text-white border-b border-cyan-500"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  DENIM JACKET
                </Link>
                <Link
                  href="/category/solid-shirt"
                  className="py-3 px-4 text-sm uppercase text-white border-b border-cyan-500"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  SOLID SHIRT
                </Link>
                <Link
                  href="/category/check-shirt"
                  className="py-3 px-4 text-sm uppercase text-white border-b border-cyan-500"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  CHECK SHIRT
                </Link>
                <Link
                  href="/category/denim-shirt"
                  className="py-3 px-4 text-sm uppercase text-white border-b border-cyan-500"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  DENIM SHIRT
                </Link>
                <Link
                  href="/category/pajama"
                  className="py-3 px-4 text-sm uppercase text-white border-b border-cyan-500"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  PAJAMA
                </Link>
                <Link
                  href="/category/panjabi"
                  className="py-3 px-4 text-sm uppercase text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  PANJABI
                </Link>
              </nav>
            </div>

            {/* Mobile Contact and Icons */}
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <div className="text-sm text-gray-700">01580362188</div>
              <div className="flex items-center gap-4">
                <Link
                  href="/cart"
                  className="relative p-2 rounded-md bg-cyan-700 hover:bg-cyan-500 text-white transition-all duration-200"
                >
                  <CiShoppingCart className="text-xl" />
                  {uniqueProductCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {uniqueProductCount > 9 ? "9+" : uniqueProductCount}
                    </span>
                  )}
                </Link>
                {/* <button className="p-2 rounded-md bg-cyan-700 text-white">
                  <FiUser className="text-xl" />
                </button> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
