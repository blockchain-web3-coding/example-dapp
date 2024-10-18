export const supportedChains = {
  ethereum: 'ethereum',
  arbitrum: 'arbitrum',
  polygon: 'polygon',
  optimism: 'optimism',
  avalanche: 'avalanche',
  base: 'base',
} as const;

export type SupportedChain =
  (typeof supportedChains)[keyof typeof supportedChains];

// TODO: add logos
export const chainLogos = {
  [supportedChains.ethereum]: '/chains/ethLogo.png',
  [supportedChains.arbitrum]: '/chains/arbLogo.png',
  [supportedChains.polygon]: '/chains/polygonLogo.png',
  [supportedChains.optimism]: '/chains/optimismLogo.png',
  [supportedChains.avalanche]: '/chains/avalancheLogo.png',
  [supportedChains.base]: '/chains/baseLogo.png',
} as const;

export type ChainLogo = (typeof chainLogos)[SupportedChain];

export const chainUrls = {
  [supportedChains.ethereum]: 'https://etherscan.io',
  [supportedChains.arbitrum]: 'https://arbiscan.io',
  [supportedChains.polygon]: 'https://polygonscan.com',
  [supportedChains.optimism]: 'https://optimistic.etherscan.io',
  [supportedChains.avalanche]: 'https://snowtrace.io/',
  [supportedChains.base]: 'https://basescan.org/',
} as const;

export const chainIds = {
  [supportedChains.ethereum]: 1,
  [supportedChains.arbitrum]: 42161,
  [supportedChains.polygon]: 137,
  [supportedChains.optimism]: 10,
  [supportedChains.avalanche]: 43114,
  [supportedChains.base]: 8453,
} as const;

export type ChainId = (typeof chainIds)[SupportedChain];

export const rpcUrls = {
  [supportedChains.ethereum]: 'https://eth.llamarpc.com',
  [supportedChains.arbitrum]: 'https://arb1.arbitrum.io/rpc',
  [supportedChains.polygon]: 'https://polygon-rpc.com',
  [supportedChains.optimism]: 'https://mainnet.optimism.io',
  [supportedChains.avalanche]: 'https://api.avax.network/ext/bc/c/rpc',
  [supportedChains.base]: 'https://mainnet.base.org/',
} as const;

export const tokenAPIs = {
  [supportedChains.ethereum]: 'https://tokens.coingecko.com/ethereum/all.json',
  [supportedChains.arbitrum]:
    'https://tokens.coingecko.com/arbitrum-one/all.json',
  [supportedChains.polygon]:
    'https://tokens.coingecko.com/polygon-pos/all.json',
  [supportedChains.optimism]:
    'https://tokens.coingecko.com/optimistic-ethereum/all.json',
  [supportedChains.avalanche]:
    'https://tokens.coingecko.com/avalanche/all.json',
  [supportedChains.base]: 'https://tokens.coingecko.com/base/all.json',
} as const;

export const chains = {
  [chainIds.ethereum]: {
    id: chainIds.ethereum,
    name: supportedChains.ethereum,
    logo: chainLogos[supportedChains.ethereum],
    explorerUrl: chainUrls[supportedChains.ethereum],
    rpcUrl: rpcUrls[supportedChains.ethereum],
    tokenListUrl: tokenAPIs[supportedChains.ethereum],
  },
  [chainIds.arbitrum]: {
    id: chainIds.arbitrum,
    name: supportedChains.arbitrum,
    logo: chainLogos[supportedChains.arbitrum],
    explorerUrl: chainUrls[supportedChains.arbitrum],
    rpcUrl: rpcUrls[supportedChains.arbitrum],
    tokenListUrl: tokenAPIs[supportedChains.arbitrum],
  },
  [chainIds.polygon]: {
    id: chainIds.polygon,
    name: supportedChains.polygon,
    logo: chainLogos[supportedChains.polygon],
    explorerUrl: chainUrls[supportedChains.polygon],
    rpcUrl: rpcUrls[supportedChains.polygon],
    tokenListUrl: tokenAPIs[supportedChains.polygon],
  },
  [chainIds.optimism]: {
    id: chainIds.optimism,
    name: supportedChains.optimism,
    logo: chainLogos[supportedChains.optimism],
    explorerUrl: chainUrls[supportedChains.optimism],
    rpcUrl: rpcUrls[supportedChains.optimism],
    tokenListUrl: tokenAPIs[supportedChains.optimism],
  },
  [chainIds.avalanche]: {
    id: chainIds.avalanche,
    name: supportedChains.avalanche,
    logo: chainLogos[supportedChains.avalanche],
    explorerUrl: chainUrls[supportedChains.avalanche],
    rpcUrl: rpcUrls[supportedChains.avalanche],
    tokenListUrl: tokenAPIs[supportedChains.avalanche],
  },
  [chainIds.base]: {
    id: chainIds.base,
    name: supportedChains.base,
    logo: chainLogos[supportedChains.base],
    explorerUrl: chainUrls[supportedChains.base],
    rpcUrl: rpcUrls[supportedChains.base],
    tokenListUrl: tokenAPIs[supportedChains.base],
  },
} as const;

export type Chain = {
  id: ChainId;
  name: SupportedChain;
  logo: ChainLogo;
  explorerUrl: ChainUrl;
  rpcUrl: RpcUrl;
  tokenListUrl: TokenAPI;
};

export type ChainUrl = (typeof chainUrls)[SupportedChain];
export type RpcUrl = (typeof rpcUrls)[SupportedChain];
export type TokenAPI = (typeof tokenAPIs)[SupportedChain];
