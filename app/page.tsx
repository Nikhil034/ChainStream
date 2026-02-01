import { WalletConnect } from "../components/WalletConnect";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-4 font-sans text-white">
      <main className="flex w-full max-w-4xl flex-col items-center gap-12 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            ChainStream
          </h1>
          <p className="text-xl text-zinc-400">
            Autonomous CrossChain Payment Agent
          </p>
        </div>

        <div className="w-full max-w-md">
          <WalletConnect />
        </div>

      </main>
    </div>
  );
}
