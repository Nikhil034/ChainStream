'use client';

import { useEffect, useState } from 'react';
import { DAO_SERVICES, PAYMENT_THRESHOLD } from '../lib/constants';
import {
    ServicesState,
    simulateServiceUsage,
    getServiceUsageDetails,
    getCategoryBreakdown,
    getSpendingExplanation,
} from '../lib/services';

export function ServiceMonitor({ onCostUpdate }: { onCostUpdate?: (cost: number) => void }) {
    const [servicesState, setServicesState] = useState<ServicesState>({
        services: {
            'alchemy.eth': 0,
            'thegraph.eth': 0,
            'contributor.payments': 0,
            'grant.program': 0,
            'notion.workspace': 0,
            'audit.services': 0,
        },
        totalCost: 0,
        lastUpdate: Date.now(),
        scenario: 'MEDIUM_DAO',
    });

    // Simulate service usage every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setServicesState((prev) => simulateServiceUsage(prev));
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    // Sync total cost to parent
    useEffect(() => {
        if (onCostUpdate) {
            onCostUpdate(servicesState.totalCost);
        }
    }, [servicesState.totalCost, onCostUpdate]);

    const serviceDetails = getServiceUsageDetails(servicesState);
    const categoryBreakdown = getCategoryBreakdown(servicesState);
    const thresholdReached = servicesState.totalCost >= PAYMENT_THRESHOLD;
    const thresholdPercent = (servicesState.totalCost / PAYMENT_THRESHOLD) * 100;

    return (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        💰 DAO Treasury Monitor
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Real-world DAO expenses tracking</p>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                        ${servicesState.totalCost.toFixed(2)}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">Total Pending</div>
                </div>
            </div>

            {/* Category Breakdown */}
            {Object.keys(categoryBreakdown).length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                    {Object.entries(categoryBreakdown).map(([category, cost]) => (
                        <div key={category} className="px-3 py-1 bg-slate-800/50 rounded-full border border-slate-700/50">
                            <span className="text-slate-400 text-xs">{category}:</span>
                            <span className="text-white text-sm font-semibold ml-1">${cost.toFixed(2)}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Service List */}
            <div className="space-y-3 mb-6">
                {serviceDetails.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                        <div className="text-4xl mb-2">⏳</div>
                        <p className="text-sm">Monitoring DAO expenses...</p>
                    </div>
                ) : (
                    serviceDetails.map((service) => {
                        const meta = DAO_SERVICES[service.serviceName];
                        return (
                            <div
                                key={service.serviceName}
                                className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 hover:border-slate-600 transition-all"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{meta.icon}</span>
                                        <div>
                                            <div className="font-semibold text-white flex items-center gap-2">
                                                {meta.name}
                                                {meta.realWorld && (
                                                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/30">
                                                        ✓ REAL
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-xs text-slate-400">{meta.provider}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-emerald-400">
                                            ${service.cost.toFixed(2)}
                                        </div>
                                        <div className="text-xs text-slate-500">{meta.category}</div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400">{meta.description}</span>
                                    <span className="text-slate-300 font-mono text-xs">
                                        {service.usage.toFixed(meta.unit === 'queries' ? 0 : 2)} {meta.unit}
                                    </span>
                                </div>

                                {/* Billing cycle indicator */}
                                <div className="mt-2 text-xs text-slate-500">
                                    {meta.billingCycle === 'monthly' && '🔄 Monthly subscription'}
                                    {meta.billingCycle === 'usage-based' && '📊 Usage-based billing'}
                                    {meta.billingCycle === 'one-time' && '💎 One-time expense'}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Payment Threshold Indicator */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-300">
                        Payment Threshold
                    </span>
                    <span className="text-sm font-bold text-slate-300">
                        ${PAYMENT_THRESHOLD.toFixed(2)}
                    </span>
                </div>
                <div className="relative w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-500 ${thresholdReached
                            ? 'bg-gradient-to-r from-orange-500 to-red-500'
                            : 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                            }`}
                        style={{ width: `${Math.min(thresholdPercent, 100)}%` }}
                    />
                </div>
                {thresholdReached && (
                    <div className="mt-3 flex items-center gap-2 text-orange-400 animate-pulse">
                        <span className="text-xl">⚡</span>
                        <span className="text-sm font-semibold">
                            Threshold reached! Autonomous payment agent will find optimal route.
                        </span>
                    </div>
                )}
            </div>

            {/* Real-world context */}
            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-start gap-2">
                    <span className="text-blue-400 text-xl">💡</span>
                    <div className="text-xs text-blue-300">
                        <span className="font-semibold">Real DAO Example:</span> A medium-sized DeFi DAO
                        spends ~$28k/month on infrastructure, contributors, and grants. ChainStream automates
                        these payments and saves 10-30% on cross-chain fees.
                    </div>
                </div>
            </div>
        </div>
    );
}
