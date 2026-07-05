// app/(main)/layout.tsx

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CartDrawerWrapper from "@/components/cartdrawerwrapper";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <CartDrawerWrapper />
      {children}
      <Footer />
    </>
  );
}