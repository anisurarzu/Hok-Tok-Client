"use client";
import React, { useEffect, useState } from "react";
import { Carousel, Image, Spin } from "antd";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import Spinner from "../loader/Spinner";

const ProductGallery = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          "https://hoktokserver-1.onrender.com/api/product"
        );
        if (res?.status === 200) {
          setProducts(res?.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);

  const renderProductCard = (product) => (
    <div className="px-2 h-full">
      <motion.div
        className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-white h-full flex flex-col"
        whileHover={{ scale: 1.03, zIndex: 10 }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full aspect-square overflow-hidden">
          <Link href={`/product/${product._id}`}>
            <Image
              src={product?.images?.[0] || "/placeholder-image.jpg"}
              alt={product.name || "Product image"}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              preview={false}
              width="100%"
              height="100%"
            />
          </Link>
        </div>

        <div className="p-3 flex-grow flex flex-col">
          <h3 className="font-bold text-base mb-1 line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mb-3">
            <p className="text-gray-700 font-medium">{product.price} TK</p>
            {product.prevPrice && (
              <p className="text-gray-500 line-through text-sm">
                {product.prevPrice} TK
              </p>
            )}
          </div>

          <div className="flex gap-2 mt-auto">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1"
            >
              <button
                className="w-full bg-gray-100 text-cyan-700 py-2 rounded hover:bg-gray-200 transition-colors border border-gray-200"
                onClick={() => router.push(`/product/${product._id}`)}
              >
                View Details
              </button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1"
            >
              <button
                className="w-full bg-cyan-700 text-white py-2 rounded hover:bg-cyan-800 transition-colors"
                onClick={() => router.push(`/order/${product._id}`)}
              >
                Order Now
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="w-full bg-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* BEST SELLING PRODUCTS SECTION */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">
            BEST SELLING PRODUCTS
          </h2>
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
            <Carousel
              autoplay
              autoplaySpeed={3000}
              dots={false}
              slidesToShow={5}
              responsive={[
                {
                  breakpoint: 1280,
                  settings: {
                    slidesToShow: 4,
                  },
                },
                {
                  breakpoint: 1024,
                  settings: {
                    slidesToShow: 3,
                  },
                },
                {
                  breakpoint: 768,
                  settings: {
                    slidesToShow: 2,
                  },
                },
                {
                  breakpoint: 480,
                  settings: {
                    slidesToShow: 1,
                  },
                },
              ]}
            >
              {products.map((product) => renderProductCard(product))}
            </Carousel>
          )}
        </div>

        {/* NEW ARRIVAL PRODUCTS SECTION */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-center">
            NEW ARRIVAL PRODUCTS
          </h2>
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
            <Carousel
              autoplay
              autoplaySpeed={3000}
              dots={false}
              slidesToShow={5}
              responsive={[
                {
                  breakpoint: 1280,
                  settings: {
                    slidesToShow: 4,
                  },
                },
                {
                  breakpoint: 1024,
                  settings: {
                    slidesToShow: 3,
                  },
                },
                {
                  breakpoint: 768,
                  settings: {
                    slidesToShow: 2,
                  },
                },
                {
                  breakpoint: 480,
                  settings: {
                    slidesToShow: 1,
                  },
                },
              ]}
            >
              {products.map((product) => renderProductCard(product))}
            </Carousel>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductGallery;
