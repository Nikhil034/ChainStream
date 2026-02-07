"use client";

import Link from "next/link";
import { ArrowRight, Zap, Network, Shield, TrendingDown } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
            <span className="text-blue-400 text-sm font-medium">Built for Arc Network × LI.FI HackMoney 2026</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Autonomous Treasury for
            <span className="block bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Multi-Chain Agents
            </span>
          </h1>

          <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            ChainStream solves fragmented liquidity for AI agents and automation services.
            Aggregate funds across chains, route intelligently, and settle on Arc Network.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="group px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
            >
              Launch Dashboard
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="https://github.com/Nikhil034/ChainStream"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-all border border-slate-700"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-red-500 rounded-full"></span>
            The Problem
          </h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            Imagine an AI agent managing subscriptions to Weather APIs on Ethereum,
            Arweave storage on Base, and Akash compute on Arbitrum. Each service bills separately.
          </p>
          <p className="text-slate-300 leading-relaxed">
            The agent has <span className="text-blue-400 font-bold">$50 on Base</span> and{" "}
            <span className="text-blue-400 font-bold">$20 on Arbitrum</span>, but needs to pay{" "}
            <span className="text-orange-400 font-bold">$60 for storage</span>.
          </p>
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 font-bold">❌ Payment fails. The agent can't aggregate its liquidity.</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            How ChainStream Solves This
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                <Network className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Multi-Chain Aggregation</h3>
              <p className="text-slate-400 leading-relaxed">
                Real-time balance tracking across Ethereum, Base, Arbitrum, and Arc Network using Wagmi hooks.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-emerald-500/50 transition-colors">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingDown className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Smart Routing</h3>
              <p className="text-slate-400 leading-relaxed">
                LI.FI integration finds the cheapest bridge path, saving up to 60% vs Ethereum mainnet.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-orange-500/50 transition-colors">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Autonomous Settlement</h3>
              <p className="text-slate-400 leading-relaxed">
                Policy-based execution on Arc Network. Set thresholds, let the agent handle the rest.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">How It Works</h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Connect Your Wallet</h3>
                <p className="text-slate-400">
                  ChainStream scans your balances across all supported chains in real-time.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Monitor Liabilities</h3>
                <p className="text-slate-400">
                  Track invoices from services like Weather APIs, Arweave, and Akash. Set payment thresholds.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Execute Payment</h3>
                <p className="text-slate-400">
                  Select the optimal route from LI.FI options. Bridge funds and settle all invoices on Arc Network.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-600/20 to-emerald-600/20 border border-blue-500/30 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Unify Your Treasury?
          </h2>
          <p className="text-slate-300 mb-8 text-lg">
            Experience autonomous cross-chain payments powered by Arc Network and LI.FI.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-900/20"
          >
            <Zap className="w-5 h-5" />
            Launch Dashboard
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      {/* <footer className="container mx-auto px-4 py-8 border-t border-slate-800">
          <div className="text-center text-slate-500 text-sm">
            <p>Built for HackMoney 2026 • Arc Network × LI.FI</p>
            <p className="mt-2">Solving fragmented liquidity for autonomous agents</p>
          </div>
        </footer> */}
    </div>
  );
}
