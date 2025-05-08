"use client";
import React, { useState } from "react";
import axios from "axios";
import { DatePicker, Select, Button, Modal, Spin, notification } from "antd";
import { motion } from "framer-motion";
import coreAxios from "../../../utils/axiosInstance";
import UserBookingForm from "./UserBookingForm";

const { Option } = Select;

export default function SearchBookingSection2({ hotels }) {
  const [hotelList, setHotelList] = useState("");
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookingInfo, setBookingInfo] = useState([]);

  // Demo images for rooms
  const demoImages = [
    "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?auto=compress&cs=tinysrgb&w=600",
  ];

  // API Call to Fetch Available Rooms
  // API Call to Fetch Available Rooms
  const fetchAvailableRooms = async () => {
    if (!hotelList || !checkInDate || !checkOutDate) {
      notification.error({
        message: "Missing Fields",
        description: "Please select a hotel and dates before searching.",
        placement: "topRight",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await coreAxios.post("hotel/search", {
        hotelID: hotelList,
        checkInDate: checkInDate.format("YYYY-MM-DD"),
        checkOutDate: checkOutDate.format("YYYY-MM-DD"),
      });

      if (
        response.data.availableRoomsByCategory &&
        response.data.availableRoomsByCategory.length > 0
      ) {
        setSearchResult(response.data.availableRoomsByCategory);
        setIsModalVisible(true);
      } else {
        notification.info({
          message: "No Rooms Found",
          description:
            "No available rooms found for the selected hotel and dates.",
          placement: "topRight",
        });
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
      notification.error({
        message: "Error",
        description: "Failed to fetch available rooms. Please try again later.",
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };
  // Reset filters when modal is closed
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setIsModalVisible2(false);
    setHotelList("");
    setCheckInDate(null);
    setCheckOutDate(null);
    setSearchResult(null);
  };

  return (
    <div className="w-full flex justify-center px-4 md:px-2 py-8 bg-white bg-opacity-30">
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center items-center bg-white bg-opacity-90 rounded-lg p-4 max-w-4xl w-full shadow-lg">
        {/* Date Pickers */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <DatePicker
            className="p-2 text-[#52C0C2] text-sm rounded-md w-full sm:w-[210px]"
            placeholder="Check-in"
            value={checkInDate}
            onChange={(date) => setCheckInDate(date)}
          />
          <DatePicker
            className="p-2 text-[#52C0C2] text-sm rounded-md w-full sm:w-[210px]"
            placeholder="Check-out"
            value={checkOutDate}
            onChange={(date) => setCheckOutDate(date)}
          />
        </div>

        {/* Hotel Dropdown */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full sm:w-auto flex-1">
          <Select
            className="no-border-select rounded-md p-2 h-[38px] w-full sm:w-[210px]"
            value={hotelList || undefined}
            onChange={(value) => setHotelList(value)}
            placeholder="Select Hotel">
            {hotels?.map((hotel) => (
              <Option key={hotel.hotelID} value={hotel.hotelID}>
                {hotel.hotelName}
              </Option>
            ))}
          </Select>
        </motion.div>

        {/* Search Button */}
        <Button
          type="primary"
          onClick={fetchAvailableRooms}
          className="text-sm p-2 h-[38px] w-full sm:w-[150px] rounded-2xl bg-teal-600 text-white border-none shadow-md transition-all duration-300 hover:scale-105">
          {loading ? <Spin size="small" /> : "Search"}
        </Button>
      </div>

      {/* Modal for Search Results */}
      <Modal
        title="Available Rooms"
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        centered
        width={800}
        bodyStyle={{ padding: "24px" }}
        className="rounded-lg">
        {searchResult ? (
          searchResult.length > 0 ? (
            searchResult.map((category) => (
              <motion.div
                key={category.categoryName}
                className="mb-4 p-4 bg-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}>
                <h3 className="text-lg font-semibold text-[#52C0C2]">
                  {category.categoryName}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                  {category.availableRooms.length > 0 ? (
                    category.availableRooms.map((room, index) => (
                      <div
                        key={index}
                        className="p-3 bg-white rounded-lg shadow-sm text-center">
                        <img
                          src={demoImages[index % demoImages.length]}
                          alt="Room"
                          className="w-full h-32 object-cover rounded-md mb-2"
                        />
                        <p className="font-medium text-gray-700">{room.name}</p>
                        <p className="text-xs text-gray-500">
                          Status: {room.status}
                        </p>
                        <Button
                          onClick={() => {
                            // Calculate the number of nights
                            const numberOfNights = checkOutDate.diff(
                              checkInDate,
                              "days"
                            );

                            // Set the booking information
                            setBookingInfo({
                              hotelID: hotelList,
                              hotelName:
                                hotels.find(
                                  (hotel) => hotel.hotelID === hotelList
                                )?.hotelName || "Unknown Hotel",
                              checkInDate: checkInDate.format("YYYY-MM-DD"),
                              checkOutDate: checkOutDate.format("YYYY-MM-DD"),
                              numberOfNights: numberOfNights,
                              roomCategory: category.categoryName,
                              roomNo: room.name, // Assuming `room.roomNo` is available in the room object
                            });

                            // Open the booking modal
                            setIsModalVisible2(true);
                          }}
                          type="primary"
                          className="bg-[#71D2D3] text-white border-none rounded-lg mt-2">
                          Book Now
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-600">
                      No available rooms
                    </p>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-gray-600">
              No available rooms found.
            </p>
          )
        ) : (
          <p className="text-center text-gray-600">Fetching data...</p>
        )}
      </Modal>
      <Modal
        title=""
        open={isModalVisible2}
        onCancel={handleCloseModal}
        footer={null}
        centered
        width={800}
        bodyStyle={{ padding: "24px" }}
        className="rounded-lg">
        <UserBookingForm
          bookingInfo={bookingInfo}
          handleCloseModal={handleCloseModal}
        />
      </Modal>
    </div>
  );
}
