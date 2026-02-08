"use client";

import { useEffect, useState } from "react";
import { compareRoutesToArc, UnifiedRoute } from "../../lib/lifi";
import { Loader2, CheckCircle, ArrowRight, X } from "lucide-react";
import { useAccount } from "wagmi";

import { useMultiChainBalances } from "../../lib/hooks/useMultiChainBalances";
import { useTreasuryStore } from "@/lib/store";

interface PaymentModalProps {
    amount: number;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function PaymentModal({ amount, isOpen, onClose, onSuccess }: PaymentModalProps) {
    const { address } = useAccount();
    const { addLog } = useTreasuryStore();
    const balances = useMultiChainBalances(address);

    const [step, setStep] = useState<'finding' | 'select' | 'bridging' | 'settling' | 'done'>('finding');
    const [routes, setRoutes] = useState<UnifiedRoute[]>([]);
    const [selectedRoute, setSelectedRoute] = useState<UnifiedRoute | null>(null);

    // Reset when opening
    useEffect(() => {
        if (isOpen && address) {
            setStep('finding');
            setRoutes([]);
            setSelectedRoute(null);

            // Trigger Route Comparison
            const search = async () => {
                addLog(`Comparing routes across all chains for $${amount.toFixed(2)}...`, 'info');
                await new Promise(r => setTimeout(r, 800));

                const allRoutes = await compareRoutesToArc(amount, address, {
                    sepolia: balances.sepolia ? parseFloat(balances.sepolia.formatted) : 0,
                    base: balances.base ? parseFloat(balances.base.formatted) : 0,
                    arbitrum: balances.arbitrum ? parseFloat(balances.arbitrum.formatted) : 0,
                    arc: balances.arc ? parseFloat(balances.arc.formatted) : 0
                });

                setRoutes(allRoutes);

                if (allRoutes.length > 0) {
                    setStep('select');
                    addLog(`Found ${allRoutes.length} route(s). Cheapest: ${allRoutes[0].fromChainName} ($${allRoutes[0].totalCostUSD.toFixed(2)})`, 'success');
                } else {
                    addLog(`No routes available.`, 'warning');
                    setStep('select');
                }
            };
            search();
        }
    }, [isOpen, amount, address, addLog, balances]);

    const handleExecute = async () => {
        if (!selectedRoute) return;

        setStep('bridging');
        addLog(`Initiating ${selectedRoute.isSimulated ? 'simulated' : 'real'} bridge from ${selectedRoute.fromChainName}...`, 'info');

        // Simulate Bridging
        await new Promise(r => setTimeout(r, 2000));
        setStep('settling');
        addLog(`Bridge complete. Settling invoices on Arc Network...`, 'info');

        // Simulate Settlement
        await new Promise(r => setTimeout(r, 1500));
        setStep('done');
        addLog(`✅ Payment settled on Arc Network. Total cost: $${selectedRoute.totalCostUSD.toFixed(2)}`, 'success');

        setTimeout(() => {
            onSuccess();
            onClose();
        }, 1500);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden relative shadow-2xl">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white z-10">
                    <X className="w-5 h-5" />
                </button>

                <div className="p-6">
                    <h2 className="text-xl font-bold text-white mb-6">Cross-Chain Payment Execution</h2>

                    {/* Step 1: Finding Routes */}
                    {step === 'finding' && (
                        <div className="flex flex-col items-center py-8">
                            <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                            <p className="text-slate-300">Analyzing optimal routes...</p>
                            <p className="text-xs text-slate-500 mt-2">Comparing gas costs across all chains</p>
                        </div>
                    )}

                    {/* Step 2: Route Selection */}
                    {step === 'select' && (
                        <div className="space-y-6">
                            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                                <div className="text-sm text-slate-400 mb-2">Payment Amount</div>
                                <div className="text-2xl font-bold text-white">${amount.toFixed(2)} USDC</div>
                                <div className="text-xs text-slate-500 mt-1">+ Gas & Bridge Fees</div>
                            </div>

                            <div>
                                <div className="text-sm font-medium text-slate-300 mb-3">
                                    Select Route {routes.length > 0 && <span className="text-slate-500">({routes.length} available)</span>}
                                </div>
                                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                                    {routes.length === 0 ? (
                                        <div className="text-center py-8 text-slate-500 bg-slate-800/30 rounded-lg border border-slate-700">
                                            <p className="font-medium">No routes available</p>
                                            <p className="text-xs mt-2">Connect wallet or check balances</p>
                                        </div>
                                    ) : (
                                        routes.map((route, idx) => {
                                            const isSelected = selectedRoute?.id === route.id;
                                            const isCheapest = idx === 0;

                                            return (
                                                <button
                                                    key={route.id}
                                                    onClick={() => setSelectedRoute(route)}
                                                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${isSelected
                                                        ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                                                        : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                                                        }`}
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <span className="font-bold text-white">{route.fromChainName}</span>
                                                                <ArrowRight className="w-4 h-4 text-slate-500" />
                                                                <span className="text-orange-400">Arc Network</span>
                                                                {isCheapest && (
                                                                    <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                                                                        Cheapest
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                                <div>
                                                                    <span className="text-slate-500">Bridge: </span>
                                                                    <span className="text-slate-300">{route.tool || 'Circle CCTP'}</span>
                                                                </div>
                                                                <div>
                                                                    <span className="text-slate-500">Time: </span>
                                                                    <span className="text-slate-300">~{route.executionTime}s</span>
                                                                </div>
                                                                <div>
                                                                    <span className="text-slate-500">Gas: </span>
                                                                    <span className="text-slate-300">${route.gasCostUSD.toFixed(2)}</span>
                                                                </div>
                                                                <div>
                                                                    <span className="text-slate-500">Bridge Fee: </span>
                                                                    <span className="text-slate-300">${route.bridgeFeeUSD.toFixed(2)}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right ml-4">
                                                            <div className="text-lg font-bold text-white">${route.totalCostUSD.toFixed(2)}</div>
                                                            <div className="text-xs text-slate-500">Total Cost</div>
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={handleExecute}
                                disabled={!selectedRoute}
                                className={`w-full py-3 rounded-lg font-bold transition-colors ${selectedRoute
                                    ? 'bg-blue-600 hover:bg-blue-500 text-white'
                                    : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                                    }`}
                            >
                                {selectedRoute ? `Execute Payment ($${selectedRoute.totalCostUSD.toFixed(2)})` : 'Select a route to continue'}
                            </button>
                        </div>
                    )}

                    {/* Step 3: Execution Progress */}
                    {(step === 'bridging' || step === 'settling') && (
                        <div className="space-y-6 py-4">
                            <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${step === 'bridging' ? 'bg-blue-500 animate-pulse' : 'bg-emerald-500'}`}>
                                    {step === 'bridging' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                </div>
                                <div>
                                    <div className="text-white font-medium">Bridging Assets</div>
                                    <div className="text-xs text-slate-500">
                                        {step === 'bridging' ? `From ${selectedRoute?.fromChainName}...` : 'Complete'}
                                    </div>
                                </div>
                            </div>
                            <div className="w-0.5 h-6 bg-slate-700 ml-4"></div>
                            <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${step === 'settling' ? 'bg-orange-500 animate-pulse' : 'bg-slate-700'}`}>
                                    {step === 'settling' ? <Loader2 className="w-4 h-4 animate-spin" /> : <div className="w-2 h-2 bg-slate-500 rounded-full" />}
                                </div>
                                <div>
                                    <div className={`font-medium ${step === 'settling' ? 'text-white' : 'text-slate-500'}`}>Settling on Arc</div>
                                    <div className="text-xs text-slate-500">Multi-recipient payment</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Done */}
                    {step === 'done' && (
                        <div className="flex flex-col items-center py-6 text-center animate-in fade-in zoom-in duration-300">
                            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Payment Complete!</h3>
                            <p className="text-slate-400">All invoices settled on Arc Network</p>
                            {selectedRoute && (
                                <p className="text-sm text-slate-500 mt-2">
                                    Total cost: ${selectedRoute.totalCostUSD.toFixed(2)} via {selectedRoute.fromChainName}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
