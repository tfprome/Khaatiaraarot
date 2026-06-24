"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axiosinterceptor";
import AccountPageHeader from "@/components/account/accountpageHeader";
import ProfileSection from "@/components/account/profilesection";
import LoadingSkeleton from "@/components/account/loadingskeleton";
import { UserProfile } from "@/Types/userTypes";
import { toast } from "react-toastify";
import { useAppSelector } from "@/store/hooks";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/api/v1/auth/me");
        // console.log("profile response", data);
        const profile = data.data
        setUser(profile);
      } catch (error: any) {
        //console.log(error)
        if (error?.status === 401) {
          router.push("/login");
          toast("Please login to view your profile", {
            position: "bottom-right",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            style: {
              background: "#5B1A18",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: "600",
              padding: "16px",
              minWidth: "320px",
              minHeight: "70px",
              borderRadius: "12px",
            },
          });
        }
        else {
          toast.error(error.error?.message ?? "Something went wrong", {
            position: "bottom-right",
            autoClose: 1500,
            hideProgressBar: true,
            style: {
              background: "#f00808",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: "600",
              padding: "16px",
              minWidth: "320px",
              minHeight: "70px",
              borderRadius: "12px",
            },
          })
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);


  return (
    <>
      <AccountPageHeader title="My Profile" description="Manage your personal details" />
      <div className="bg-white rounded-2xl border border-[#f0e8e7] shadow-sm p-5 sm:p-7">
        {loading ? <LoadingSkeleton rows={4} /> : user ? <ProfileSection user={user} /> : null}
      </div>
    </>
  );
}