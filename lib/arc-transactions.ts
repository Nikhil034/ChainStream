import { useSendTransaction, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi';
import { parseUnits } from 'viem';
import { CHAIN_IDS, CHAIN_METADATA } from './constants';

interface SendToArcReturn {
    sendUSDC: (to: string, amount: string) => Promise<void>;
    hash: `0x${string}` | undefined;
    isPending: boolean;
    isConfirming: boolean;
    isConfirmed: boolean;
    error: Error | null;
    explorerUrl: string | null;
}

export function useSendToArc(): SendToArcReturn {
    const { data: hash, sendTransaction, isPending, error: sendError } = useSendTransaction();
    const { switchChain } = useSwitchChain();

    const {
        isLoading: isConfirming,
        isSuccess: isConfirmed,
        error: confirmError,
    } = useWaitForTransactionReceipt({
        hash,
    });

    const sendUSDC = async (to: string, amount: string) => {
        try {
            // First, switch to Arc testnet
            await switchChain({ chainId: CHAIN_IDS.ARC_TESTNET });

            // Send USDC (native currency on Arc)
            // This is similar to sending ETH on Ethereum
            await sendTransaction({
                to: to as `0x${string}`,
                value: parseUnits(amount, 6), // USDC has 6 decimals
                chainId: CHAIN_IDS.ARC_TESTNET,
            });
        } catch (error) {
            console.error('Error sending to Arc:', error);
            throw error;
        }
    };

    const explorerUrl = hash
        ? `${CHAIN_METADATA[CHAIN_IDS.ARC_TESTNET].explorerUrl}/tx/${hash}`
        : null;

    return {
        sendUSDC,
        hash,
        isPending,
        isConfirming,
        isConfirmed,
        error: sendError || confirmError,
        explorerUrl,
    };
}
