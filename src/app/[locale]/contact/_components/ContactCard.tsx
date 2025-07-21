"use client";

import type React from "react";
import { Send, MapPin, Phone, Mail } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

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

const CONTACT_INFO: ContactInfo = {
  address: "123 Business Street, Suite 100, City, State 12345",
  phone: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
  email: "contact@company.com",
};

const ContactPage: React.FC = () => {
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
                  <CardTitle className="text-lg md:text-2xl py-2 md:py-4 font-bold">
                    Contact Information
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
                        Our Office
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
                        Phone Numbers
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
                        Email Address
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
                      Follow Us
                    </h3>
                    <div className="flex space-x-2 md:space-x-3">
                      <motion.a
                        href="#"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 md:p-3 rounded-full transition-colors"
                      >
                        <svg
                          className="w-4 h-4 md:w-5 md:h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                        </svg>
                      </motion.a>
                      <motion.a
                        href="#"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 md:p-3 rounded-full transition-colors"
                      >
                        <svg
                          className="w-4 h-4 md:w-5 md:h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                        </svg>
                      </motion.a>
                      <motion.a
                        href="#"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 md:p-3 rounded-full transition-colors"
                      >
                        <svg
                          className="w-4 h-4 md:w-5 md:h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
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
                  <CardTitle className="text-lg md:text-2xl font-bold text-blue-900">
                    Send us a Message
                  </CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                  <CardContent className="p-4 md:p-8 pt-0 space-y-4 md:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div className="space-y-1 md:space-y-2">
                        <label
                          htmlFor="firstName"
                          className="text-blue-900 font-medium text-sm md:text-base"
                        >
                          First Name *
                        </label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-10 md:h-12 text-sm md:text-base"
                          placeholder="Enter your first name"
                        />
                      </div>
                      <div className="space-y-1 md:space-y-2">
                        <label
                          htmlFor="lastName"
                          className="text-blue-900 font-medium text-sm md:text-base"
                        >
                          Last Name *
                        </label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-10 md:h-12 text-sm md:text-base"
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 md:space-y-2">
                      <label
                        htmlFor="email"
                        className="text-blue-900 font-medium text-sm md:text-base"
                      >
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-10 md:h-12 text-sm md:text-base"
                        placeholder="Enter your email address"
                      />
                    </div>

                    <div className="space-y-1 md:space-y-2">
                      <label
                        htmlFor="message"
                        className="text-blue-900 font-medium text-sm md:text-base"
                      >
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none text-sm md:text-base min-h-[100px] md:min-h-[120px]"
                        placeholder="Tell us how we can help you..."
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
                          Send Message
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
