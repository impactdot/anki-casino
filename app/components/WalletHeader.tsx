"use client";

import { useTonConnectUI } from "@tonconnect/ui-react";
import { Address } from "@ton/core";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function WalletHeader() {
  const [tonConnectUI] = useTonConnectUI();
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  const formatAddress = (address: string) => {
    const tempAddress = Address.parse(address).toString();
    return `${tempAddress.slice(0, 4)}...${tempAddress.slice(-4)}`;
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(false);
    router.push("/profile");
  };

  const handleDisconnectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(false);
    // Disconnect functionality can be implemented here
    console.log("Disconnect clicked");
  };

  return (
    <div className="fixed top-0 right-0 p-4">
      {tonConnectUI?.account?.address && (
        <div className="relative">
          <div
            className="bg-gray-100 rounded-lg px-4 py-2 shadow-md cursor-pointer hover:bg-gray-200"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <p className="text-sm font-medium text-gray-800">
              {formatAddress(tonConnectUI.account.address)}
            </p>
          </div>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
              <div
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={handleProfileClick}
              >
                Profile Page
              </div>
              <div
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
                onClick={handleDisconnectClick}
              >
                Disconnect
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
