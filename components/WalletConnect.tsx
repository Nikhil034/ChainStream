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
            <div className="flex flex-col gap-4 p-6 bg-slate-900 text-white rounded-xl shadow-lg border border-slate-700 max-w-md w-full">
                <h2 className="text-xl font-bold mb-2">Wallet Connected</h2>

                {/* Network Info */}
                <div className="flex justify-between items-center bg-slate-800 p-3 rounded-lg">
                    <span className="text-slate-400">Network</span>
                    <div className="flex flex-col items-end">
                        <span className="font-semibold">{chain?.name || 'Unknown Network'}</span>
                        {chains.map((c) => (
                            c.id !== chainId && (
                                <button
                                    key={c.id}
                                    onClick={() => switchChain({ chainId: c.id })}
                                    className="text-xs text-blue-400 hover:text-blue-300 mt-1"
                                >
                                    Switch to {c.name}
                                </button>
                            )
                        ))}
                    </div>
                </div>

                {/* Address & ENS */}
                <div className="flex justify-between items-center bg-slate-800 p-3 rounded-lg">
                    <span className="text-slate-400">Account</span>
                    <div className="text-right">
                        {ensName && <div className="font-bold text-green-400">{ensName}</div>}
                        <div className="font-mono text-sm break-all">{address.slice(0, 6)}...{address.slice(-4)}</div>
                    </div>
                </div>

                {/* Balance */}
                <div className="flex justify-between items-center bg-slate-800 p-3 rounded-lg">
                    <span className="text-slate-400">Balance</span>
                    <span className="font-bold">
                        {balance ? `${parseFloat(formatEther(balance.value)).toFixed(4)} ${balance.symbol}` : 'Loading...'}
                    </span>
                </div>

                <button
                    onClick={() => disconnect()}
                    className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                    Disconnect Wallet
                </button>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-slate-900 rounded-xl shadow-lg border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-6">Connect to ChainStream</h2>
            <button
                 onClick={() => connect({ connector: metaMask() })}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-transform hover:scale-105 shadow-md flex items-center gap-2"
            >
                <span>Connect Wallet</span>
            </button>
            <p className="mt-4 text-slate-400 text-sm">
                Supports Arc, Arbitrum Sepolia, Base Sepolia
            </p>
        </div>
    )
}



