import Image from "next/image";
import Navbar from "@/components/navbar";
import HeroBanner from "@/components/herobanner";
import FeaturedCategories from "@/components/categories";
import TopSellingProducts from "@/components/topsellers";
import PuritySection from "@/components/puritysection";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="">
      <Navbar/>
      <HeroBanner/>
      <TopSellingProducts/>
      <FeaturedCategories/>
      <PuritySection/>
      <Footer/>
    </div>
  );
}
