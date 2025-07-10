"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Ruler, Tag, ChevronLeft, ChevronRight, Loader2, ArrowLeft, Phone, User, X } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ApartmentDetailsSheetProps {
  isOpen: boolean
  onOpenChange?: (open: boolean) => void
  onClose?: () => void
  apartment: {
    id: number
    number: number
    area?: number
    rooms?: number
    status: string
    price?: number
    floor?: number
    images?: string[]
  } | null
}

export const ApartmentDetailsSheet = ({ isOpen, onOpenChange, onClose, apartment }: ApartmentDetailsSheetProps) => {
  const [showContactForm, setShowContactForm] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  })
  const [selectedImage, setSelectedImage] = useState(0)
  const [imageLoading, setImageLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showZoom, setShowZoom] = useState(false)
  const [zoomImageIndex, setZoomImageIndex] = useState(0)

  const prevImage = () => {
    setSelectedImage((prev) => (prev > 0 ? prev - 1 : prev))
  }

const nextImage = () => {
  setSelectedImage((prev) => {
    const imagesLength = apartment?.images?.length ?? 0;
    return prev < imagesLength - 1 ? prev + 1 : prev;
  });
};

useEffect(() => {
  if (isOpen) {
    setSelectedImage(0);
    setImageLoading(true);
    setShowContactForm(false);
    setShowZoom(false);
    setFormData({ firstName: "", lastName: "", phoneNumber: "" });
  }
}, [isOpen]);

if (!apartment) return null;

const getStatusStyles = () => {
  switch (apartment.status?.toLowerCase()) {
    case "available":
      return "bg-green-50 text-green-600 border-green-200";
    case "reserved":
      return "bg-amber-50 text-amber-600 border-amber-200";
    case "sold":
      return "bg-red-50 text-red-600 border-red-200";
    default:
      return "bg-gray-50 text-gray-600 border-gray-200";
  }
};

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};

const handleClose = (open: boolean) => {
  if (onOpenChange) {
    onOpenChange(open);
  }
  if (onClose && !open) {
    onClose();
  }
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setFormData({ firstName: "", lastName: "", phoneNumber: "" });
    setShowContactForm(false);
    handleClose(false);
  } catch (error) {
    console.error("Submission error:", error);
  } finally {
    setIsSubmitting(false);
  }
};

const handleImageLoad = () => {
  setImageLoading(false);
};

const handleThumbnailClick = (index: number) => {
  if (selectedImage !== index) {
    setImageLoading(true);
    setSelectedImage(index);
  }
};

const handleImageZoom = (index: number) => {
  setZoomImageIndex(index);
  setShowZoom(true);
};
const nextZoomImage = () => {
  setZoomImageIndex((prev) => {
    const imagesLength = apartment?.images?.length ?? 0;
    return imagesLength > 0 ? (prev < imagesLength - 1 ? prev + 1 : 0) : prev;
  });
};

