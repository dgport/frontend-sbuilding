"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

interface ApartmentData {
  id: string | number;
  name: string;
  floor: string | number;
  size: string | number;
  balcony_size: string | number;
  bedrooms: string | number;
  bathrooms: string | number;
  sale_price: string | number;
  property_status: string;
  is_enabled: string | number; // Added this field
}

interface StatusConfig {
  color: string;
  text: string;
}

interface ApartmentModalProps {
  apartment: ApartmentData | null;
  statusConfig: StatusConfig | null;
  onClose: () => void;
}

interface ContactFormData {
  name: string;
  phone: string;
  email: string;
}

const INITIAL_CONTACT_FORM: ContactFormData = {
  name: "",
  phone: "",
  email: "",
};

export function ApartmentModal({
  apartment,
  statusConfig,
  onClose,
}: ApartmentModalProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] =
    useState<ContactFormData>(INITIAL_CONTACT_FORM);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const t = useTranslations("elysium");

  useEffect(() => {
    setImageError(false);
    setImageLoading(true);
    setShowContactForm(false);
    setResult("");
    setFormData(INITIAL_CONTACT_FORM);
  }, [apartment?.id]);

  if (!apartment || !statusConfig) return null;

  // Check if apartment is sold (status 2)
  const isSold = String(apartment.is_enabled) === "2";

  const imageSrc = `${process.env.NEXT_PUBLIC_IMAGE}/${apartment.id}`;
  const totalPrice = Number(apartment.size) * Number(apartment.sale_price);

  const handleContactSubmit = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setLoading(true);
    setResult("Sending....");

    const leadData = {
      name: formData.name,
      email: formData.email || undefined,
      phone: formData.phone,
      apartment_name: apartment.name,
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const response = await fetch(`${apiUrl}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData),
      });

      const data = await response.json();

      if (data.success) {
        setResult("Message sent successfully! We'll contact you soon.");
        setFormData(INITIAL_CONTACT_FORM);
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (value: string | undefined) => {
    setFormData((prev) => ({ ...prev, phone: value || "" }));
  };

  return (
    <div
      className="fixed inset-0 z-[99999] bg-black/40 backdrop-blur-xs flex items-center justify-center p-6 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col overflow-hidden max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {!showContactForm ? (
          <div className="gap-10 p-5 flex flex-col lg:flex-row overflow-y-auto">
            {/* Image */}
            <div className="relative w-full bg-gray-100 flex items-center justify-center overflow-hidden rounded-lg aspect-[1280/853]">
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                    <p className="text-gray-500 text-sm">{t("loading")}</p>
                  </div>
                </div>
              )}
              {imageError ? (
                <div className="w-full h-full bg-white flex items-center justify-center">
                  <p className="text-gray-400 text-lg font-medium">
                    {t("noImage")}
                  </p>
                </div>
              ) : (
                <Image
                  src={imageSrc}
                  alt="Apartment preview"
                  width={1280}
                  height={853}
                  className={`object-cover w-full h-full transition-opacity duration-300 ${
                    imageLoading ? "opacity-0" : "opacity-100"
                  }`}
                  onLoad={() => setImageLoading(false)}
                  onError={() => {
                    setImageError(true);
                    setImageLoading(false);
                  }}
                />
              )}
            </div>

            {/* Info */}
            <div className="w-full lg:w-1/4 p-1 flex flex-col">
              <div
                className="rounded-lg p-2 mb-3 sm:mb-4"
                style={{ backgroundColor: statusConfig.color }}
              >
                <h2 className="text-base sm:text-lg font-bold text-white text-center leading-tight">
                  {t("apartment")} {apartment.name} / {t("floor")}{" "}
                  {apartment.floor}
                </h2>
              </div>

              <div className="space-y-2 sm:space-y-3 flex-1">
                {/* Apartment details */}
                {[
                  {
                    label: t("totalArea"),
                    value: `${apartment.size} m²`,
                    show: apartment.size && Number(apartment.size) !== 0,
                  },
                  {
                    label: t("balcony"),
                    value: `${apartment.balcony_size} m²`,
                    show:
                      apartment.balcony_size &&
                      Number(apartment.balcony_size) !== 0,
                  },
                  {
                    label: t("bedrooms"),
                    value: apartment.bedrooms,
                    show:
                      apartment.bedrooms && Number(apartment.bedrooms) !== 0,
                  },
                  {
                    label: t("pricePerSqm"),
                    value: `${apartment.sale_price}`,
                    show:
                      apartment.sale_price &&
                      Number(apartment.sale_price) !== 0,
                  },
                ]
                  .filter((item) => item.show)
                  .map((item) => (
                    <div
                      key={item.label}
                      className="flex justify-between items-center py-1.5 sm:py-2 border-b"
                    >
                      <span className="text-gray-600 text-sm font-semibold">
                        {item.label}
                      </span>
                      <span
                        className="text-base sm:text-lg font-bold"
                        style={{ color: statusConfig.color }}
                      >
                        {item.value}
                      </span>
                    </div>
                  ))}

                {/* Total price (conditionally rendered) */}
                {totalPrice > 0 && (
                  <div className="flex justify-between items-center py-2 sm:py-3">
                    <span className="text-gray-600 text-sm font-semibold">
                      {t("totalPrice")}
                    </span>
                    <span
                      className="text-lg sm:text-xl font-bold"
                      style={{ color: statusConfig.color }}
                    >
                      ${totalPrice.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="space-y-2 mt-3">
                {/* Only show "Leave Query" button if apartment is available (not sold) */}
                {!isSold && (
                  <Button
                    onClick={() => setShowContactForm(true)}
                    className="w-full cursor-pointer text-white font-bold py-2 rounded-lg transition-colors"
                    style={{ backgroundColor: statusConfig.color, opacity: 1 }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.opacity = "0.9")
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  >
                    {t("leaveQuery") || "Leave Query"}
                  </Button>
                )}

                <Button
                  onClick={onClose}
                  className="w-full cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 rounded-lg transition-colors"
                >
                  {t("close")}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* Contact Form */
          <div className="p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3
                className="text-2xl font-bold"
                style={{ color: statusConfig.color }}
              >
                {t("contactFormTitle") || "Contact Us"} - {t("apartment")}{" "}
                {apartment.name}
              </h3>
              <Button
                onClick={() => setShowContactForm(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </Button>
            </div>

            <div className="space-y-4">
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder={t("fullName") || "Full Name *"}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                style={
                  {
                    ["--tw-ring-color" as any]: statusConfig.color,
                  } as React.CSSProperties
                }
              />

              <PhoneInput
                international
                defaultCountry="GE"
                value={formData.phone}
                onChange={handlePhoneChange}
                placeholder={t("phoneNumber") || "Phone Number *"}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus-within:ring-2 focus-within:ring-opacity-50 phone-input-custom"
                style={
                  {
                    ["--PhoneInputCountryFlag-borderColor" as any]:
                      statusConfig.color,
                  } as React.CSSProperties
                }
              />

              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={t("email") || "Email (optional)"}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
              />

              {result && (
                <div
                  className={`p-4 rounded-lg font-medium ${
                    result.includes("successfully")
                      ? "text-green-700 bg-green-50 border border-green-200"
                      : result.includes("Sending")
                      ? "text-blue-700 bg-blue-50 border border-blue-200"
                      : "text-red-700 bg-red-50 border border-red-200"
                  }`}
                >
                  {result}
                </div>
              )}

              <div className="flex gap-3 flex-col md:flex-row">
                <Button
                  type="button"
                  onClick={handleContactSubmit}
                  disabled={loading}
                  className="flex-1 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: statusConfig.color,
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      {t("sending") || "Sending..."}
                    </>
                  ) : (
                    <>
                      {t("sendMessage") || "Send Message"}
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-lg transition-colors"
                >
                  {t("back") || "Back"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
