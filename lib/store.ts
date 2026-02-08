import { create } from 'zustand';

export interface Log {
    id: string;
    message: string;
    timestamp: number;
    type: 'info' | 'success' | 'warning' | 'error';
}

export interface ServiceLiability {
    id: string;
    name: string;
    cost: number;
    threshold: number;
    ens: string;
}

interface TreasuryState {
    logs: Log[];
    liabilities: ServiceLiability[];
    isSimulating: boolean;

    // Actions
    addLog: (message: string, type?: Log['type']) => void;
    toggleSimulation: () => void;
    tick: () => void;
}

export const useTreasuryStore = create<TreasuryState>((set) => ({
    logs: [],
    liabilities: [
        { id: 'weather', name: 'Weather API Oracle', cost: 12.50, threshold: 30, ens: 'weather.eth' },
        { id: 'arweave', name: 'Arweave Storage', cost: 8.20, threshold: 30, ens: 'store.arweave' },
        { id: 'akash', name: 'Akash Compute', cost: 4.15, threshold: 30, ens: 'compute.akash' },
    ],
    isSimulating: false,

    addLog: (message, type = 'info') => set((state) => ({
        logs: [...state.logs, { id: Math.random().toString(36), message, timestamp: Date.now(), type }].slice(-50) // Keep last 50
    })),

    toggleSimulation: () => set((state) => ({ isSimulating: !state.isSimulating })),

    tick: () => set((state) => {
        if (!state.isSimulating) return state;

        // Randomly increase costs
        const newLiabilities = state.liabilities.map(l => ({
            ...l,
            cost: l.cost + (Math.random() * 0.5) // Add $0 - $0.50 per tick
        }));

        const totalCost = newLiabilities.reduce((sum, l) => sum + l.cost, 0);

        // Check threshold
        if (totalCost > 80 && Math.random() > 0.8) {
            // Simulate auto-trigger or just log warning
            // In a real agent, this would trigger executePayment()
        }

        return { liabilities: newLiabilities };
    })
}));
