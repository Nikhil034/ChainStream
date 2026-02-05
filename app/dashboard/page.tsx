'use client';

import { useState } from 'react';
import { ServiceMonitor } from '../../components/ServiceMonitor';
import { RouteComparison } from '../../components/RouteComparison';
import { PaymentAgent } from '../../components/PaymentAgent';
import { TransactionHistory } from '../../components/TransactionHistory';
import { UnifiedRoute } from '../../lib/lifi';
import { resetServiceUsage } from '../../lib/services';
import { PAYMENT_THRESHOLD } from '../../lib/constants';

export default function DashboardPage() {
    const [totalCost, setTotalCost] = useState(0);
    const [routes, setRoutes] = useState<UnifiedRoute[]>([]);
    const [selectedRoute, setSelectedRoute] = useState<UnifiedRoute | null>(null);

    const handlePaymentComplete = () => {
        // Reset service usage after payment
        const resetState = resetServiceUsage();
        setTotalCost(resetState.totalCost);
        setRoutes([]);
        setSelectedRoute(null);
    };

    return (
        <div className="min-h-screen bg-zinc-950 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2">
                        ChainStream Dashboard
                    </h1>
                    <p className="text-slate-400">
                        Autonomous cross-chain payment agent powered by Arc Network & LI.FI
                    </p>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Top Left: Service Monitor */}
                    <ServiceMonitor onCostUpdate={setTotalCost} />

                    {/* Top Right: Route Comparison */}
                    <RouteComparison
                        routes={routes}
                        selectedRoute={selectedRoute}
                        onSelectRoute={setSelectedRoute}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Bottom Left: Payment Agent */}
                    <PaymentAgent
                        totalCost={totalCost}
                        onPaymentComplete={handlePaymentComplete}
                        onRoutesAnalyzed={setRoutes}
                        onRouteSelected={setSelectedRoute}
                    />

                    {/* Bottom Right: Transaction History */}
                    <TransactionHistory />
                </div>

                {/* Info Footer */}
                <div className="mt-8 p-6 bg-slate-900/50 rounded-xl border border-slate-800">
                    <div className="flex items-start gap-4">
                        <span className="text-3xl">💡</span>
                        <div>
                            <h3 className="text-white font-semibold mb-2">Real DAO Treasury Automation</h3>
                            <div className="text-slate-400 text-sm space-y-2">
                                <p>
                                    <span className="text-white font-semibold">1. Real Services:</span> Alchemy API ($49/mo), The Graph (usage-based), contributor payments ($2.5k each), grants, audit services
                                </p>
                                <p>
                                    <span className="text-white font-semibold">2. Threshold Trigger:</span> When costs hit ${PAYMENT_THRESHOLD}, agent analyzes routes from all chains to find cheapest path
                                </p>
                                <p>
                                    <span className="text-white font-semibold">3. Cost Savings:</span> 10-40% savings on cross-chain fees (Base route typically cheapest)
                                </p>
                                <p>
                                    <span className="text-white font-semibold">4. Real Payments:</span> Execute actual Arc testnet transactions - verify on Arc Explorer!
                                </p>
                                <p className="text-emerald-400 font-semibold mt-3">
                                    ✅ Real-world example: Medium DeFi DAO spends ~$28k/month. ChainStream automates payments and saves $500-1,500/month.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
