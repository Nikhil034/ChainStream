'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { UnifiedRoute, compareRoutesToArc } from '../lib/lifi';
import { useSendToArc } from '../lib/arc-transactions';
import { useMultiChainBalances } from '../lib/hooks/useMultiChainBalances';
import { saveTransaction, updateTransactionStatus, Transaction } from '../lib/storage';
import { PAYMENT_THRESHOLD } from '../lib/constants';

interface PaymentAgentProps {
    totalCost: number;
    onPaymentComplete: () => void;
    onRoutesAnalyzed?: (routes: UnifiedRoute[]) => void;
    onRouteSelected?: (route: UnifiedRoute | null) => void;
    selectedRoute?: UnifiedRoute | null;
    routes?: UnifiedRoute[];
}

export function PaymentAgent({
    totalCost,
    onPaymentComplete,
    onRoutesAnalyzed,
    onRouteSelected,
    selectedRoute: externalSelectedRoute,
    routes: externalRoutes
}: PaymentAgentProps) {
    const { address } = useAccount();
    const balances = useMultiChainBalances(address);
    const { sendUSDC, hash, isPending, isConfirming, isConfirmed, explorerUrl } = useSendToArc();

    const [internalRoutes, setInternalRoutes] = useState<UnifiedRoute[]>([]);
    const [internalSelectedRoute, setInternalSelectedRoute] = useState<UnifiedRoute | null>(null);

    // Use external props if available, otherwise fallback to internal state
    const routes = externalRoutes?.length ? externalRoutes : internalRoutes;
    const selectedRoute = externalSelectedRoute !== undefined ? externalSelectedRoute : internalSelectedRoute;

    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [currentTxId, setCurrentTxId] = useState<string | null>(null);

    // Analyze routes when threshold is reached
    useEffect(() => {
        if (totalCost >= PAYMENT_THRESHOLD && address && !routes.length && !isAnalyzing) {
            analyzeRoutes();
        }
    }, [totalCost, address, routes.length, isAnalyzing]);

    // Update transaction status when hash is available
    useEffect(() => {
        if (hash && currentTxId && explorerUrl) {
            updateTransactionStatus(currentTxId, isConfirmed ? 'confirmed' : 'pending', hash, explorerUrl);
        }
    }, [hash, currentTxId, explorerUrl, isConfirmed]);

    const analyzeRoutes = async () => {
        if (!address) return;

        setIsAnalyzing(true);
        try {
            const balanceNumbers = {
                sepolia: parseFloat(balances.sepolia?.formatted || '0'),
                base: parseFloat(balances.base?.formatted || '0'),
                arbitrum: parseFloat(balances.arbitrum?.formatted || '0'),
            };

            const comparedRoutes = await compareRoutesToArc(totalCost, address, balanceNumbers);
            console.log('Routes analyzed:', comparedRoutes);
            setInternalRoutes(comparedRoutes);
            onRoutesAnalyzed?.(comparedRoutes);
            if (comparedRoutes.length > 0) {
                setInternalSelectedRoute(comparedRoutes[0]); // Auto-select cheapest
                onRouteSelected?.(comparedRoutes[0]);
            }
        } catch (error) {
            console.error('Route analysis error:', error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const executePayment = async () => {
        if (!selectedRoute || !address) return;

        try {
            // Create transaction record
            const txId = `tx-${Date.now()}`;
            setCurrentTxId(txId);

            const transaction: Transaction = {
                id: txId,
                timestamp: Date.now(),
                fromChain: selectedRoute.fromChain,
                fromChainName: selectedRoute.fromChainName,
                toChain: selectedRoute.toChain,
                toChainName: selectedRoute.toChainName,
                amount: parseFloat(selectedRoute.fromAmount),
                gasCost: selectedRoute.gasCostUSD,
                bridgeFee: selectedRoute.bridgeFeeUSD,
                totalCost: selectedRoute.totalCostUSD,
                status: 'pending',
                savings: routes.length > 1 ? routes[routes.length - 1].totalCostUSD - selectedRoute.totalCostUSD : 0,
            };

            saveTransaction(transaction);

            // Execute Arc transaction
            const recipientAddress = address; // Paying to ourselves for demo
            await sendUSDC(recipientAddress, selectedRoute.fromAmount);

            // Payment complete, reset state
            setInternalRoutes([]);
            setInternalSelectedRoute(null);
            onPaymentComplete();
        } catch (error) {
            console.error('Payment execution error:', error);
            if (currentTxId) {
                updateTransactionStatus(currentTxId, 'failed');
            }
        }
    };

    const canExecute = selectedRoute && !isPending && !isConfirming;

    return (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    🤖 Payment Agent
                </h2>
                <p className="text-slate-400 text-sm mt-1">Autonomous payment execution</p>
            </div>

            {totalCost >= PAYMENT_THRESHOLD && !address && (
                <div className="text-center py-8">
                    <div className="text-6xl mb-4 text-orange-400 animate-bounce">👛</div>
                    <p className="text-white font-bold text-lg mb-2">Ready to Pay!</p>
                    <p className="text-slate-300 mb-4">
                        Threshold reached (${totalCost.toFixed(2)}). Connect wallet to analyze routes.
                    </p>
                    <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg inline-block">
                        Your agent is waiting for walllet connection 🔌
                    </div>
                </div>
            )}

            {totalCost < PAYMENT_THRESHOLD && (
                <div className="text-center py-8">
                    <div className="text-6xl mb-4">💤</div>
                    <p className="text-slate-400">
                        Monitoring... Payment threshold not reached yet.
                    </p>
                    <p className="text-sm text-slate-500 mt-2">
                        (${totalCost.toFixed(2)} / ${PAYMENT_THRESHOLD.toFixed(2)})
                    </p>
                </div>
            )}

            {isAnalyzing && (
                <div className="text-center py-8">
                    <div className="inline-block animate-spin text-6xl mb-4">⚙️</div>
                    <p className="text-slate-300 font-semibold">Analyzing optimal routes...</p>
                </div>
            )}

            {selectedRoute && !isPending && !isConfirming && !isConfirmed && (
                <div>
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-emerald-500/30 mb-4">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-2xl">✨</span>
                            <span className="font-semibold text-emerald-400">Recommended Route</span>
                        </div>
                        <div className="text-white space-y-2">
                            <div className="flex justify-between">
                                <span className="text-slate-400">From:</span>
                                <span className="font-mono">{selectedRoute.fromChainName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">To:</span>
                                <span className="font-mono">Arc Testnet</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Amount:</span>
                                <span className="font-mono">${selectedRoute.fromAmount} USDC</span>
                            </div>
                            <div className="flex justify-between font-bold text-emerald-400">
                                <span>Total Cost:</span>
                                <span>${selectedRoute.totalCostUSD.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={executePayment}
                        disabled={!canExecute}
                        className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 disabled:from-slate-700 disabled:to-slate-700 text-white font-bold py-4 px-6 rounded-xl transition-all disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                        {canExecute ? '🚀 Execute Payment' : '⏳ Processing...'}
                    </button>
                </div>
            )}

            {(isPending || isConfirming) && (
                <div className="text-center py-8">
                    <div className="inline-block animate-bounce text-6xl mb-4">🚀</div>
                    <p className="text-white font-semibold mb-2">
                        {isPending ? 'Awaiting wallet approval...' : 'Transaction pending...'}
                    </p>
                    {hash && (
                        <a
                            href={explorerUrl || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-cyan-400 hover:text-cyan-300 underline"
                        >
                            View on Explorer →
                        </a>
                    )}
                </div>
            )}

            {isConfirmed && hash && (
                <div className="text-center py-8">
                    <div className="text-6xl mb-4">✅</div>
                    <p className="text-emerald-400 font-semibold mb-2">Payment Confirmed!</p>
                    <a
                        href={explorerUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-cyan-400 hover:text-cyan-300 underline"
                    >
                        View on Arc Explorer →
                    </a>
                </div>
            )}
        </div>
    );
}
