"use client";

import { useState, useEffect } from "react";
import { Calculator, DollarSign, Percent, Clock } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useTranslations } from "next-intl";

export default function PaymentCalculator() {
  const t = useTranslations("calculator");
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
    <section
      style={{ backgroundImage: `url('/images/bg-body.jpg')` }}
      className="w-full px-6 md:px-16 relative py-10 md:py-5  overflow-hidden  tracking-widest  font-geo2"
    >
      <div className="container mx-auto">
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center mb-4">
            <Calculator className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-800 tracking-wide">
              {t("paymentCalculator")}
            </h2>
          </div>
          <div className="h-[2px] bg-gradient-to-r from-transparent via-blue-500/60 to-transparent rounded-full w-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 via-slate-800 to-blue-950 border border-white/50  p-5">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-white flex items-center font-medium text-xl sm:text-xl ">
                    <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-100/70" />
                    {t("propertyValue")}
                  </label>
                  <div className="bg-gradient-to-br from-blue-900 via-slate-800 to-blue-950 border border-white/50 px-3 py-2 rounded-lg">
                    <input
                      type="number"
                      value={propertyValue}
                      onChange={(e) =>
                        setPropertyValue(Math.max(0, Number(e.target.value)))
                      }
                      className="w-24 bg-transparent text-white font-medium text-right focus:outline-none"
                    />
                  </div>
                </div>
                <Slider
                  value={[propertyValue]}
                  min={10000}
                  max={200000}
                  step={5000}
                  onValueChange={(value) => setPropertyValue(value[0])}
                  className="[&_[role=slider]]:bg-blue-700 [&_[role=slider]]:border-blue-700/40 [&_.bg-primary]:bg-blue-700/60"
                />
                <div className="flex justify-between text-base text-blue-100/70">
                  <span>$10,000</span>
                  <span>$200,000</span>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 via-slate-800 to-blue-950 border border-white/50  p-5">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-white flex items-center font-medium text-lg sm:text-xl ">
                    <Percent className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-100/70" />
                    {t("downPayment")}
                  </label>
                  <div className="flex space-x-2">
                    <div className="bg-gradient-to-br from-blue-900 via-slate-800 to-blue-950 border border-white/50 px-3 py-2 rounded-lg">
                      <input
                        type="number"
                        value={downPaymentPercent}
                        onChange={(e) => {
                          setDownPaymentPercent(
                            Math.max(0, Math.min(100, Number(e.target.value)))
                          );
                        }}
                        className="w-12 bg-transparent text-white font-medium text-right focus:outline-none"
                      />
                      <span className="text-white font-medium">%</span>
                    </div>
                    <div className="bg-gradient-to-br from-blue-900 via-slate-800 to-blue-950 border border-white/50 px-3 py-2 rounded-lg">
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
                        className="w-20 bg-transparent text-white font-medium text-right focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
                <Slider
                  value={[downPaymentPercent]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => setDownPaymentPercent(value[0])}
                  className="[&_[role=slider]]:bg-blue-700 [&_[role=slider]]:border-blue-700/40 [&_.bg-primary]:bg-blue-700/60"
                />
                <div className="flex justify-between text-base text-blue-100/70">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 via-slate-800 to-blue-950 border border-white/50  p-5">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-white flex items-center font-medium text-lg sm:text-xl ">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-100/70" />
                    {t("paymentPeriod")}
                  </label>
                  <div className="bg-gradient-to-br from-blue-900 via-slate-800 to-blue-950 border border-white/50 px-3 py-2 rounded-lg flex items-center">
                    <input
                      type="number"
                      value={months}
                      onChange={(e) =>
                        setMonths(
                          Math.max(1, Math.min(60, Number(e.target.value)))
                        )
                      }
                      className="w-12 bg-transparent text-white font-medium text-right focus:outline-none"
                    />
                    <span className="text-white font-medium ml-2">
                      {months === 1 ? t("month") : t("months")}
                    </span>
                  </div>
                </div>
                <Slider
                  value={[months]}
                  min={1}
                  max={60}
                  step={1}
                  onValueChange={(value) => setMonths(value[0])}
                  className="[&_[role=slider]]:bg-blue-700 [&_[role=slider]]:border-blue-700/40 [&_.bg-primary]:bg-blue-700/60"
                />
                <div className="flex justify-between text-base text-blue-100/70">
                  <span>1 {t("month")}</span>
                  <span>60 {t("months")}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 via-slate-800 to-blue-950 border border-white/50  p-4">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-3 drop-shadow-[0_4px_12px_rgba(30,58,138,0.8)]">
                {t("paymentSummary")}
              </h3>
              <div className="h-[2px] bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-full w-full shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-900 via-slate-800 to-blue-950 border border-white/50 rounded-lg p-4 shadow-lg shadow-blue-900/30">
                <div className="text-blue-100/70 text-base font-medium mb-1">
                  {t("propertyValue")}
                </div>
                <div className="text-xl font-semibold text-white ">
                  {formatCurrency(propertyValue)}
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-900 via-slate-800 to-blue-950 border border-white/50 rounded-lg p-4 shadow-lg shadow-blue-900/30">
                <div className="text-blue-100/70 text-base font-medium mb-1">
                  {t("paymentPeriod")}
                </div>
                <div className="text-xl font-semibold text-white ">
                  {months} {months === 1 ? t("month") : t("months")}
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-900 via-slate-800 to-blue-950 border border-white/50 rounded-lg p-4 shadow-lg shadow-blue-900/30">
                <div className="text-blue-100/70 text-base font-medium mb-1">
                  {t("downPayment")}
                </div>
                <div className="text-xl font-semibold text-white ">
                  {formatCurrency(downPaymentAmount)}
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-900 via-slate-800 to-blue-950 border border-white/50 rounded-lg p-4 shadow-lg shadow-blue-900/30">
                <div className="text-blue-100/70 text-base font-medium mb-1">
                  {t("financeAmount")}
                </div>
                <div className="text-xl font-semibold text-white ">
                  {formatCurrency(totalPayment)}
                </div>
              </div>
              <div className="col-span-2 bg-gradient-to-br from-blue-900 via-slate-800 to-blue-950 border border-white/50 rounded-lg p-4 shadow-xl shadow-blue-900/50">
                <div className="text-blue-100/70 text-sm font-medium mb-1">
                  {t("monthlyPayment")}
                </div>
                <div className="text-2xl font-bold text-white drop-shadow-[0_4px_12px_rgba(30,58,138,0.8)]">
                  {formatCurrency(monthlyPayment)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}