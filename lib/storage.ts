// Transaction history storage using localStorage

export interface Transaction {
    id: string;
    timestamp: number;
    fromChain: number;
    fromChainName: string;
    toChain: number;
    toChainName: string;
    amount: number;
    gasCost: number;
    bridgeFee: number;
    totalCost: number;
    hash?: string;
    explorerUrl?: string;
    status: 'pending' | 'confirmed' | 'failed';
    savings: number; // vs most expensive route
}

const STORAGE_KEY = 'chainstream_transactions';

export function saveTransaction(tx: Transaction): void {
    if (typeof window === 'undefined') return;

    const transactions = getTransactions();
    transactions.unshift(tx); // Add to beginning

    // Keep only last 50 transactions
    const trimmed = transactions.slice(0, 50);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}

export function getTransactions(): Transaction[] {
    if (typeof window === 'undefined') return [];

    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error loading transactions:', error);
        return [];
    }
}

export function updateTransactionStatus(
    id: string,
    status: Transaction['status'],
    hash?: string,
    explorerUrl?: string
): void {
    if (typeof window === 'undefined') return;

    const transactions = getTransactions();
    const index = transactions.findIndex((tx) => tx.id === id);

    if (index !== -1) {
        transactions[index] = {
            ...transactions[index],
            status,
            ...(hash && { hash }),
            ...(explorerUrl && { explorerUrl }),
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    }
}

export function clearTransactions(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
}
