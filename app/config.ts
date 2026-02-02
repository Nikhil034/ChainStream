import { http, createConfig, injected } from 'wagmi'
import { arbitrumSepolia, baseSepolia, sepolia } from 'wagmi/chains'
import { defineChain } from 'viem'

// Arc Testnet - CRITICAL: USDC is the native currency on Arc (not ETH!)
export const arcTestnet = defineChain({
  id: 5042002,
  name: 'Arc Testnet',
  // USDC is used as gas on Arc Network (6 decimals, not 18)
  nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: 6 },
  rpcUrls: {
    default: { http: ['https://rpc.testnet.arc.network'] },
  },
  blockExplorers: {
    default: { name: 'ArcScan', url: 'https://testnet.arcscan.app' },
  },
  testnet: true,
})

export const config = createConfig({
  chains: [sepolia, arcTestnet, arbitrumSepolia, baseSepolia],
  connectors: [
    injected(), // uses window.ethereum directly
  ],
  transports: {
    [sepolia.id]: http(),
    [arcTestnet.id]: http(),
    [arbitrumSepolia.id]: http(),
    [baseSepolia.id]: http(),
  },
})
