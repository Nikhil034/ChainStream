import { DAO_SERVICES, SIMULATION_CONFIG } from './constants';

export interface ServiceUsage {
    serviceName: keyof typeof DAO_SERVICES;
    usage: number;
    cost: number;
    category: string;
}

export interface ServicesState {
    services: Record<keyof typeof DAO_SERVICES, number>;
    totalCost: number;
    lastUpdate: number;
    scenario: 'SMALL_DAO' | 'MEDIUM_DAO' | 'LARGE_DAO';
}

// Initialize service usage based on scenario
const initialState: ServicesState = {
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
    scenario: 'MEDIUM_DAO', // Default to medium DAO
};

/**
 * Simulates realistic DAO spending patterns
 * Based on actual service usage and billing cycles
 */
export function simulateServiceUsage(currentState: ServicesState): ServicesState {
    const newServices = { ...currentState.services };

    // Accumulate based on realistic rates
    Object.entries(SIMULATION_CONFIG.ACCUMULATION_RATES).forEach(([service, rate]) => {
        const serviceName = service as keyof typeof DAO_SERVICES;
        newServices[serviceName] += rate;
    });

    const totalCost = calculateTotalCost(newServices);

    return {
        ...currentState,
        services: newServices,
        totalCost,
        lastUpdate: Date.now(),
    };
}

/**
 * Manually trigger a one-time expense (like a grant or audit)
 */
export function triggerOneTimeExpense(
    currentState: ServicesState,
    service: keyof typeof DAO_SERVICES,
    quantity: number = 1
): ServicesState {
    const newServices = { ...currentState.services };
    newServices[service] += quantity;

    const totalCost = calculateTotalCost(newServices);

    return {
        ...currentState,
        services: newServices,
        totalCost,
        lastUpdate: Date.now(),
    };
}

// Calculate total cost
export function calculateTotalCost(
    services: Record<keyof typeof DAO_SERVICES, number>
): number {
    let total = 0;

    for (const [serviceName, usage] of Object.entries(services)) {
        const service = DAO_SERVICES[serviceName as keyof typeof DAO_SERVICES];
        total += usage * service.costPerUnit;
    }

    return total;
}

// Get usage details for all services
export function getServiceUsageDetails(state: ServicesState): ServiceUsage[] {
    return Object.entries(state.services)
        .map(([serviceName, usage]) => {
            const service = DAO_SERVICES[serviceName as keyof typeof DAO_SERVICES];
            return {
                serviceName: serviceName as keyof typeof DAO_SERVICES,
                usage,
                cost: usage * service.costPerUnit,
                category: service.category,
            };
        })
        .filter((detail) => detail.usage > 0 || detail.cost > 0) // Only show active services
        .sort((a, b) => b.cost - a.cost); // Sort by cost descending
}

// Get breakdown by category
export function getCategoryBreakdown(state: ServicesState): Record<string, number> {
    const details = getServiceUsageDetails(state);
    const breakdown: Record<string, number> = {};

    details.forEach((detail) => {
        if (!breakdown[detail.category]) {
            breakdown[detail.category] = 0;
        }
        breakdown[detail.category] += detail.cost;
    });

    return breakdown;
}

// Reset service usage (after payment)
export function resetServiceUsage(): ServicesState {
    return { ...initialState, lastUpdate: Date.now() };
}

// Get realistic DAO spending explanation
export function getSpendingExplanation(state: ServicesState): string[] {
    const details = getServiceUsageDetails(state);
    const explanations: string[] = [];

    details.forEach((detail) => {
        const service = DAO_SERVICES[detail.serviceName];

        if (detail.usage > 0) {
            if (service.billingCycle === 'monthly') {
                const monthlyPercent = (detail.usage * 100).toFixed(1);
                explanations.push(
                    `${service.name}: ${monthlyPercent}% of monthly cost accrued ($${detail.cost.toFixed(2)})`
                );
            } else if (service.billingCycle === 'usage-based') {
                explanations.push(
                    `${service.name}: ${detail.usage.toFixed(0)} ${service.unit} used ($${detail.cost.toFixed(2)})`
                );
            } else if (service.billingCycle === 'one-time') {
                explanations.push(
                    `${service.name}: ${detail.usage} ${service.unit} approved ($${detail.cost.toFixed(2)})`
                );
            }
        }
    });

    return explanations;
}

// Preset DAO scenarios for quick demo
export function loadScenario(scenario: 'SMALL_DAO' | 'MEDIUM_DAO' | 'LARGE_DAO'): ServicesState {
    const baseState = { ...initialState, scenario };

    switch (scenario) {
        case 'SMALL_DAO':
            // Small DAO: Just infrastructure costs
            return {
                ...baseState,
                services: {
                    'alchemy.eth': 0.5, // Half month accrued
                    'thegraph.eth': 50000, // 50k queries
                    'contributor.payments': 0,
                    'grant.program': 0,
                    'notion.workspace': 0.3,
                    'audit.services': 0,
                },
                totalCost: calculateTotalCost({
                    'alchemy.eth': 0.5,
                    'thegraph.eth': 50000,
                    'contributor.payments': 0,
                    'grant.program': 0,
                    'notion.workspace': 0.3,
                    'audit.services': 0,
                }),
                lastUpdate: Date.now(),
            };

        case 'MEDIUM_DAO':
            // Medium DAO: Infrastructure + contributors
            // Starts small for demo purposes
            return {
                ...baseState,
                services: {
                    'alchemy.eth': 0.1, // 10% of month
                    'thegraph.eth': 1000, // 1k queries
                    'contributor.payments': 0, // 0 contributors initially
                    'grant.program': 0,
                    'notion.workspace': 0,
                    'audit.services': 0,
                },
                totalCost: calculateTotalCost({
                    'alchemy.eth': 0.1,
                    'thegraph.eth': 1000,
                    'contributor.payments': 0,
                    'grant.program': 0,
                    'notion.workspace': 0,
                    'audit.services': 0,
                }),
                lastUpdate: Date.now(),
            };

        case 'LARGE_DAO':
            // Large DAO: Everything including grants and audit
            return {
                ...baseState,
                services: {
                    'alchemy.eth': 1,
                    'thegraph.eth': 500000,
                    'contributor.payments': 8,
                    'grant.program': 2,
                    'notion.workspace': 1,
                    'audit.services': 1,
                },
                totalCost: calculateTotalCost({
                    'alchemy.eth': 1,
                    'thegraph.eth': 500000,
                    'contributor.payments': 8,
                    'grant.program': 2,
                    'notion.workspace': 1,
                    'audit.services': 1,
                }),
                lastUpdate: Date.now(),
            };

        default:
            return initialState;
    }
}
