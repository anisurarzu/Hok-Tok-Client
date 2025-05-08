"use client";
import React, { useEffect, useState } from "react";
import { Carousel } from "antd";
import { motion } from "framer-motion";
import axios from "axios";

const Banner = ({ hotels }) => {
  const [products, setProducts] = useState([]);
  const banners = [
    {
      title: "New Season Collection",
      description:
        "Discover the latest trends in fashion. Shop now for exclusive styles that define you.",
      bgImage:
        "https://img.freepik.com/free-photo/shopping-concept-close-up-portrait-young-beautiful-attractive-redhair-girl-smiling-looking-camera_1258-118763.jpg",
    },
    {
      title: "Denim Revolution",
      description:
        "Premium quality denim that combines comfort with cutting-edge style.",
      bgImage:
        "https://img.freepik.com/premium-photo/low-angle-view-woman-standing-against-blue-background_1048944-20095767.jpg",
    },
    {
      title: "Elevate Your Wardrobe",
      description:
        "Timeless pieces for the modern wardrobe. Quality fabrics, perfect fits.",
      bgImage:
        "https://img.freepik.com/free-photo/shopping-concept-close-up-portrait-young-beautiful-attractive-redhair-girl-smiling-looking-camera_1258-126800.jpg",
    },
  ];
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
      } finally {
        console.log("somthing wrong");
      }
    };

    fetchProduct();
  }, []);

  console.log("products", products);

  return (
    <div className="w-full">
      {/* Carousel Section */}
      <Carousel autoplay autoplaySpeed={6000} dots={true}>
        {products.map((banner, index) => (
          <div key={index}>
            <motion.div
              className="h-[60vh] sm:h-[65vh] lg:h-[70vh] w-full flex items-center justify-center text-white relative"
              style={{
                backgroundImage: `linear-gradient(45deg, rgba(0,0,0,0.6), rgba(0,0,0,0.3)), url(${banner.images?.[0]})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <div className="text-center space-y-4 px-4 max-w-4xl w-full">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                  {banner.title}
                </h1>
                <p className="text-sm sm:text-base lg:text-lg">
                  {banner.description}
                </p>
                {/* <div className="space-x-4 flex justify-center">
                  <button className="bg-green-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-green-600 transition">
                    Explore Products
                  </button>
                  <button className="bg-transparent border border-white text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-gray-800 transition">
                    View Deals
                  </button>
                </div> */}
              </div>
            </motion.div>
          </div>
        ))}
      </Carousel>

      {/* Search Booking Section */}
      {/* <SearchBookingSection2 hotels={hotels} /> */}
    </div>
  );
};

export default Banner;
