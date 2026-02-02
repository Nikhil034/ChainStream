import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-4 font-sans text-white">
      <main className="flex w-full max-w-4xl flex-col items-center gap-12 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-[var(--primary-blue)] to-[var(--vibrant-orange)] bg-clip-text text-transparent">
            ChainStream
          </h1>
          <p className="text-xl text-zinc-400">
            Autonomous CrossChain Payment Agent
          </p>
          <p className="text-sm text-zinc-500 max-w-2xl mx-auto">
            Powered by Arc Network & LI.FI • Monitor service usage, compare routes, and execute payments automatically
          </p>
        </div>

        <Link
          href="/dashboard"
          className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold py-4 px-8 rounded-xl transition-all hover:scale-105 shadow-lg hover:shadow-xl text-lg"
        >
          🚀 Launch Dashboard
        </Link>

        <div className="grid grid-cols-1 md:grid-cols- gap-6 text-left w-full max-w-3xl">
          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
            <h3 className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
              <span>💰</span> Multi-Chain Liquidity
            </h3>
            <p className="text-slate-400 text-sm">
              Aggregate USDC from Sepolia, Base, Arbitrum & settle on Arc Network
            </p>
          </div>

          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
            <h3 className="text-cyan-400 font-bold mb-2 flex items-center gap-2">
              <span>🤖</span> Autonomous Payments
            </h3>
            <p className="text-slate-400 text-sm">
              AI-powered route optimization finds the cheapest path automatically
            </p>
          </div>

          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
            <h3 className="text-orange-400 font-bold mb-2 flex items-center gap-2">
              <span>⚡</span> Arc Network
            </h3>
            <p className="text-slate-400 text-sm">
              USDC-native chain with sub-second finality & ultra-low fees
            </p>
          </div>

          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
            <h3 className="text-purple-400 font-bold mb-2 flex items-center gap-2">
              <span>🌉</span> LI.FI Integration
            </h3>
            <p className="text-slate-400 text-sm">
              Access liquidity across 20+ chains with optimal bridge routing
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
