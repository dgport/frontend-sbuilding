"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useState } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

interface ApartmentImage {
  src: string;
  apartmentNumber: number;
  apartmentId: number;
  area?: number;
  status?: string;
}

interface ApartmentImageDisplayProps {
  images: ApartmentImage[];
  isOpen: boolean;
  onClose: () => void;
  buildingId?: string;
  floorNumber?: number;
  buildingName?: string;
}

interface ContactFormData {
  contact: string;
  apartmentNumber: number;
  area?: number;
  status?: string;
  buildingId?: string;
  floorNumber?: number;
}

const WEB3FORMS_ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "";

export const ApartmentImageDisplay: React.FC<ApartmentImageDisplayProps> = ({
  images,
  isOpen,
  onClose,
  buildingId,
  floorNumber,
  buildingName,
}) => {
  const t = useTranslations("main");
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedApartmentData, setSelectedApartmentData] =
    useState<ContactFormData | null>(null);
  const [contactValue, setContactValue] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [additionalMessage, setAdditionalMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isContactModalOpen) {
          setIsContactModalOpen(false);
        } else if (isOpen) {
          onClose();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isContactModalOpen, onClose]);

  if (!isOpen || images.length === 0) return null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return "bg-emerald-500 text-white shadow-emerald-500/30";
      case "reserved":
        return "bg-amber-500 text-white shadow-amber-500/30";
      case "sold":
        return "bg-red-500 text-white shadow-red-500/30";
      default:
        return "bg-slate-500 text-white shadow-slate-500/30";
    }
  };

  const getTranslatedStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return t("available");
      case "reserved":
        return t("reserved");
      case "sold":
        return t("sold");
      default:
        return status;
    }
  };

  const getBuildingName = (buildingId: string) => {
    switch (buildingId) {
      case "1":
        return t("aisiGoderdzi");
      case "2":
        return t("aisiBBlock");
      case "3":
        return t("aisiStatus");
      case "5":
        return t("aisiBatumiABlock");
      default:
        return buildingName || `Building ${buildingId}`;
    }
  };

  const handleContactButtonClick = (apartmentData: ApartmentImage) => {
    setSelectedApartmentData({
      contact: "",
      apartmentNumber: apartmentData.apartmentNumber,
      area: apartmentData.area,
      status: apartmentData.status,
      buildingId,
      floorNumber,
    });
    setContactValue("");
    setCustomerName("");
    setAdditionalMessage("");
    setIsContactModalOpen(true);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{8,}$/;
    return phoneRegex.test(phone);
  };

  const isValidContact = (contact: string) => {
    return validateEmail(contact) || validatePhone(contact);
  };

  const handleSubmitInquiry = async () => {
    if (
      !selectedApartmentData ||
      !contactValue.trim() ||
      !customerName.trim()
    ) {
      alert(t("pleaseFillAllFields"));
      return;
    }

    if (!isValidContact(contactValue.trim())) {
      alert(t("pleaseEnterValidContact"));
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("access_key", WEB3FORMS_ACCESS_KEY);
      formData.append(
        "subject",
        `Apartment Inquiry - Building ${selectedApartmentData.buildingId} - Apt #${selectedApartmentData.apartmentNumber}`
      );
      formData.append("from_name", customerName.trim());
      formData.append(
        "email",
        validateEmail(contactValue.trim())
          ? contactValue.trim()
          : "noreply@example.com"
      );

      const messageContent = `
New Apartment Inquiry

Customer Details:
- Name: ${customerName.trim()}
- Contact: ${contactValue.trim()}
- Inquiry Date: ${new Date().toLocaleString()}

Property Details:
${buildingId ? `- Building: ${getBuildingName(buildingId)}` : ""}
${
  selectedApartmentData.buildingId
    ? `- Building ID: ${selectedApartmentData.buildingId}`
    : ""
}
${
  selectedApartmentData.floorNumber
    ? `- Floor: ${selectedApartmentData.floorNumber}`
    : ""
}
- Apartment Number: #${selectedApartmentData.apartmentNumber}
${
  selectedApartmentData.area !== undefined &&
  selectedApartmentData.area !== null
    ? `- Area: ${selectedApartmentData.area} m²`
    : ""
}
${
  selectedApartmentData.status
    ? `- Status: ${getTranslatedStatus(selectedApartmentData.status)}`
    : ""
}

${
  additionalMessage.trim()
    ? `Additional Message:\n${additionalMessage.trim()}`
    : "No additional message provided."
}

---
This inquiry was submitted through the apartment gallery.
      `.trim();

      formData.append("message", messageContent);

      if (validateEmail(contactValue.trim())) {
        formData.append("replyto", contactValue.trim());
      }

      if (
        validatePhone(contactValue.trim()) &&
        !validateEmail(contactValue.trim())
      ) {
        formData.append("phone", contactValue.trim());
      }

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setIsContactModalOpen(false);
        setContactValue("");
        setCustomerName("");
        setAdditionalMessage("");
        setSelectedApartmentData(null);
      } else {
        throw new Error(result.message || "Failed to send inquiry");
      }
    } catch (error) {
      console.error("Error sending inquiry:", error);
      alert("Failed to send inquiry. Please try again or contact us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setIsContactModalOpen(false);
    setContactValue("");
    setCustomerName("");
    setAdditionalMessage("");
    setSelectedApartmentData(null);
  };

  return (
    <>
      <PhotoProvider
        maskOpacity={0.8}
        maskClosable={true}
        pullClosable={true}
        photoClosable={true}
        bannerVisible={false}
        loop={true}
        speed={() => 300}
        easing={(type) =>
          type === 2
            ? "cubic-bezier(0.36, 0, 0.66, -0.56)"
            : "cubic-bezier(0.34, 1.56, 0.64, 1)"
        }
        loadingElement={
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        }
        brokenElement={
          <div className="text-white text-sm">{t("failedToLoadImage")}</div>
        }
        className="photo-gallery-container"
        overlayRender={({ index }) => {
          const currentImage = images[index];
          if (!currentImage) return null;

          const hasArea =
            currentImage.area !== undefined && currentImage.area !== null;
          const hasStatus =
            currentImage.status && currentImage.status.trim() !== "";

          if (!hasArea && !hasStatus) return null;

          return (
            <div className="absolute top-6 right-6 z-50 md:mt-10 font-geo">
              <div className="bg-white/95 flex flex-col items-center backdrop-blur-md rounded-xl p-4 shadow-2xl border border-white/20 min-w-[200px]">
                <div className="flex items-center gap-2 ">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {t("apartment")} #{currentImage.apartmentNumber}
                  </h3>
                </div>
                {buildingId && (
                  <div className="mb-3">
                    <p className="text-sm font-medium md:block hidden text-gray-700">
                      {getBuildingName(buildingId)}
                    </p>
                  </div>
                )}
                {hasArea && (
                  <div className="flex items-center gap-3 mb-2">
                    <p className="text-sm text-gray-500">{t("area")}</p>
                    <p className="font-semibold text-gray-800">
                      {currentImage.area} m²
                    </p>
                  </div>
                )}

                {hasStatus && (
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-lg ${getStatusColor(
                          currentImage.status!
                        )}`}
                      >
                        {getTranslatedStatus(currentImage.status!)}
                      </span>
                    </div>
                  </div>
                )}

                <Button
                  className="bg-indigo-400 w-full"
                  onClick={() => handleContactButtonClick(currentImage)}
                >
                  {t("contactUs")}
                </Button>
              </div>
            </div>
          );
        }}
        toolbarRender={({
          onScale,
          scale,
          rotate,
          onRotate,
          index,
          onIndexChange,
        }) => (
          <div
            className="flex flex-col items-end gap-2"
            style={{ marginBottom: "40px" }}
          >
            {images.length > 1 && (
              <div className="flex gap-2 bg-black/50 rounded-lg p-2 max-w-md overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => onIndexChange?.(idx)}
                    className={`flex-shrink-0 w-12 h-12 rounded overflow-hidden border-2 transition-all ${
                      index === idx
                        ? "border-white"
                        : "border-transparent opacity-60 hover:opacity-80"
                    }`}
                    aria-label={`${t("thumbnail")} ${idx + 1}`}
                  >
                    <Image
                      src={img.src || "/placeholder.svg"}
                      alt={`${t("thumbnail")} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 bg-black/50 rounded-lg p-2">
              {images.length > 1 && (
                <>
                  <button
                    className="text-white hover:text-gray-300 px-3 py-1 rounded transition-colors md:hidden"
                    onClick={() =>
                      onIndexChange?.(index > 0 ? index - 1 : images.length - 1)
                    }
                    aria-label="Previous image"
                  >
                    ←
                  </button>
                  <button
                    className="text-white hover:text-gray-300 px-3 py-1 rounded transition-colors md:hidden"
                    onClick={() =>
                      onIndexChange?.(index < images.length - 1 ? index + 1 : 0)
                    }
                    aria-label="Next image"
                  >
                    →
                  </button>
                </>
              )}

              <button
                className="text-white hover:text-gray-300 px-3 py-1 rounded transition-colors"
                onClick={() => onScale(scale + 0.5)}
                aria-label="Zoom in"
              >
                +
              </button>
              <button
                className="text-white hover:text-gray-300 px-3 py-1 rounded transition-colors"
                onClick={() => onScale(scale - 0.5)}
                aria-label="Zoom out"
              >
                -
              </button>
              <button
                className="text-white hover:text-gray-300 px-3 py-1 rounded transition-colors"
                onClick={() => onRotate(rotate + 90)}
                aria-label="Rotate image"
              >
                ↻
              </button>
              <div className="text-white text-sm px-2">
                {index + 1} / {images.length}
              </div>
            </div>
          </div>
        )}
      >
        <div style={{ display: "none" }}>
          {images.map((image, index) => (
            <PhotoView key={`${image.apartmentId}-${index}`} src={image.src}>
              <div
                data-apartment-trigger={
                  index === 0 ? image.apartmentId : undefined
                }
                data-photo-index={index}
              />
            </PhotoView>
          ))}
        </div>
      </PhotoProvider>

      {isContactModalOpen && selectedApartmentData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {t("contactUs")}
                </h2>
                <button
                  onClick={handleModalClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close modal"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-1 text-sm text-gray-600">
                  {buildingId && (
                    <p>
                      <strong>{t("building")}:</strong>{" "}
                      {getBuildingName(buildingId)}
                    </p>
                  )}

                  {selectedApartmentData.floorNumber && (
                    <p>
                      <strong>{t("floor")}:</strong>{" "}
                      {selectedApartmentData.floorNumber}
                    </p>
                  )}
                  <p>
                    <strong>{t("apartment")}:</strong> #
                    {selectedApartmentData.apartmentNumber}
                  </p>
                  {selectedApartmentData.area !== undefined &&
                    selectedApartmentData.area !== null && (
                      <p>
                        <strong>{t("area")}:</strong>{" "}
                        {selectedApartmentData.area} m²
                      </p>
                    )}
                  {selectedApartmentData.status && (
                    <p>
                      <strong>{t("status")}:</strong>{" "}
                      {getTranslatedStatus(selectedApartmentData.status)}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="customerName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {t("yourName")} *
                  </label>
                  <Input
                    type="text"
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {t("yourEmailOrPhone")} *
                  </label>
                  <Input
                    type="text"
                    id="contact"
                    value={contactValue}
                    onChange={(e) => setContactValue(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {t("weWillUseThisToContact")}
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="additionalMessage"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {t("additionalMessage")} ({t("optional")})
                  </label>
                  <Textarea
                    id="additionalMessage"
                    value={additionalMessage}
                    onChange={(e) => setAdditionalMessage(e.target.value)}
                    rows={3}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleModalClose}
                  className="w-1/2 bg-gray-500"
                  disabled={isSubmitting}
                >
                  {t("cancel")}
                </Button>
                <Button
                  onClick={handleSubmitInquiry}
                  disabled={
                    !contactValue.trim() || !customerName.trim() || isSubmitting
                  }
                  className="w-1/2 bg-indigo-400 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin cursor-pointer rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {t("sending")}...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                      {t("sendInquiry")}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
