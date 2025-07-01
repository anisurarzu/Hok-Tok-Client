"use client";
import React, { useEffect, useState } from "react";
import { Carousel } from "antd";
import { motion } from "framer-motion";
import axios from "axios";

const Banner = ({ hotels }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          "https://hoktokserver-1.onrender.com/api/sliders"
        );
        if (res?.status === 200) {
          setProducts(res?.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProduct();
  }, []);

  return (
    <div className="w-full">
      <Carousel autoplay autoplaySpeed={6000} dots={true}>
        {products.map((banner, index) => (
          <div key={index}>
            <motion.div
              className="relative w-full h-[80vh] bg-black flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <img
                src={banner.images?.[0]}
                alt={banner.title}
                className="max-h-full max-w-full object-contain"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white px-4 text-center">
                <div className="space-y-4 max-w-4xl mx-auto">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                    {banner.title}
                  </h1>
                  <p className="text-sm sm:text-base lg:text-lg">
                    {banner.description}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Banner;
