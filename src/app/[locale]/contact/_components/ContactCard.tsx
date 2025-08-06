"use client";

import type React from "react";
import { Send, MapPin, Phone, Mail } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

type ContactInfo = {
  address: string;
  phone: string[];
  email: string;
};

const INITIAL_FORM_STATE: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  message: "",
};

const ContactPage: React.FC = () => {
  const t = useTranslations("contact");

  const CONTACT_INFO: ContactInfo = {
    address: t("address"),
    phone: [t("phoneNumber1"), t("phoneNumber2")],
    email: t("emailAddress"),
  };

  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setResult("Sending....");
    const formDataToSend = new FormData();
    formDataToSend.append("firstName", formData.firstName);
    formDataToSend.append("lastName", formData.lastName);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("message", formData.message);

    if (process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY) {
      formDataToSend.append(
        "access_key",
        process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY
      );
    } else {
      setResult(
        "Access key is not defined. Please check your environment variables."
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        setResult("Form Submitted Successfully");
        setFormData(INITIAL_FORM_STATE);
      } else {
        setResult(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setResult("An error occurred. Please try again later.");
      console.error("Form submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen py-8 md:py-10 bg-blue-100">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.3) 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        ></div>
      </div>

      <div className="relative z-10 container mx-auto px-3 sm:px-6 lg:px-8 pt-12 md:pt-24 lg:pt-36 pb-6 md:pb-28">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 md:gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Card className="bg-white py-0 shadow-lg border-0 h-full">
                <CardHeader className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-t-lg">
                  <CardTitle className="text-lg md:text-2xl py-2 md:py-4 font-normal">
                    {t("contactInfo")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-8 space-y-4 md:space-y-8">
                  <div className="flex items-start space-x-3 md:space-x-4">
                    <div className="bg-blue-100 p-2 md:p-3 rounded-full flex-shrink-0">
                      <MapPin
                        size={20}
                        className="md:w-6 md:h-6 text-blue-500"
                      />
                    </div>
                    <div>
                      <h3 className="text-blue-900 font-semibold mb-1 md:mb-2 text-base md:text-lg">
                        {t("ourOffice")}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                        {CONTACT_INFO.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 md:space-x-4">
                    <div className="bg-blue-100 p-2 md:p-3 rounded-full flex-shrink-0">
                      <Phone
                        size={20}
                        className="md:w-6 md:h-6 text-blue-500"
                      />
                    </div>
                    <div>
                      <h3 className="text-blue-900 font-semibold mb-1 md:mb-2 text-base md:text-lg">
                        {t("phone")}
                      </h3>
                      <div className="space-y-1">
                        {CONTACT_INFO.phone.map((number) => (
                          <a
                            key={number}
                            href={`tel:${number.replace(/[^0-9+]/g, "")}`}
                            className="block text-gray-600 hover:text-blue-500 transition-colors text-sm md:text-base"
                          >
                            {number}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 md:space-x-4">
                    <div className="bg-blue-100 p-2 md:p-3 rounded-full flex-shrink-0">
                      <Mail size={20} className="md:w-6 md:h-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-blue-900 font-semibold mb-1 md:mb-2 text-base md:text-lg">
                        {t("email")}
                      </h3>
                      <a
                        href={`mailto:${CONTACT_INFO.email}`}
                        className="text-gray-600 hover:text-blue-500 transition-colors text-sm md:text-base"
                      >
                        {CONTACT_INFO.email}
                      </a>
                    </div>
                  </div>

                  <div className="pt-4 md:pt-6 border-t border-gray-200">
                    <h3 className="text-blue-900 font-semibold mb-3 md:mb-4 text-base md:text-lg">
                      {t("followUs")}
                    </h3>
                    <div className="flex space-x-2 md:space-x-3">
                      <motion.a
                        href="https://www.facebook.com/srm.building"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 md:p-3 rounded-full transition-colors"
                      >
                        <svg
                          className="w-4 h-4 md:w-5 md:h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </motion.a>
                      <motion.a
                        href="https://instagram.com/SBuilding.ge"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 md:p-3 rounded-full transition-colors"
                      >
                        <svg
                          className="w-4 h-4 md:w-5 md:h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      </motion.a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-3"
            >
              <Card className="bg-white shadow-lg border-0 h-full">
                <CardHeader className="px-4 md:px-8 py-3 md:py-4">
                  <CardTitle className="text-lg md:text-2xl font-normal text-blue-900">
                    {t("contactUs")}
                  </CardTitle>
                  <p className="text-gray-600 text-sm md:text-base mt-2">
                    {t("sendUsDescribe")}
                  </p>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                  <CardContent className="p-4 md:p-8 pt-0 space-y-4 md:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div className="space-y-1 md:space-y-2">
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-10 md:h-12 text-sm md:text-base"
                          placeholder={`${t("firstName")}...`}
                        />
                      </div>
                      <div className="space-y-1 md:space-y-2">
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-10 md:h-12 text-sm md:text-base"
                          placeholder={`${t("lastName")}...`}
                        />
                      </div>
                    </div>

                    <div className="space-y-1 md:space-y-2">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-10 md:h-12 text-sm md:text-base"
                        placeholder={`${t("email")}...`}
                      />
                    </div>

                    <div className="space-y-1 md:space-y-2">
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none text-sm md:text-base min-h-[100px] md:min-h-[120px]"
                        placeholder={`${t("message")}...`}
                      />
                    </div>

                    {result && (
                      <div
                        className={`p-3 md:p-4 rounded-lg font-medium text-sm md:text-base ${
                          result.includes("Success")
                            ? "text-green-700 bg-green-50 border border-green-200"
                            : "text-red-700 bg-red-50 border border-red-200"
                        }`}
                      >
                        {result}
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 md:py-3 h-10 md:h-12 transition-colors duration-200 text-sm md:text-base"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          {t("sendMessage")}
                          <Send className="w-3 h-3 md:w-4 md:h-4" />
                        </span>
                      )}
                    </Button>
                  </CardContent>
                </form>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
