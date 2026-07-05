"use client";

import { Shield, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import AccountPageHeader from "@/components/account/accountpageHeader";

export default function SecurityPage() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const fields = [
    { label: "Current password", show: showCurrent, toggle: () => setShowCurrent((p) => !p) },
    { label: "New password",     show: showNew,     toggle: () => setShowNew((p) => !p) },
    { label: "Confirm password", show: showConfirm, toggle: () => setShowConfirm((p) => !p) },
  ];

  return (
    <>
      <AccountPageHeader title="Security" description="Update your password and keep your account safe" />
      <div className="bg-white rounded-2xl border border-[#f0e8e7] shadow-sm p-5 sm:p-7 space-y-6">

        {/* Status banner */}
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
          <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-green-800">Your account is secure</p>
            <p className="text-xs text-green-600">No suspicious activity detected.</p>
          </div>
        </div>

        {/* Change password */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-4 h-4 text-[#5B1A18]" />
            <h2 className="text-sm font-semibold text-[#2d1010]">Change password</h2>
          </div>

          <div className="space-y-3">
            {fields.map(({ label, show, toggle }) => (
              <div key={label}>
                <label className="block text-xs font-medium text-[#9b7b7a] mb-1.5">{label}</label>
                <div className="relative">
                  <input
                    type={show ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 pr-10 text-sm text-[#2d1010] border border-[#f0e8e7] rounded-xl outline-none focus:border-[#5B1A18] focus:ring-2 focus:ring-[#5B1A18]/10 transition-all bg-[#fdf8f7]"
                  />
                  <button
                    type="button"
                    onClick={toggle}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9b7b7a] hover:text-[#5B1A18] transition-colors"
                  >
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-5 w-full bg-[#5B1A18] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#7a2320] transition-colors">
            Update password
          </button>
        </div>
      </div>
    </>
  );
}