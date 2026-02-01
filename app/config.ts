import { http, createConfig, injected } from 'wagmi'
import { arbitrumSepolia, baseSepolia } from 'wagmi/chains'
import { defineChain } from 'viem'

export const arcTestnet = defineChain({
  id: 5042002,
  name: 'Arc Testnet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.testnet.arc.network'] },
  },
  blockExplorers: {
    default: { name: 'ArcScan', url: 'https://testnet.arcscan.app' },
  },
  testnet: true,
})

export const config = createConfig({
  chains: [arcTestnet,arbitrumSepolia, baseSepolia],
   connectors: [
    injected(), // uses window.ethereum directly
  ],
  transports: {
    [arcTestnet.id]: http(),
    [arbitrumSepolia.id]: http(),
    [baseSepolia.id]: http(),
  },
})
