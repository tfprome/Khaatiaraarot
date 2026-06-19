"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axiosinterceptor";
import AccountPageHeader from "@/components/account/accountpageHeader";
import ProfileSection from "@/components/account/profilesection";
import LoadingSkeleton from "@/components/account/loadingskeleton";
import { UserProfile } from "@/Types/userTypes";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/api/v1/auth/me");
        console.log("profile response", data);
        const profile =  data.data
        setUser(profile);
        // if (profile?.name) localStorage.setItem("userName", profile.name);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);
  console.log("user profile", user);

  return (
    <>
      <AccountPageHeader title="My Profile" description="Manage your personal details" />
      <div className="bg-white rounded-2xl border border-[#f0e8e7] shadow-sm p-5 sm:p-7">
        {loading ? <LoadingSkeleton rows={4} /> : user ? <ProfileSection user={user} /> : null}
      </div>
    </>
  );
}