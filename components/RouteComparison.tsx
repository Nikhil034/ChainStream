'use client';

import { UnifiedRoute } from '../lib/lifi';
import { CHAIN_METADATA } from '../lib/constants';

interface RouteComparisonProps {
    routes: UnifiedRoute[];
    selectedRoute: UnifiedRoute | null;
    onSelectRoute: (route: UnifiedRoute) => void;
}

export function RouteComparison({ routes, selectedRoute, onSelectRoute }: RouteComparisonProps) {
    if (routes.length === 0) {
        return (
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    🛣️ Route Analysis
                </h2>
                <div className="text-center py-12 text-slate-400">
                    <div className="text-6xl mb-4">💤</div>
                    <p>Waiting for payment threshold to trigger route comparison...</p>
                </div>
            </div>
        );
    }

    const cheapestRoute = routes[0]; // Already sorted by cost

    return (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    🛣️ Route Analysis
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                    Comparing routes from all chains to Arc Network
                </p>
            </div>

            <div className="space-y-3">
                {routes.map((route, index) => {
                    const isSelected = selectedRoute?.id === route.id;
                    const isCheapest = route.id === cheapestRoute?.id;
                    const fromChainMeta = CHAIN_METADATA[route.fromChain as keyof typeof CHAIN_METADATA];

                    return (
                        <button
                            key={route.id}
                            onClick={() => onSelectRoute(route)}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${isSelected
                                ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/20'
                                : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    {isCheapest && (
                                        <span className="px-2 py-1 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-xs font-bold rounded-full">
                                            ✨ CHEAPEST
                                        </span>
                                    )}
                                    {route.isSimulated && (
                                        <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs font-bold rounded-full border border-orange-500/30">
                                            ⚠️ SIMULATED
                                        </span>
                                    )}
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-bold text-white">
                                        ${route.totalCostUSD.toFixed(2)}
                                    </div>
                                    {isCheapest && routes.length > 1 && (
                                        <div className="text-xs text-emerald-400">
                                            Saves ${(routes[routes.length - 1].totalCostUSD - route.totalCostUSD).toFixed(2)}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                                <span className={`px-3 py-1 rounded-lg font-semibold text-sm ${fromChainMeta.color} bg-slate-900`}>
                                    {route.fromChainName}
                                </span>
                                <span className="text-slate-500">→</span>
                                <span className="px-3 py-1 rounded-lg font-semibold text-sm text-orange-500 bg-slate-900">
                                    {route.toChainName}
                                </span>
                            </div>

                            <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                    <div className="text-slate-400 text-xs mb-1">Amount</div>
                                    <div className="text-white font-mono">${route.fromAmount} USDC</div>
                                </div>
                                <div>
                                    <div className="text-slate-400 text-xs mb-1">Gas Cost</div>
                                    <div className="text-white font-mono">${route.gasCostUSD.toFixed(2)}</div>
                                </div>
                                <div>
                                    <div className="text-slate-400 text-xs mb-1">Bridge Fee</div>
                                    <div className="text-white font-mono">${route.bridgeFeeUSD.toFixed(2)}</div>
                                </div>
                            </div>

                            <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs">
                                <span className="text-slate-400">
                                    via {route.tool || 'Direct'}
                                </span>
                                <span className="text-slate-400">
                                    ~{route.executionTime}s execution
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
