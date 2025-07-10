"use client";

import type React from "react";
import { Send, MapPin, Phone, Mail } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { motion } from "framer-motion";
import { Facebook, Instagram } from "@/components/svg";

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
  address: "ანგისის პირველი შესახვევი #28, Batumi, Georgia",
  phone: ["+995 557 47 14 14", "+995 514 04 30 00", "+995 514 03 40 00"],
  email: "info@aisigroup.ge",
};

const ContactCard: React.FC = () => {
  const t = useTranslations("contact");
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-geo2 font-normal text-white mb-4 tracking-wider">
            {t("contactUs")}
          </h1>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="bg-white/5 border border-white/10 backdrop-blur-sm h-full">
              <CardHeader>
                <CardTitle className="text-white text-xl font-geo2 font-normal tracking-wider">
                  {t("contactInfo")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-3">
                  <MapPin
                    size={20}
                    className="text-indigo-400 mt-1 flex-shrink-0"
                  />
                  <div>
                    <h3 className="text-white font-geo2 font-light mb-1 text-lg tracking-wider">
                      {t("ourOffice")}
                    </h3>
                    <p className="text-gray-400 text-base leading-relaxed font-geo2 tracking-wider">
                      {CONTACT_INFO.address}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone
                    size={20}
                    className="text-indigo-400 mt-1 flex-shrink-0"
                  />
                  <div>
                    <h3 className="text-white font-geo2 font-light mb-1 text-lg tracking-wider">
                      {t("phone")}
                    </h3>
                    <div className="flex flex-col space-y-1">
                      {CONTACT_INFO.phone.map((number) => (
                        <a
                          key={number}
                          href={`tel:${number.replace(/[^0-9+]/g, "")}`}
                          className="text-gray-400 hover:text-white transition-colors text-base font-geo2 tracking-wider"
                        >
                          {number}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Mail
                    size={20}
                    className="text-indigo-400 mt-1 flex-shrink-0"
                  />
                  <div>
                    <h3 className="text-white font-geo2 font-light mb-1 text-lg tracking-wider">
                      {t("email")}
                    </h3>
                    <a
                      href={`mailto:${CONTACT_INFO.email}`}
                      className="text-gray-400 hover:text-white transition-colors text-base font-geo2 tracking-wider"
                    >
                      {CONTACT_INFO.email}
                    </a>
                  </div>
                </div>
                <div className="pt-6 border-t border-white/10">
                  <h3 className="text-white font-geo2 font-light mb-4 text-lg tracking-wider">
                    {t("followUs")}
                  </h3>
                  <div className="flex space-x-3">
                    <motion.a
                      href="https://www.facebook.com/AISIGROUP"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white/5 hover:bg-blue-600/20 border border-white/10 hover:border-blue-400/50 p-2.5 rounded-lg transition-all duration-200 group"
                    >
                      <Facebook
                        size={16}
                        className="w-4 h-4 fill-gray-400 group-hover:fill-blue-400"
                      />
                    </motion.a>
                    <motion.a
                      href="https://www.instagram.com/aisigroup/"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white/5 hover:bg-pink-600/20 border border-white/10 hover:border-pink-400/50 p-2.5 rounded-lg transition-all duration-200 group"
                    >
                      <Instagram
                        size={16}
                        className="w-4 h-4 fill-gray-400 group-hover:fill-pink-400"
                      />
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
            className="lg:col-span-2"
          >
            <Card className="bg-white/5 border border-white/10 backdrop-blur-sm h-full">
              <CardHeader>
                <CardDescription className="text-gray-400 font-geo2 text-lg tracking-wider">
                  {t("sendUsDescribe")}
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="firstName"
                        className="text-white text-base font-geo2 font-light tracking-wider"
                      >
                        {t("firstName")}
                      </label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="bg-white/10 border-white/20 mt-3 text-white placeholder:text-gray-400 focus:border-indigo-400 focus:ring-indigo-400 font-geo2 tracking-wider"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="lastName"
                        className="text-white text-base font-geo2 font-light tracking-wider"
                      >
                        {t("lastName")}
                      </label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="bg-white/10 border-white/20 mt-3 text-white placeholder:text-gray-400 focus:border-indigo-400 focus:ring-indigo-400 font-geo2 tracking-wider"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-white text-base font-geo2 font-light tracking-wider"
                    >
                      {t("email")}
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-white/10 border-white/20 mt-3 text-white placeholder:text-gray-400 focus:border-indigo-400 focus:ring-indigo-400 font-geo2 tracking-wider"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="text-white text-base font-geo2 font-light tracking-wider"
                    >
                      {t("message")}
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="bg-white/10 border-white/20 text-white mt-3 placeholder:text-gray-400 focus:border-indigo-400 focus:ring-indigo-400 resize-none font-geo2 tracking-wider"
                    />
                  </div>
                  {result && (
                    <div
                      className={`text-base font-geo2 font-light p-3 rounded-lg tracking-wider ${
                        result.includes("Success")
                          ? "text-green-400 bg-green-500/10 border border-green-500/20"
                          : "text-red-400 bg-red-500/10 border border-red-500/20"
                      }`}
                    >
                      {result}
                    </div>
                  )}
                  <Button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-geo2 font-light py-3 transition-colors duration-200 tracking-wider"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2 font-geo2 tracking-wider">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        {t("sending") || "Sending..."}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 font-geo2 tracking-wider">
                        {t("sendMessage")}
                        <Send className="w-4 h-4" />
                      </span>
                    )}
                  </Button>
                </CardContent>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
    </div>
  );
};

export default ContactCard;