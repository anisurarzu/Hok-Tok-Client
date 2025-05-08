"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { notification, Spin } from "antd";
import dynamic from "next/dynamic";
import { LoadingOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import coreAxios from "../../../utils/axiosInstance";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      username: "",
      email: "",
      phoneNumber: "",
      password: "",
      plainPassword: "",
      address: "",
      gender: "",
    },
    onSubmit: (values) => {
      handleSubmit(values);
    },
    validateOnChange: false,
    enableReinitialize: true,
  });
  const handleSubmit = async (values) => {
    setLoading(true);
    const customValue = {
      ...values,
      plainPassword: values?.password,
      role: {
        label: "user",
        value: "user",
      },
      image: "",
      loginID:values?.username,
      loginHistory: [],
    };
    // return console.log("customValue",customValue);

    try {
      const response = await coreAxios.post("/api/auth/register", customValue);
      if (response.status === 200 || response.status === 201) {
        // notification.success({
        //   message: "Registration Successful",
        //   description: "You have successfully registered. Please log in.",
        //   placement: "topRight",
        //   duration: 3,
        // });
        toast.success("You have successfully registered. Please log in.")
        console.log("Response Data:", response.data);
        setLoading(false);
        router.push("/login");
      } else {
        toast.error("Something went wrong");
        setLoading(false);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
        setLoading(false);
      }
    }
  };
  const whiteSpinner = (
    <LoadingOutlined style={{ fontSize: 20, color: "white" }} spin />
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-500 relative">
      <div className="absolute inset-0 bg-[url('/assets/images/banner/banner3.jpeg')] bg-cover bg-center opacity-70"></div>
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-lg relative z-10">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Register
        </h2>
        <form className="mt-6" onSubmit={formik.handleSubmit}>
          {/* Username & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                placeholder="Enter username"
                {...formik.getFieldProps("username")}
              />
              {formik.touched.username && formik.errors.username && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.username}
                </p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                placeholder="Enter email"
                {...formik.getFieldProps("email")}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.email}
                </p>
              )}
            </div>
          </div>

          {/* Phone & Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                placeholder="Enter phone number"
                {...formik.getFieldProps("phoneNumber")}
              />
              {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.phoneNumber}
                </p>
              )}
            </div>
            <div className="relative">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                placeholder="Enter password"
                {...formik.getFieldProps("password")}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center mt-6"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5 text-gray-500" />
                ) : (
                  <FaEye className="h-5 w-5 text-gray-500" />
                )}
              </button>
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.password}
                </p>
              )}
            </div>
          </div>

          {/* Confirm Password & Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Address Field (existing) */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Address
              </label>
              <textarea
                name="currentAddress"
                rows="3"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 resize-none"
                placeholder="Enter address"
                {...formik.getFieldProps("currentAddress")}
              ></textarea>
              {formik.touched.currentAddress &&
                formik.errors.currentAddress && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.currentAddress}
                  </p>
                )}
            </div>

            {/* New Gender Select Field */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Gender
              </label>
              <select
                name="gender"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                {...formik.getFieldProps("gender")}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {formik.touched.gender && formik.errors.gender && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.gender}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 transition flex justify-center items-center"
            disabled={loading} // Disable button when loading
          >
            {loading ? (
              <Spin indicator={whiteSpinner} className="mr-3" /> // Ant Design Spin component
            ) : (
              "Register"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
