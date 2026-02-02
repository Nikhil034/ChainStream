"use client";

import { useAccount } from "wagmi";
import { useState, useEffect } from "react";
import { Wallet } from "lucide-react";
import { useMultiChainBalances } from "../lib/hooks/useMultiChainBalances";
import { CHAIN_METADATA, CHAIN_IDS } from "../lib/constants";

export function BalanceTicker() {
    const { address, isConnected } = useAccount();
    const [mounted, setMounted] = useState(false);
    const balances = useMultiChainBalances(address);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const balanceItems = [
        {
            chain: "Sepolia",
            bal: balances.sepolia,
            color: CHAIN_METADATA[CHAIN_IDS.SEPOLIA].color,
        },
        {
            chain: "Base Sepolia",
            bal: balances.base,
            color: CHAIN_METADATA[CHAIN_IDS.BASE_SEPOLIA].color,
        },
        {
            chain: "Arbitrum Sepolia",
            bal: balances.arbitrum,
            color: CHAIN_METADATA[CHAIN_IDS.ARBITRUM_SEPOLIA].color,
        },
        {
            chain: "Arc Testnet",
            bal: balances.arc,
            color: CHAIN_METADATA[CHAIN_IDS.ARC_TESTNET].color,
        },
    ];

    return (
        <div className="w-full bg-slate-900 border-b border-slate-800 py-3 overflow-hidden flex items-center shadow-sm z-50 relative">
            <div className="px-6 flex items-center gap-2 border-r border-slate-800 mr-4 shrink-0 bg-slate-900 z-10">
                <Wallet className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300 text-sm font-mono font-bold tracking-wider">
                    LIQUIDITY NEXUS
                </span>
            </div>

            <div className="flex items-center gap-12 animate-marquee whitespace-nowrap mask-linear hover:pause">
                {[...balanceItems, ...balanceItems].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                        <span
                            className={`text-xs font-bold uppercase ${item.color} px-2 py-0.5 bg-slate-800/50 rounded`}
                        >
                            {item.chain}
                        </span>
                        <span className="text-slate-200 font-mono text-sm font-medium">
                            {isConnected && item.bal
                                ? parseFloat(item.bal.formatted).toFixed(6)
                                : "0.000000"}
                            <span className="text-slate-500 ml-1">
                                {item.bal?.symbol || "ETH"}
                            </span>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

