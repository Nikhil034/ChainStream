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
        </div>

      </main>
    </div>
  );
}