const prevZoomImage = () => {
  setZoomImageIndex((prev) => {
    const imagesLength = apartment?.images?.length ?? 0;
    return imagesLength > 0 ? (prev > 0 ? prev - 1 : imagesLength - 1) : prev;
  });
};


  const images = apartment.images || []

  return (
    <>
      <Sheet open={isOpen && !showContactForm} onOpenChange={handleClose}>
        <SheetContent side="right" className="w-full sm:max-w-2xl p-0 overflow-hidden">
          <button
            onClick={() => handleClose(false)}
            className="absolute top-4 right-4 z-30 bg-white/80 backdrop-blur-sm hover:bg-white/90 rounded-full p-2 shadow-lg transition-all md:hidden"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
          <div className="flex flex-col h-full">
            <div className="px-4  border-b border-gray-200 bg-white"></div>
            <div className="flex-1 relative">
              {images.length > 0 ? (
                <div className="h-full flex flex-col">
                  <div className="flex-1 relative bg-gray-100">
                    {imageLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                      </div>
                    )}
                    <div className="w-full h-full cursor-zoom-in" onClick={() => handleImageZoom(selectedImage)}>
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL || ""}${
                          apartment.images?.[selectedImage] || "/placeholder.svg?height=600&width=800"
                        }`}
                        alt={`Apartment ${apartment.number}`}
                        className="object-cover w-full h-full"
                        fill
                        onLoad={handleImageLoad}
                        priority={selectedImage === 0}
                      />
                    </div>

                    {apartment.images && apartment.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all z-20"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all z-20"
                          aria-label="Next image"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-1 py-1 rounded-full text-sm z-20">
                          {selectedImage + 1} / {apartment.images.length}
                        </div>
                      </>
                    )}
                  </div>
                  {apartment.images && apartment.images.length > 1 && (
                    <div className="p-4 bg-gray-50 border-t">
                      <div className="flex gap-2 overflow-x-auto">
                        {apartment.images.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleThumbnailClick(idx)}
                            className={`relative rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                              selectedImage === idx
                                ? "ring-2 ring-blue-500"
                                : "ring-1 ring-gray-200 hover:ring-gray-300"
                            }`}
                          >
                            <Image
                              src={`${process.env.NEXT_PUBLIC_IMAGE_URL || ""}${img}`}
                              alt={`Thumbnail ${idx + 1}`}
                              className="w-16 h-16 object-cover"
                              width={64}
                              height={64}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-100">
                  <p className="text-gray-500">No images available</p>
                </div>
              )}
            </div>
            <div className="p-6 bg-white border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                  <Ruler className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Area</p>
                    <p className="text-lg font-semibold">{apartment.area ? `${apartment.area} m²` : "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                  <Tag className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusStyles()}`}>
                      <span className="capitalize">{apartment.status}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                  <Tag className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Apartment</p>
                    <p className="text-lg font-semibold">#{apartment.number}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                  <div className="h-4 w-4 text-gray-500 flex items-center justify-center">
                    <div className="w-3 h-3 border-2 border-gray-500 rounded-sm"></div>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Floor</p>
                    <p className="text-lg font-semibold">{apartment.floor || "N/A"}</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <Button
                  onClick={() => setShowContactForm(true)}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <Sheet open={showContactForm} onOpenChange={setShowContactForm}>
        <SheetContent side="right" className="w-full sm:max-w-lg p-0 overflow-hidden">
          {/* Mobile X button */}
          <button
            onClick={() => setShowContactForm(false)}
            className="absolute top-4 right-4 z-30 bg-white/80 backdrop-blur-sm hover:bg-white/90 rounded-full p-2 shadow-lg transition-all md:hidden"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
          <div className="flex flex-col h-full">
            <div className="px-6 py-4 border-b border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowContactForm(false)}
                  className="p-2 flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="md:hidden">Back</span>
                </Button>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Contact Sales</h2>
                  <p className="text-sm text-gray-500">Apartment #{apartment.number}</p>
                </div>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="w-full max-w-md">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Get in Touch</h3>
                  <p className="text-gray-600">Fill out the form below and we'll get back to you shortly.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        type="text"
                        name="firstName"
                        placeholder="Enter your first name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                        className="mt-1 h-12"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        name="lastName"
                        placeholder="Enter your last name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                        className="mt-1 h-12"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                        Phone Number
                      </Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        name="phoneNumber"
                        placeholder="Enter your phone number"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                        className="mt-1 h-12"
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Inquiry"
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      {showZoom && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <button
            onClick={() => setShowZoom(false)}
            className="absolute top-4 right-4 z-60 bg-white/20 hover:bg-white/30 rounded-full p-3 text-white transition-all"
            aria-label="Close zoom"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="relative w-full h-full flex items-center justify-center p-4">
            <div className="relative max-w-7xl max-h-full">
              <Image
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL || ""}${apartment.images?.[zoomImageIndex]}`}
                alt={`Apartment ${apartment.number} - Image ${zoomImageIndex + 1}`}
                className="object-contain max-w-full max-h-full"
                width={1200}
                height={800}
              />
            </div>

            {apartment.images && apartment.images.length > 1 && (
              <>
                <button
                  onClick={prevZoomImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-4 text-white transition-all"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextZoomImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-4 text-white transition-all"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
                  {zoomImageIndex + 1} / {apartment.images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
