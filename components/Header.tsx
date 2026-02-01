'use client'

import Image from 'next/image'
import Link from 'next/link'
import { WalletConnect } from './WalletConnect'

export function Header() {
    return (
        <header className="w-full border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative w-10 h-10 transition-transform group-hover:scale-110">
                        <Image
                            src="/ChainStream_logo.png"
                            alt="ChainStream Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-bold leading-none tracking-tight">
                            <span className="text-primary-blue">Chain</span>
                            <span className="text-vibrant-orange">Stream</span>
                        </h1>
                        <span className="text-[10px] font-medium text-dark-gray tracking-wide uppercase">
                            CrossChain Payment Agent
                        </span>
                    </div>
                </Link>

                {/* Actions / Wallet */}
                <div>
                    <WalletConnect />
                </div>
            </div>
        </header>
    )
}
