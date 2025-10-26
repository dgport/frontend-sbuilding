"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { DollarSign, Percent, Clock } from "lucide-react";
import { useTranslations } from "next-intl";

export default function PaymentCalculator() {
  const t = useTranslations("calculator");
  const [propertyValue, setPropertyValue] = useState(100000);
  const [months, setMonths] = useState(24);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [downPaymentAmount, setDownPaymentAmount] = useState(20000);

  const calculations = useMemo(() => {
    const loanAmount = propertyValue - downPaymentAmount;
    const monthly = months > 0 ? loanAmount / months : 0;
    return {
      monthlyPayment: monthly,
      totalPayment: loanAmount,
    };
  }, [propertyValue, months, downPaymentAmount]);

  useEffect(() => {
    const amount = (propertyValue * downPaymentPercent) / 100;
    setDownPaymentAmount(amount);
  }, [propertyValue, downPaymentPercent]);

  const handleDownPaymentAmountChange = useCallback(
    (value: number) => {
      setDownPaymentAmount(value);
      const percent = (value / propertyValue) * 100;
      setDownPaymentPercent(Number.parseFloat(percent.toFixed(1)));
    },
    [propertyValue]
  );

  const formatCurrency = useCallback((value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  }, []);

  useEffect(() => {
    const sliders = document.querySelectorAll(".slider");
    sliders.forEach((slider: any) => {
      const min = slider.min || 0;
      const max = slider.max || 100;
      const value = slider.value;
      const percentage = ((value - min) / (max - min)) * 100;
      slider.style.setProperty("--value", `${percentage}%`);
    });
  }, [propertyValue, downPaymentPercent, months]);

  return (
    <section className="w-full px-4 md:px-8 py-10 md:pt-12 pb-24 relative overflow-hidden min-h-screen lg:min-h-auto">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="absolute inset-0 opacity-5">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <pattern
                id="construction-grid"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <rect
                  width="20"
                  height="20"
                  fill="none"
                  stroke="#1e40af"
                  strokeWidth="0.5"
                />
                <rect
                  width="10"
                  height="10"
                  fill="none"
                  stroke="#1e40af"
                  strokeWidth="0.3"
                />
                <circle cx="10" cy="10" r="2" fill="#1e40af" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#construction-grid)" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl font-geo2 md:text-4xl py-3 tracking-widest font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-sky-600 to-blue-400 uppercase animate-fade-in">
            {t("paymentCalculator")}
          </h1>
          <div className="mt-4 h-0.5 w-32 md:w-32 bg-gradient-to-r from-blue-500 via-blue-300 to-transparent rounded-full mx-auto animate-expand"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-blue-200">
            <div className="space-y-6">
              <div className="group">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-gray-700 flex items-center font-medium text-sm md:text-base transition-colors group-hover:text-blue-600">
                    <DollarSign className="h-4 w-4 mr-2 text-blue-600 transition-transform group-hover:scale-110" />
                    {t("propertyValue")}
                  </label>
                  <div className="bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-md transition-all hover:border-blue-300 hover:bg-blue-50">
                    <input
                      type="number"
                      value={propertyValue}
                      onChange={(e) =>
                        setPropertyValue(Math.max(0, Number(e.target.value)))
                      }
                      className="w-20 md:w-24 bg-transparent text-gray-700 font-medium text-right text-sm focus:outline-none"
                    />
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    value={propertyValue}
                    min="10000"
                    max="200000"
                    step="5000"
                    onChange={(e) => setPropertyValue(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>$10K</span>
                  <span>$200K</span>
                </div>
              </div>

              <div className="group">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-gray-700 flex items-center font-medium text-sm md:text-base transition-colors group-hover:text-blue-600">
                    <Percent className="h-4 w-4 mr-2 text-blue-600 transition-transform group-hover:scale-110" />
                    {t("downPayment")}
                  </label>
                  <div className="flex space-x-2">
                    <div className="bg-gray-50 border border-gray-200 px-2 py-1.5 rounded-md flex items-center transition-all hover:border-blue-300 hover:bg-blue-50">
                      <input
                        type="number"
                        value={downPaymentPercent}
                        onChange={(e) =>
                          setDownPaymentPercent(
                            Math.max(0, Math.min(100, Number(e.target.value)))
                          )
                        }
                        className="w-12 bg-transparent text-gray-700 font-medium text-right text-sm focus:outline-none"
                      />
                      <span className="text-gray-700 font-medium ml-1 text-sm">
                        %
                      </span>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 px-2 py-1.5 rounded-md transition-all hover:border-blue-300 hover:bg-blue-50">
                      <input
                        type="number"
                        value={Math.round(downPaymentAmount)}
                        onChange={(e) => {
                          const value = Math.max(
                            0,
                            Math.min(propertyValue, Number(e.target.value))
                          );
                          handleDownPaymentAmountChange(value);
                        }}
                        className="w-16 md:w-20 bg-transparent text-gray-700 font-medium text-right text-sm focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    value={downPaymentPercent}
                    min="0"
                    max="100"
                    step="1"
                    onChange={(e) =>
                      setDownPaymentPercent(Number(e.target.value))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="group">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-gray-700 flex items-center font-medium text-sm md:text-base transition-colors group-hover:text-blue-600">
                    <Clock className="h-4 w-4 mr-2 text-blue-600 transition-transform group-hover:scale-110" />
                    {t("paymentPeriod")}
                  </label>
                  <div className="bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-md flex items-center transition-all hover:border-blue-300 hover:bg-blue-50">
                    <input
                      type="number"
                      value={months}
                      onChange={(e) =>
                        setMonths(
                          Math.max(1, Math.min(60, Number(e.target.value)))
                        )
                      }
                      className="w-12 bg-transparent text-gray-700 font-medium text-right text-sm focus:outline-none"
                    />
                    <span className="text-gray-700 font-medium ml-2 text-sm">
                      {months === 1 ? t("month") : t("months")}
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    value={months}
                    min="1"
                    max="60"
                    step="1"
                    onChange={(e) => setMonths(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 {t("month")}</span>
                  <span>60 {t("months")}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-blue-200">
            <div className="mb-4">
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">
                {t("paymentSummary")}
              </h3>
              <div className="h-px bg-gradient-to-r from-gray-200 via-blue-200 to-transparent w-full" />
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-4 mb-6">
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-100 rounded-md p-3 transition-all duration-300 hover:shadow-md hover:border-blue-200 transform hover:-translate-y-1">
                <div className="text-gray-600 text-xs font-medium mb-1">
                  {t("propertyValue")}
                </div>
                <div className="text-sm md:text-base font-semibold text-gray-800">
                  {formatCurrency(propertyValue)}
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-100 rounded-md p-3 transition-all duration-300 hover:shadow-md hover:border-blue-200 transform hover:-translate-y-1">
                <div className="text-gray-600 text-xs font-medium mb-1">
                  {t("paymentPeriod")}
                </div>
                <div className="text-sm md:text-base font-semibold text-gray-800">
                  {months} {months === 1 ? t("month") : t("months")}
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-100 rounded-md p-3 transition-all duration-300 hover:shadow-md hover:border-blue-200 transform hover:-translate-y-1">
                <div className="text-gray-600 text-xs font-medium mb-1">
                  {t("downPayment")}
                </div>
                <div className="text-sm md:text-base font-semibold text-gray-800">
                  {formatCurrency(downPaymentAmount)}
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-100 rounded-md p-3 transition-all duration-300 hover:shadow-md hover:border-blue-200 transform hover:-translate-y-1">
                <div className="text-gray-600 text-xs font-medium mb-1">
                  {t("financeAmount")}
                </div>
                <div className="text-sm md:text-base font-semibold text-gray-800">
                  {formatCurrency(calculations.totalPayment)}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg lg:mt-6 p-4 md:py-5 text-center shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
              <div className="text-blue-100 text-xs md:text-sm font-medium mb-1 uppercase tracking-wide">
                {t("monthlyPayment")}
              </div>
              <div className="text-white text-2xl md:text-3xl font-bold">
                {formatCurrency(calculations.monthlyPayment)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes expand {
          from {
            width: 0;
          }
          to {
            width: 8rem;
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-expand {
          animation: expand 0.8s ease-out;
        }

        .slider {
          transition: all 0.15s ease;
          background: linear-gradient(
            to right,
            #3b82f6 0%,
            #3b82f6 var(--value),
            #e5e7eb var(--value),
            #e5e7eb 100%
          );
        }

        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 6px rgba(37, 99, 235, 0.4);
          transition: all 0.2s ease;
        }

        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 3px 8px rgba(37, 99, 235, 0.6);
        }

        .slider::-webkit-slider-thumb:active {
          transform: scale(1.1);
        }

        .slider::-moz-range-thumb {
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 6px rgba(37, 99, 235, 0.4);
          transition: all 0.2s ease;
        }

        .slider::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 3px 8px rgba(37, 99, 235, 0.6);
        }

        .slider::-moz-range-thumb:active {
          transform: scale(1.1);
        }

        .slider::-moz-range-track {
          background: linear-gradient(
            to right,
            #3b82f6 0%,
            #3b82f6 var(--value),
            #e5e7eb var(--value),
            #e5e7eb 100%
          );
          height: 8px;
          border-radius: 4px;
        }

        .slider::-moz-range-progress {
          background: #3b82f6;
          height: 8px;
          border-radius: 4px;
        }

        .slider:hover {
          opacity: 0.9;
        }
      `}</style>
    </section>
  );
}
