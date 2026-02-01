'use client'

import { useAccount, useConnect, useDisconnect, useEnsName, useBalance, useChainId, useSwitchChain, injected } from 'wagmi'
import { formatEther } from 'viem'
import { metaMask } from 'wagmi/connectors'

export function WalletConnect() {
    const { address, isConnected, chain } = useAccount()
    const { connect, connectors } = useConnect()
    const { disconnect } = useDisconnect()
    const { data: ensName } = useEnsName({ address })
    const { data: balance } = useBalance({ address })
    const chainId = useChainId()
    const { switchChain, chains } = useSwitchChain()

    if (isConnected && address) {
        return (
            <div className="flex items-center gap-4">
                {/* Network & Balance - Hidden on mobile if needed, but keeping simple for now */}
                <div className="hidden md:flex flex-col items-end text-sm mr-2">
                    <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <span className="font-semibold text-gray-700">{chain?.name}</span>
                    </div>
                    <span className="text-gray-500 font-mono">
                        {balance ? `${parseFloat(formatEther(balance.value)).toFixed(4)} ${balance.symbol}` : '...'}
                    </span>
                </div>

                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                    <span className="font-bold text-primary-blue text-sm">
                        {ensName || `${address.slice(0, 6)}...${address.slice(-4)}`}
                    </span>
                    <button
                        onClick={() => disconnect()}
                        className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded ml-2"
                        title="Disconnect"
                    >
                        ✕
                    </button>
                </div>
            </div>
        )
    }

    return (
        <button
            onClick={() => connect({ connector: metaMask() })}
            className="bg-primary-blue hover:bg-royal-blue text-white font-semibold py-2 px-6 rounded-full transition-all hover:scale-105 shadow-sm text-sm"
        >
            Connect Wallet
        </button>
    )
}



