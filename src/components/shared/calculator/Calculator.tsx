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
  }, [propertyValue, downPaymentPercent]);

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
    <section className="w-full px-6 md:px-24 pb-24 pt-10 relative overflow-hidden">
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

      {/* Content with relative z-index */}
      <div className="relative z-10">
        <div className="flex w-full flex-col justify-center items-center mb-10 gap-2">
          <p className="text-sm md:text-base "> </p>
          <h1 className="text-3xl md:text-4xl font-extrabold font-geo2 pt-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-sky-600 to-blue-400 tracking-wide uppercase drop-shadow-md">
            Payment Calculator
          </h1>
          <div className="mt-2 h-1 w-24 md:w-80 bg-gradient-to-r from-blue-500 via-blue-300 to-transparent rounded-full"></div>
        </div>

        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <div className="space-y-8">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-gray-700 flex items-center font-medium text-lg">
                    <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
                    Property Value
                  </label>
                  <div className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg">
                    <input
                      type="number"
                      value={propertyValue}
                      onChange={(e) =>
                        setPropertyValue(Math.max(0, Number(e.target.value)))
                      }
                      className="w-28 bg-transparent text-gray-700 font-medium text-right focus:outline-none"
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
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>$10,000</span>
                  <span>$200,000</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-gray-700 flex items-center font-medium text-lg">
                    <Percent className="h-5 w-5 mr-2 text-blue-600" />
                    Down Payment
                  </label>
                  <div className="flex space-x-3">
                    <div className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg flex items-center">
                      <input
                        type="number"
                        value={downPaymentPercent}
                        onChange={(e) => {
                          setDownPaymentPercent(
                            Math.max(0, Math.min(100, Number(e.target.value)))
                          );
                        }}
                        className="w-16 bg-transparent text-gray-700 font-medium text-right focus:outline-none"
                      />
                      <span className="text-gray-700 font-medium ml-1">%</span>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg">
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
                        className="w-24 bg-transparent text-gray-700 font-medium text-right focus:outline-none"
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
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-gray-700 flex items-center font-medium text-lg">
                    <Clock className="h-5 w-5 mr-2 text-blue-600" />
                    Payment Period
                  </label>
                  <div className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg flex items-center">
                    <input
                      type="number"
                      value={months}
                      onChange={(e) =>
                        setMonths(
                          Math.max(1, Math.min(60, Number(e.target.value)))
                        )
                      }
                      className="w-16 bg-transparent text-gray-700 font-medium text-right focus:outline-none"
                    />
                    <span className="text-gray-700 font-medium ml-2">
                      {months === 1 ? "month" : "months"}
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
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>1 month</span>
                  <span>60 months</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 flex flex-col">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Payment Summary
              </h3>
              <div className="h-px bg-gray-200 w-full" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-grow mb-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="text-gray-600 text-sm font-medium mb-1">
                  Property Value
                </div>
                <div className="text-xl font-semibold text-gray-800">
                  {formatCurrency(propertyValue)}
                </div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="text-gray-600 text-sm font-medium mb-1">
                  Payment Period
                </div>
                <div className="text-xl font-semibold text-gray-800">
                  {months} {months === 1 ? "month" : "months"}
                </div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="text-gray-600 text-sm font-medium mb-1">
                  Down Payment
                </div>
                <div className="text-xl font-semibold text-gray-800">
                  {formatCurrency(downPaymentAmount)}
                </div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="text-gray-600 text-sm font-medium mb-1">
                  Finance Amount
                </div>
                <div className="text-xl font-semibold text-gray-800">
                  {formatCurrency(totalPayment)}
                </div>
              </div>
            </div>
            <div className="bg-blue-600 rounded-lg p-6 text-center mt-auto">
              <div className="text-blue-100 text-lg font-medium mb-2">
                Your Estimated Monthly Payment
              </div>
              <div className="text-3xl font-bold text-white">
                {formatCurrency(monthlyPayment)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
