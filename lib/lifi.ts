import { createConfig, getRoutes, RoutesRequest } from '@lifi/sdk';
import { CHAIN_IDS, USDC_ADDRESSES, LIFI_SLIPPAGE } from './constants';

// Initialize LI.FI Config
createConfig({
    integrator: 'chainstream-hackmoney2026',
});

// Unified route interface (works for both real LI.FI routes and simulated Arc routes)
export interface UnifiedRoute {
    id: string;
    fromChain: number;
    fromChainName: string;
    toChain: number;
    toChainName: string;
    fromAmount: string;
    toAmount: string;
    gasCostUSD: number;
    bridgeFeeUSD: number;
    totalCostUSD: number;
    executionTime: number; // seconds
    isSimulated: boolean; // true if this is a simulated route to Arc
    tool?: string; // LI.FI tool name or "circle-cctp" for simulated
}

/**
 * Get real LI.FI route between supported testnet chains
 * Supports: Sepolia <-> Base Sepolia <-> Arbitrum Sepolia
 */
export async function getLiFiRoute(
    fromChain: number,
    toChain: number,
    amount: string,
    userAddress: string
): Promise<UnifiedRoute | null> {
    try {
        const amountAtomic = (parseFloat(amount) * 1_000_000).toFixed(0); // USDC 6 decimals

        const request: RoutesRequest = {
            fromChainId: fromChain,
            toChainId: toChain,
            fromTokenAddress: USDC_ADDRESSES[fromChain as keyof typeof USDC_ADDRESSES] as string,
            toTokenAddress: USDC_ADDRESSES[toChain as keyof typeof USDC_ADDRESSES] as string,
            fromAmount: amountAtomic,
            fromAddress: userAddress,
            toAddress: userAddress,
            options: {
                slippage: LIFI_SLIPPAGE,
                order: 'RECOMMENDED',
            },
        };

        const result = await getRoutes(request);
        const bestRoute = result.routes[0];

        if (!bestRoute) return null;

        const gasCostUSD = parseFloat(bestRoute.gasCostUSD || '0');
        const bridgeFeeUSD = 0.18; // Estimated bridge fee

        return {
            id: bestRoute.id,
            fromChain,
            fromChainName: getChainName(fromChain),
            toChain,
            toChainName: getChainName(toChain),
            fromAmount: amount,
            toAmount: (parseFloat(bestRoute.toAmount) / 1_000_000).toFixed(2),
            gasCostUSD,
            bridgeFeeUSD,
            totalCostUSD: parseFloat(amount) + gasCostUSD + bridgeFeeUSD,
            executionTime: bestRoute.steps[0]?.estimate?.executionDuration || 30,
            isSimulated: false,
            tool: bestRoute.steps[0]?.tool,
        };
    } catch (error) {
        console.error('LI.FI Route Error:', error);
        return null;
    }
}

/**
 * Simulate a route to Arc Network
 * Arc is too new for LI.FI support, so we simulate what the route would look like
 */
export function simulateArcRoute(
    fromChain: number,
    amount: string
): UnifiedRoute {
    // Gas costs based on network characteristics
    const gasCosts: Record<number, number> = {
        [CHAIN_IDS.SEPOLIA]: 0.50, // Sepolia (ETH gas is higher)
        [CHAIN_IDS.BASE_SEPOLIA]: 0.05, // Base (optimistic rollup, very low)
        [CHAIN_IDS.ARBITRUM_SEPOLIA]: 0.08, // Arbitrum (low)
        [CHAIN_IDS.ARC_TESTNET]: 0.01, // Arc (native USDC, minimal gas)
    };

    const gasCostUSD = gasCosts[fromChain] || 0.10;
    // Bridge fee only applies if coming from another chain
    const bridgeFeeUSD = fromChain === CHAIN_IDS.ARC_TESTNET ? 0 : 0.18;
    const amountNum = parseFloat(amount);

    return {
        id: `simulated-arc-${fromChain}-${Date.now()}`,
        fromChain,
        fromChainName: getChainName(fromChain),
        toChain: CHAIN_IDS.ARC_TESTNET,
        toChainName: 'Arc Testnet',
        fromAmount: amount,
        toAmount: amount, // 1:1, both USDC
        gasCostUSD,
        bridgeFeeUSD,
        totalCostUSD: amountNum + gasCostUSD + bridgeFeeUSD,
        executionTime: fromChain === CHAIN_IDS.ARC_TESTNET ? 1 : 8, // Arc native is instant
        isSimulated: fromChain !== CHAIN_IDS.ARC_TESTNET, // Arc native is real!
        tool: fromChain === CHAIN_IDS.ARC_TESTNET ? 'native' : 'circle-cctp',
    };
}

/**
 * Get optimal route - unifies real LI.FI and simulated Arc routing
 */
export async function getOptimalRoute(
    fromChain: number,
    toChain: number,
    amount: string,
    userAddress: string
): Promise<UnifiedRoute | null> {
    // CASE 1: Route to Arc (simulated)
    if (toChain === CHAIN_IDS.ARC_TESTNET) {
        return simulateArcRoute(fromChain, amount);
    }

    // CASE 2: Testnet to testnet (real LI.FI)
    return await getLiFiRoute(fromChain, toChain, amount, userAddress);
}

/**
 * Compare routes from all chains to Arc
 * Returns sorted by total cost (cheapest first)
 */
export async function compareRoutesToArc(
    amount: number,
    userAddress: string,
    balances: { sepolia: number; base: number; arbitrum: number; arc?: number }
): Promise<UnifiedRoute[]> {
    const chains = [
        { id: CHAIN_IDS.ARC_TESTNET, name: 'Arc', balance: balances.arc || 100 }, // Arc native (user has USDC here)
        { id: CHAIN_IDS.BASE_SEPOLIA, name: 'Base', balance: balances.base },
        { id: CHAIN_IDS.ARBITRUM_SEPOLIA, name: 'Arbitrum', balance: balances.arbitrum },
        { id: CHAIN_IDS.SEPOLIA, name: 'Sepolia', balance: balances.sepolia },
    ];

    console.log('Generating routes for amount:', amount, 'Balances:', balances);

    // For demo: Always generate routes from all chains
    const routes = chains.map((chain) => {
        return simulateArcRoute(chain.id, amount.toFixed(2));
    });

    console.log('Generated routes:', routes);

    // Sort by total cost (cheapest first)
    return routes.sort((a, b) => a.totalCostUSD - b.totalCostUSD);
}

// Helper function
function getChainName(chainId: number): string {
    const names: Record<number, string> = {
        [CHAIN_IDS.SEPOLIA]: 'Sepolia',
        [CHAIN_IDS.BASE_SEPOLIA]: 'Base Sepolia',
        [CHAIN_IDS.ARBITRUM_SEPOLIA]: 'Arbitrum Sepolia',
        [CHAIN_IDS.ARC_TESTNET]: 'Arc Testnet',
    };
    return names[chainId] || 'Unknown';
}
