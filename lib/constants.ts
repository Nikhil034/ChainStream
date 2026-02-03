// Chain IDs
export const CHAIN_IDS = {
    SEPOLIA: 11155111,
    BASE_SEPOLIA: 84532,
    ARBITRUM_SEPOLIA: 421614,
    ARC_TESTNET: 5042002,
} as const;

// USDC Token Addresses on Testnets
export const USDC_ADDRESSES = {
    [CHAIN_IDS.SEPOLIA]: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
    [CHAIN_IDS.BASE_SEPOLIA]: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
    [CHAIN_IDS.ARBITRUM_SEPOLIA]: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d',
    [CHAIN_IDS.ARC_TESTNET]: 'native', // USDC is the native token on Arc
} as const;

// Chain Metadata
export const CHAIN_METADATA = {
    [CHAIN_IDS.SEPOLIA]: {
        name: 'Sepolia',
        color: 'text-blue-500',
        explorerUrl: 'https://sepolia.etherscan.io',
    },
    [CHAIN_IDS.BASE_SEPOLIA]: {
        name: 'Base Sepolia',
        color: 'text-blue-600',
        explorerUrl: 'https://sepolia.basescan.org',
    },
    [CHAIN_IDS.ARBITRUM_SEPOLIA]: {
        name: 'Arbitrum Sepolia',
        color: 'text-blue-400',
        explorerUrl: 'https://sepolia.arbiscan.io',
    },
    [CHAIN_IDS.ARC_TESTNET]: {
        name: 'Arc Testnet',
        color: 'text-orange-500',
        explorerUrl: 'https://testnet.arcscan.app',
    },
} as const;

// ===== REAL DAO USE CASES =====
// These represent actual services and providers that DAOs use

export const DAO_SERVICES = {
    // Infrastructure Services (Real providers DAOs use)
    'alchemy.eth': {
        name: 'Alchemy API',
        category: 'Infrastructure',
        costPerUnit: 49.00, // $49/month for Growth plan
        unit: 'month',
        description: 'RPC infrastructure for dApp',
        icon: '⚡',
        provider: 'Alchemy',
        realWorld: true,
        billingCycle: 'monthly',
    },
    'thegraph.eth': {
        name: 'The Graph Queries',
        category: 'Infrastructure',
        costPerUnit: 0.0001, // $0.0001 per query
        unit: 'queries',
        description: 'Decentralized indexing protocol',
        icon: '📊',
        provider: 'The Graph',
        realWorld: true,
        billingCycle: 'usage-based',
    },

    // Contributor Payments (Real DAO expense)
    'contributor.payments': {
        name: 'Contributor Stipends',
        category: 'Contributors',
        costPerUnit: 2500.00, // $2500 per contributor per month
        unit: 'contributors',
        description: 'Monthly core contributor payments',
        icon: '👥',
        provider: 'DAO Treasury',
        realWorld: true,
        billingCycle: 'monthly',
    },

    // Grant Program (Real DAO expense)
    'grant.program': {
        name: 'Small Grants',
        category: 'Grants',
        costPerUnit: 5000.00, // $5000 per small grant
        unit: 'grants',
        description: 'Community development grants',
        icon: '🎁',
        provider: 'DAO Treasury',
        realWorld: true,
        billingCycle: 'one-time',
    },

    // Service Providers (Real DAO expense)
    'notion.workspace': {
        name: 'Notion Team',
        category: 'Tools',
        costPerUnit: 80.00, // $8 per user × 10 users
        unit: 'month',
        description: 'Team workspace & documentation',
        icon: '📝',
        provider: 'Notion',
        realWorld: true,
        billingCycle: 'monthly',
    },

    // Security & Audit (Real DAO expense)
    'audit.services': {
        name: 'Smart Contract Audit',
        category: 'Security',
        costPerUnit: 15000.00, // $15k for medium audit
        unit: 'audit',
        description: 'Security audit for new contracts',
        icon: '🔒',
        provider: 'Security Firm',
        realWorld: true,
        billingCycle: 'one-time',
    },
} as const;

// Simulation Settings
export const SIMULATION_CONFIG = {
    // How often services accumulate costs (in milliseconds)
    UPDATE_INTERVAL: 3000, // 3 seconds for demo

    // Slow accumulation rates for demo (takes ~60 seconds to hit $20)
    ACCUMULATION_RATES: {
        'alchemy.eth': 0.002, // ~$0.10 per 3 sec
        'thegraph.eth': 100, // 100 queries per interval (~$0.01)
        'contributor.payments': 0.001, // Very slow
        'grant.program': 0, // Grants are one-time, manually triggered
        'notion.workspace': 0.002, // ~$0.16 per 3 sec
        'audit.services': 0, // Audits are one-time, manually triggered
    },
};

// Payment Threshold (in USDC)
export const PAYMENT_THRESHOLD = 20;

// LI.FI Slippage Tolerance
export const LIFI_SLIPPAGE = 0.03; // 3%

// ===== REAL DAO SCENARIO EXAMPLES =====
export const DAO_SCENARIOS = {
    SMALL_DAO: {
        name: 'Small Protocol DAO',
        monthlyBudget: 15000,
        services: ['alchemy.eth', 'thegraph.eth', 'notion.workspace'],
        contributors: 2,
    },
    MEDIUM_DAO: {
        name: 'Growing DeFi DAO',
        monthlyBudget: 50000,
        services: ['alchemy.eth', 'thegraph.eth', 'contributor.payments', 'notion.workspace'],
        contributors: 5,
        grants: 2,
    },
    LARGE_DAO: {
        name: 'Established DAO',
        monthlyBudget: 200000,
        services: ['alchemy.eth', 'thegraph.eth', 'contributor.payments', 'grant.program', 'audit.services'],
        contributors: 15,
        grants: 8,
    },
};

// Real-world addresses (for demo purposes)
export const EXAMPLE_RECIPIENTS = {
    CONTRIBUTOR_ALICE: '0x1234567890123456789012345678901234567890',
    CONTRIBUTOR_BOB: '0x2345678901234567890123456789012345678901',
    GRANT_RECIPIENT_1: '0x3456789012345678901234567890123456789012',
    INFRASTRUCTURE_WALLET: '0x4567890123456789012345678901234567890123',
};
