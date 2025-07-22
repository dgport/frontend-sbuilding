"use client";

import { useState, useEffect } from "react";
import { DollarSign, Percent, Clock } from "lucide-react";

export default function PaymentCalculator() {
  const [propertyValue, setPropertyValue] = useState(100000);
  const [months, setMonths] = useState(24);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [downPaymentAmount, setDownPaymentAmount] = useState(20000);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [isUpdatingPercent, setIsUpdatingPercent] = useState(false);

  useEffect(() => {
    if (!isUpdatingPercent) {
      const amount = (propertyValue * downPaymentPercent) / 100;
      setIsUpdatingPercent(true);
      setDownPaymentAmount(amount);
    } else {
      setIsUpdatingPercent(false);
    }
  }, [propertyValue, downPaymentPercent, isUpdatingPercent]);

  const handleDownPaymentAmountChange = (value: number) => {
    setDownPaymentAmount(value);
    const percent = (value / propertyValue) * 100;
    setDownPaymentPercent(Number.parseFloat(percent.toFixed(1)));
  };

  useEffect(() => {
    const loanAmount = propertyValue - downPaymentAmount;
    const monthly = months > 0 ? loanAmount / months : 0;
    setMonthlyPayment(monthly);
    setTotalPayment(loanAmount);
  }, [propertyValue, months, downPaymentAmount]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

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
          <h1 className="text-2xl font-geo2 md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-sky-600 to-blue-400 tracking-wide uppercase">
            Payment Calculator
          </h1>
          <div className="mt-4 h-0.5 w-32 md:w-32 bg-gradient-to-r from-blue-500 via-blue-300 to-transparent rounded-full mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 border border-gray-100">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-gray-700 flex items-center font-medium text-sm md:text-base">
                    <DollarSign className="h-4 w-4 mr-2 text-blue-600" />
                    Property Value
                  </label>
                  <div className="bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-md">
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

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-gray-700 flex items-center font-medium text-sm md:text-base">
                    <Percent className="h-4 w-4 mr-2 text-blue-600" />
                    Down Payment
                  </label>
                  <div className="flex space-x-2">
                    <div className="bg-gray-50 border border-gray-200 px-2 py-1.5 rounded-md flex items-center">
                      <input
                        type="number"
                        value={downPaymentPercent}
                        onChange={(e) => {
                          setDownPaymentPercent(
                            Math.max(0, Math.min(100, Number(e.target.value)))
                          );
                        }}
                        className="w-12 bg-transparent text-gray-700 font-medium text-right text-sm focus:outline-none"
                      />
                      <span className="text-gray-700 font-medium ml-1 text-sm">
                        %
                      </span>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 px-2 py-1.5 rounded-md">
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

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-gray-700 flex items-center font-medium text-sm md:text-base">
                    <Clock className="h-4 w-4 mr-2 text-blue-600" />
                    Payment Period
                  </label>
                  <div className="bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-md flex items-center">
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
                      {months === 1 ? "mo" : "mos"}
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
                  <span>1 mo</span>
                  <span>60 mos</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 border border-gray-100">
            <div className="mb-4">
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">
                Payment Summary
              </h3>
              <div className="h-px bg-gray-200 w-full" />
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-8 mb-4">
              <div className="bg-gray-50 border border-gray-100 rounded-md p-3">
                <div className="text-gray-600 text-xs font-medium mb-1">
                  Property Value
                </div>
                <div className="text-sm md:text-base font-semibold text-gray-800">
                  {formatCurrency(propertyValue)}
                </div>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-md p-3">
                <div className="text-gray-600 text-xs font-medium mb-1">
                  Payment Period
                </div>
                <div className="text-sm md:text-base font-semibold text-gray-800">
                  {months} {months === 1 ? "month" : "months"}
                </div>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-md p-3">
                <div className="text-gray-600 text-xs font-medium mb-1">
                  Down Payment
                </div>
                <div className="text-sm md:text-base font-semibold text-gray-800">
                  {formatCurrency(downPaymentAmount)}
                </div>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-md p-3">
                <div className="text-gray-600 text-xs font-medium mb-1">
                  Finance Amount
                </div>
                <div className="text-sm md:text-base font-semibold text-gray-800">
                  {formatCurrency(totalPayment)}
                </div>
              </div>
            </div>

            <div className="bg-blue-600 rounded-lg lg:mt-10 p-2 md:py-4 text-center">
              <div className="text-blue-100 text-sm font-medium mb-1">
                Monthly Payment {formatCurrency(monthlyPayment)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </section>
  );
}
