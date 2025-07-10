"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import background from "@/root/public/images/bg-body.jpg";
const accordionItems = [
  {
    question: "What amenities are included with each floor?",
    answer:
      "Each floor comes with access to all building amenities including 24/7 security, dedicated parking spaces, the rooftop garden, fitness center, and community gathering spaces. Higher floors may have enhanced views and premium finishes.",
  },
  {
    question: "How do I schedule a viewing?",
    answer:
      "You can schedule a viewing by contacting our sales office at (123) 456-7890 or by filling out the contact form on our website. Our team will arrange a convenient time for you to visit the property and explore your preferred floor options.",
  },
  {
    question: "What is the purchasing process?",
    answer:
      "The purchasing process begins with selecting your preferred floor and unit. Once you've made your selection, our sales team will guide you through the reservation process, financing options, contract signing, and closing procedures. We're here to make your home-buying experience as seamless as possible.",
  },
];

export default function GoderdziFAQ() {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  return (
    <section
      className="bg-white py-10 md:py-20 px-4 md:px-8 lg:px-16 relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900"
      style={{ backgroundImage: `url(${background.src})` }}
    >
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
            style={{
              left: `${10 + i * 10}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: "4s",
            }}
          />
        ))}
      </div>

      <section className="relative z-10 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900  rounded-2xl">
        <div className="relative w-full p-3 px-4 sm:px-8 md:px-12 pb-8 sm:pb-16 pt-0 mx-auto overflow-hidden border border-white/10">
          <div className="relative z-10 p-3 sm:p-6 pt-8 sm:pt-12">
            <div className="flex flex-col items-center mb-6 sm:mb-10">
              <div className="flex items-center mb-2 sm:mb-4">
                <HelpCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white mr-2 sm:mr-3" />
                <h3 className="text-lg sm:text-xl md:text-2xl font-normal text-white tracking-wide">
                  Construction
                </h3>
              </div>
              <div className="h-[2px] bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-full w-24 sm:w-32"></div>
            </div>
            <div className="space-y-4 sm:space-y-6">
              {accordionItems.map((item, index) => (
                <div
                  key={index}
                  className="rounded-lg sm:rounded-xl bg-gradient-to-br from-slate-700/50 via-slate-600/40 to-slate-800/60 backdrop-blur-xl border border-white/20 shadow-lg overflow-hidden"
                >
                  <button
                    className="flex justify-between cursor-pointer items-center w-full p-4 sm:p-5 text-left hover:bg-white/5 transition-all duration-300 group"
                    onClick={() => toggleAccordion(index)}
                  >
                    <span className="font-medium text-white/90 text-sm sm:text-base pr-4">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 sm:w-5 sm:h-5 text-white/70 transition-transform duration-300 flex-shrink-0 ${
                        openAccordion === index ? "transform rotate-180" : ""
                      } group-hover:text-white/90`}
                    />
                  </button>

                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      openAccordion === index
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                      <div className="h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full w-full mb-3 sm:mb-4"></div>
                      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/10">
                        <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}