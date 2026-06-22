import AccountSidebar from "@/components/account/accountsidebar";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdf8f7]">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-8 items-start">

          {/* Sidebar — hidden on mobile, shown md+ */}
          <div className="hidden md:block w-64 shrink-0 sticky top-6">
            <AccountSidebar />
          </div>

          {/* Page content */}
          <div className="flex-1 min-w-0">
            {/* Mobile sidebar sits above content, full width */}
            <div className="md:hidden mb-4">
              <AccountSidebar />
            </div>
            {children}
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}