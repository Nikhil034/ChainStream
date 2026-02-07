import { useBalance } from 'wagmi';
import { formatUnits } from 'viem';
import { CHAIN_IDS } from '../constants';

interface ChainBalance {
    value: bigint;
    decimals: number;
    symbol: string;
    formatted: string;
}

interface MultiChainBalances {
    sepolia: ChainBalance | null;
    base: ChainBalance | null;
    arbitrum: ChainBalance | null;
    arc: ChainBalance | null;
    total: number;
    isLoading: boolean;
}

export function useMultiChainBalances(address: `0x${string}` | undefined): MultiChainBalances {
    // For testnets, we'll check native balance for simplicity
    // In production, you'd specify USDC token addresses

    const { data: sepoliaBalance, isLoading: sepoliaLoading } = useBalance({
        address,
        chainId: CHAIN_IDS.SEPOLIA,
    });

    const { data: baseBalance, isLoading: baseLoading } = useBalance({
        address,
        chainId: CHAIN_IDS.BASE_SEPOLIA,
    });

    const { data: arbBalance, isLoading: arbLoading } = useBalance({
        address,
        chainId: CHAIN_IDS.ARBITRUM_SEPOLIA,
    });

    // Arc Testnet - USDC is native
    const { data: arcBalance, isLoading: arcLoading } = useBalance({
        address,
        chainId: CHAIN_IDS.ARC_TESTNET,
    });

    // Helper to format balance
    const formatBalance = (balance: typeof sepoliaBalance): ChainBalance | null => {
        if (!balance) return null;
        return {
            value: balance.value,
            decimals: balance.decimals,
            symbol: balance.symbol,
            formatted: formatUnits(balance.value, balance.decimals),
        };
    };

    const formattedBalances = {
        sepolia: formatBalance(sepoliaBalance),
        base: formatBalance(baseBalance),
        arbitrum: formatBalance(arbBalance),
        arc: formatBalance(arcBalance),
    };

    // Calculate total across all chains
    const total = Object.values(formattedBalances)
        .filter(Boolean)
        .reduce((sum, balance) => sum + parseFloat(balance!.formatted), 0);

    return {
        ...formattedBalances,
        total,
        isLoading: sepoliaLoading || baseLoading || arbLoading || arcLoading,
    };
}
