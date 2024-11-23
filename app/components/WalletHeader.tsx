"use client";

import { useTonConnectUI } from "@tonconnect/ui-react";
import { Address } from "@ton/core";

export default function WalletHeader() {
    const [tonConnectUI] = useTonConnectUI();

    const formatAddress = (address: string) => {
        const tempAddress = Address.parse(address).toString();
        return `${tempAddress.slice(0, 4)}...${tempAddress.slice(-4)}`;
    };

    return (
        <div className="fixed top-0 right-0 p-4">
            {tonConnectUI?.account?.address && (
                <div className="bg-gray-100 rounded-lg px-4 py-2 shadow-md">
                    <p className="text-sm font-medium text-gray-800">
                        {formatAddress(tonConnectUI.account.address)}
                    </p>
                </div>
            )}
        </div>
    );
}
