"use client";
import React from "react";
import Banner from "./Banner";
import About from "./About";
import Services from "./Services";
import Facilities from "./Facilities";
import FAQSection from "./Faq";
import ImageGallery from "../Commons/ImageGallery";
import WhatsApp from "@/components/WhatsApp";
import CustomerReview from "./CustomerReview";

const Homepage = ({ hotels, hotelList }) => {
  return (
    <div className="">
      <Banner hotels={hotels} />
      <ImageGallery />
      <CustomerReview />
      <WhatsApp />
    </div>
  );
};

export default Homepage;
