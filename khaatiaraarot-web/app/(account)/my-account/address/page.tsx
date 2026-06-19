"use client";

import { MapPin, Plus } from "lucide-react";
import AccountPageHeader from "@/components/account/accountpageHeader";
import EmptyState from "@/components/account/emptystate";
import AddressCard, { Address } from "@/components/account/addresscard";

const MOCK_ADDRESSES: Address[] = [];

export default function AddressesPage() {
  return (
    <>
      <AccountPageHeader title="My Addresses" description="Manage your delivery addresses" />
      <div className="bg-white rounded-2xl border border-[#f0e8e7] shadow-sm p-5 sm:p-7">
        {MOCK_ADDRESSES.length > 0 && (
          <div className="flex justify-end mb-4">
            <button className="flex items-center gap-1.5 text-sm font-semibold text-[#5B1A18] border-2 border-[#5B1A18] px-4 py-2 rounded-xl hover:bg-[#5B1A18] hover:text-white transition-all">
              <Plus size={15} />
              Add address
            </button>
          </div>
        )}
        {MOCK_ADDRESSES.length === 0 ? (
          <EmptyState
            icon={MapPin}
            title="No addresses saved"
            message="Add a delivery address to speed up checkout."
            action={{ label: "Add address", href: "#" }}
          />
        ) : (
          <div className="space-y-3">
            {MOCK_ADDRESSES.map((address) => (
              <AddressCard key={address.id} address={address} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}