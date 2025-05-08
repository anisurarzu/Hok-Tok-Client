"use client";
import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

const AboutUs = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          "https://hoktokserver-1.onrender.com/api/stories"
        );
        if (res?.status === 200) {
          setProducts(res?.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        console.log("somthing wrong");
      }
    };
    fetchProduct();
  }, []);

  console.log("products", products);
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header with animated underline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Story</h2>
          <div className="relative inline-block">
            <span className="relative z-10 text-lg text-gray-600">
              {products?.[0]?.title}
            </span>
          </div>
        </motion.div>

        {/* Main content with image and text */}
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-20">
          {/* Image with parallax effect */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 relative overflow-hidden rounded-xl shadow-xl"
          >
            <div className="aspect-w-16 aspect-h-9">
              <Image
                src="https://www.interiorconceptsbd.com/images/shop-interior/cloth-shop-banner.jpg" // Replace with your image
                alt="HOKTOK showroom"
                width={800}
                height={500}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </motion.div>

          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2"
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            {products?.[0]?.subtitle}
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
            {products?.[0]?.description}
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
            {products?.[0]?.otherDescription}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
