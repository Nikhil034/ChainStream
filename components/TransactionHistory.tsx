'use client';

import { useState, useEffect } from 'react';
import { getTransactions, Transaction } from '../lib/storage';
import { CHAIN_METADATA } from '../lib/constants';

export function TransactionHistory() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        // Load transactions on mount
        setTransactions(getTransactions());

        // Refresh every 5 seconds to catch updates
        const interval = setInterval(() => {
            setTransactions(getTransactions());
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    if (transactions.length === 0) {
        return (
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    📜 Transaction History
                </h2>
                <div className="text-center py-8 text-slate-400">
                    <div className="text-6xl mb-4">📭</div>
                    <p>No transactions yet. Execute your first payment!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    📜 Transaction History
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                    {transactions.length} payment{transactions.length !== 1 ? 's' : ''} executed
                </p>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {transactions.map((tx) => {
                    const fromChainMeta = CHAIN_METADATA[tx.fromChain as keyof typeof CHAIN_METADATA];
                    const toChainMeta = CHAIN_METADATA[tx.toChain as keyof typeof CHAIN_METADATA];
                    const statusColors = {
                        pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
                        confirmed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
                        failed: 'bg-red-500/20 text-red-400 border-red-500/30',
                    };

                    const statusIcons = {
                        pending: '⏳',
                        confirmed: '✅',
                        failed: '❌',
                    };

                    return (
                        <div
                            key={tx.id}
                            className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 hover:border-slate-600 transition-all"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-bold border ${statusColors[tx.status]}`}
                                    >
                                        {statusIcons[tx.status]} {tx.status.toUpperCase()}
                                    </span>
                                    {tx.savings > 0 && (
                                        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full">
                                            Saved ${tx.savings.toFixed(2)}
                                        </span>
                                    )}
                                </div>
                                <div className="text-sm text-slate-400">
                                    {new Date(tx.timestamp).toLocaleString()}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                                <span className={`px-3 py-1 rounded-lg font-semibold text-sm ${fromChainMeta.color} bg-slate-900`}>
                                    {tx.fromChainName}
                                </span>
                                <span className="text-slate-500">→</span>
                                <span className={`px-3 py-1 rounded-lg font-semibold text-sm ${toChainMeta.color} bg-slate-900`}>
                                    {tx.toChainName}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                                <div>
                                    <div className="text-slate-400 text-xs mb-1">Amount</div>
                                    <div className="text-white font-mono">${tx.amount.toFixed(2)} USDC</div>
                                </div>
                                <div>
                                    <div className="text-slate-400 text-xs mb-1">Total Cost</div>
                                    <div className="text-white font-mono">${tx.totalCost.toFixed(2)}</div>
                                </div>
                            </div>

                            {tx.hash && tx.explorerUrl && (
                                <a
                                    href={tx.explorerUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-xs text-cyan-400 hover:text-cyan-300 underline font-mono truncate"
                                >
                                    {tx.hash}
                                </a>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
