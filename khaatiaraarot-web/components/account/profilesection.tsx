import { Clock } from "lucide-react";
import { UserProfile } from "@/Types/userTypes";

function getInitial(user: UserProfile): string {
  if (user.fullName?.trim()) return user.fullName.trim()[0].toUpperCase();
  if (user.email?.trim()) return user.email.trim()[0].toUpperCase();
  return "U";
}

export default function ProfileSection({ user }: { user: UserProfile }) {
  const joined = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    })
    : null;

  return (
    <div className="space-y-6">
      {/* Hero card */}
      <div className="bg-gradient-to-br from-[#5B1A18] to-[#7a2320] rounded-2xl p-6 flex items-center gap-5 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 shadow-md">
          <span className="text-white font-bold text-2xl tracking-wide">
            {getInitial(user)}
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-white font-semibold text-lg leading-tight truncate">
            {user.fullName ?? "Hello there!"}
          </p>
          <p className="text-[#f5c9c8] text-sm truncate">{user.email ?? ""}</p>
          {joined && (
            <div className="flex items-center gap-1 mt-1.5">
              <Clock className="w-3 h-3 text-[#f5c9c8]" />
              <span className="text-[#f5c9c8] text-xs">Member since {joined}</span>
            </div>
          )}
        </div>
      </div>

      {/* Info rows */}
      <div className="bg-white rounded-2xl border border-[#f0e8e7] divide-y divide-[#f0e8e7]">
        {[
          { label: "Full name", value: user.fullName ?? "—" },
          { label: "Email address", value: user.email ?? "—" },
          { label: "Account role", value: user.role ?? "—" },
          { label: "Contact number", value: user.phone ?? "—" },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between px-5 py-4">
            <span className="text-sm text-[#9b7b7a] font-medium w-32 flex-shrink-0">{label}</span>
            <span className="text-sm text-[#2d1010] font-medium text-right truncate">{value}</span>
          </div>
        ))}
      </div>

      <button
        disabled
        className="w-full border-2 border-[#5B1A18] text-[#5B1A18] rounded-xl py-3 text-sm font-semibold cursor-not-allowed opacity-50 hover:opacity-50"
      >
        Edit Profile
      </button>
    </div>
  );
}