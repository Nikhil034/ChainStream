'use client';

import { useState } from 'react';
import { ServiceMonitor } from '../../components/ServiceMonitor';
import { RouteComparison } from '../../components/RouteComparison';
import { PaymentAgent } from '../../components/PaymentAgent';
import { TransactionHistory } from '../../components/TransactionHistory';
import { UnifiedRoute } from '../../lib/lifi';
import { resetServiceUsage } from '../../lib/services';
import { PAYMENT_THRESHOLD } from '../../lib/constants';
import { BalanceTicker } from '../../components/BalanceTicker';

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
        <div className="min-h-screen bg-zinc-950">
            <BalanceTicker />
            <div className="max-w-7xl mx-auto p-6">
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
                        selectedRoute={selectedRoute}
                        routes={routes}
                    />

                    {/* Bottom Right: Transaction History */}
                    <TransactionHistory />
                </div>

            </div>
        </div>
    );
}
