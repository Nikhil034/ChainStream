"use client";

import { useAccount, useBalance } from "wagmi";
import { useEffect, useState } from "react";
import { Wallet } from "lucide-react";
import { formatUnits } from "viem";

// Contract Addresses for USDC on various chains
const USDC_ADDRESSES = {
    // Mainnet
    1: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    // Base
    8453: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    // Arbitrum
    42161: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
} as const;

export function BalanceTicker() {
    const { address, isConnected } = useAccount();
    const [mounted, setMounted] = useState(false);

    // 1. Ethereum Mainnet Balance
    const { data: ethUsdc } = useBalance({
        address,
        // @ts-ignore - Wagmi type definition might be mismatching, but 'token' is valid runtime param
        token: USDC_ADDRESSES[1],
        chainId: 1,
    });

    // 2. Base Balance
    const { data: baseUsdc } = useBalance({
        address,
        // @ts-ignore
        token: USDC_ADDRESSES[8453],
        chainId: 8453,
    });

    // 3. Arbitrum Balance
    const { data: arbUsdc } = useBalance({
        address,
        // @ts-ignore
        token: USDC_ADDRESSES[42161],
        chainId: 42161,
    });

    // 4. Arc Testnet (Native token usually, or mock)
    const { data: arcBalance } = useBalance({
        address,
        chainId: 5042002,
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const balances = [
        {
            chain: "Ethereum",
            bal: ethUsdc,
            color: "text-blue-500"
        },
        {
            chain: "Base",
            bal: baseUsdc,
            color: "text-blue-600"
        },
        {
            chain: "Arbitrum",
            bal: arbUsdc,
            color: "text-blue-400"
        },
        {
            chain: "Arc Testnet",
            bal: arcBalance,
            color: "text-orange-500"
        },
    ];

    return (
        <div className="w-full bg-slate-900 border-b border-slate-800 py-3 overflow-hidden flex items-center shadow-sm z-50 relative">
            <div className="px-6 flex items-center gap-2 border-r border-slate-800 mr-4 shrink-0 bg-slate-900 z-10">
                <Wallet className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300 text-sm font-mono font-bold tracking-wider">LIQUIDITY NEXUS</span>
            </div>

            <div className="flex items-center gap-12 animate-marquee whitespace-nowrap mask-linear hover:pause">
                {[...balances, ...balances].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                        <span className={`text-xs font-bold uppercase ${item.color} px-2 py-0.5 bg-slate-800/50 rounded`}>
                            {item.chain}
                        </span>
                        <span className="text-slate-200 font-mono text-sm font-medium">
                            {isConnected && item.bal?.value !== undefined
                                ? parseFloat(formatUnits(item.bal.value, item.bal.decimals)).toFixed(2)
                                : "0.00"}
                            <span className="text-slate-500 ml-1">{item.bal?.symbol || "USDC"}</span>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
