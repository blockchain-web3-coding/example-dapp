'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ethers } from 'ethers';
import { InjectedConnector } from './connectors/InjectedConnector';
import { MetaMaskConnector } from './connectors/MetaMaskConnector';
import { CoinbaseConnector } from './connectors/CoinbaseConnector';
import { WalletConnectConnector } from './connectors/WalletConnectConnector';
import { chainIds, chains, type Chain } from './utils/consts';
import type { EIP6963ProviderDetail } from './utils/types';

type WalletConnectOptions = string;

const createConnectors = (walletConnectProjectId: string) => ({
  injected: new InjectedConnector(),
  metamask: new MetaMaskConnector(),
  coinbase: new CoinbaseConnector(
    'Puddle Jumper',
    'https://example.com/logo.png',
    'https://mainnet.infura.io/v3/YOUR-PROJECT-ID',
    1
  ),
  walletconnect: new WalletConnectConnector(
    walletConnectProjectId,
    Object.values(chainIds)
  ),
});

type ConnectorId = 'injected' | 'metamask' | 'coinbase' | 'walletconnect';
type Connector =
  | InjectedConnector
  | MetaMaskConnector
  | CoinbaseConnector
  | WalletConnectConnector;

interface Web3ContextType {
  account: string | null;
  chainId: string | null;
  supportedChain: boolean;
  chain: Chain | null;
  connector: Connector | null;
  signer: ethers.Signer | null;
  connect: (
    connectorId: ConnectorId,
    walletConnectOptions?: WalletConnectOptions
  ) => Promise<void>;
  disconnect: () => Promise<void>;
  injectedWallets: EIP6963ProviderDetail[];
}

const Web3Context = createContext<Web3ContextType | null>(null);

interface Web3ProviderProps {
  children: ReactNode;
  walletConnectProjectId: string;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({
  children,
  walletConnectProjectId,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [connector, setConnector] = useState<Connector | null>(null);
  const [connectors, setConnectors] = useState(() =>
    createConnectors(walletConnectProjectId)
  );
  const [supportedChain, setSupportedChain] = useState<boolean>(false);
  const [chain, setChain] = useState<Chain | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [injectedWallets, setInjectedWallets] = useState<
    EIP6963ProviderDetail[]
  >([]);

  const updateSignerForChain = async (
    provider: ethers.providers.ExternalProvider,
    currentAccount: string | null
  ) => {
    const ethersProvider = new ethers.providers.Web3Provider(provider);
    if (currentAccount) {
      const newSigner = ethersProvider.getSigner(currentAccount);
      setSigner(newSigner);
    } else {
      setSigner(null);
    }
  };

  const connect = async (
    connectorId: ConnectorId,
    options?: WalletConnectOptions
  ) => {
    let selectedConnector = connectors[connectorId];
    if (connectorId === 'walletconnect' && typeof options === 'string') {
      selectedConnector = new WalletConnectConnector(
        options,
        Object.values(chainIds)
      );
      setConnectors((prev) => ({
        ...prev,
        walletconnect: selectedConnector as WalletConnectConnector,
      }));
    } else if (connectorId === 'injected' && typeof options === 'string') {
      await (selectedConnector as InjectedConnector).connect(options);
    } else {
      await selectedConnector.connect();
    }
    setConnector(selectedConnector);
    const address = await selectedConnector.getAccount();
    const chainId = await selectedConnector.getChainId();
    setAccount(address);
    setChainId(chainId?.toString() ?? null);

    const isSupported = Object.keys(chains).includes(String(chainId));
    setSupportedChain(isSupported);
    setChain(
      isSupported ? chains[Number(chainId) as keyof typeof chains] : null
    );

    // Update signer based on connected chain and account
    const provider = selectedConnector.getProvider();
    if (chainId && provider) {
      await updateSignerForChain(provider, address);
    }
  };

  const disconnect = async () => {
    if (connector) {
      try {
        await connector.disconnect();
        setConnector(null);
        setAccount(null);
        setChainId(null);
        setSupportedChain(false);
        setChain(null);
        setSigner(null);
      } catch (error) {
        console.error('Failed to disconnect:', error);
      }
    }
  };

  useEffect(() => {
    const tryEagerConnect = async () => {
      for (const connectorId in connectors) {
        const connector = connectors[connectorId as ConnectorId];
        if (await connector.isAuthorized()) {
          await connect(connectorId as ConnectorId);
          break;
        }
      }
    };
    void tryEagerConnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (connector) {
      connector.on('accountsChanged', (accounts: unknown) => {
        const newAccount =
          Array.isArray(accounts) && accounts.length > 0
            ? (accounts[0] as string)
            : null;
        setAccount(newAccount);
        if (chainId) {
          const provider = connector.getProvider();
          if (provider) {
            void updateSignerForChain(provider, newAccount);
          }
        }
      });
      connector.on('chainChanged', (newChainId: unknown) => {
        let newChainIdString = newChainId as string;

        // Check if the newChainId is a hex value and convert it to decimal if necessary
        if (newChainIdString.startsWith('0x')) {
          newChainIdString = parseInt(newChainIdString, 16).toString();
        }

        setChainId(newChainIdString);
        const isSupported = Object.keys(chains).includes(newChainIdString);
        setSupportedChain(isSupported);
        setChain(
          isSupported
            ? chains[Number(newChainIdString) as keyof typeof chains]
            : null
        );
        const provider = connector.getProvider();
        if (provider) {
          void updateSignerForChain(provider, account);
        }
      });
      connector.on('disconnect', () => {
        setConnector(null);
        setAccount(null);
        setChainId(null);
        setSupportedChain(false);
        setChain(null);
        setSigner(null);
      });
    }
  }, [connector, chainId, account]);

  useEffect(() => {
    if (chainId && account !== undefined) {
      const provider = connector?.getProvider();
      if (provider) {
        void updateSignerForChain(provider, account);
      }
    }
  }, [chainId, account, connector]);

  useEffect(() => {
    const injectedConnector = connectors.injected;
    const updateInjectedWallets = () => {
      setInjectedWallets(injectedConnector.getProviders());
    };

    // Initial update
    updateInjectedWallets();

    // Set up an interval to check for new wallets
    const intervalId = setInterval(updateInjectedWallets, 1000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contextValue: Web3ContextType = {
    account,
    chainId,
    supportedChain,
    chain,
    connector,
    signer,
    connect,
    disconnect,
    injectedWallets,
  };

  if (!isMounted) {
    return null; // or a loading spinner
  }

  return (
    <Web3Context.Provider value={contextValue}>{children}</Web3Context.Provider>
  );
};

export const useAccount = (): Web3ContextType => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useAccount must be used within a Web3Provider');
  }
  return context;
};

const queryClient = new QueryClient();

interface Web3ProviderWrapperProps {
  children: ReactNode;
  walletConnectProjectId: string;
}

export const Web3ProviderWrapper: React.FC<Web3ProviderWrapperProps> = ({
  children,
  walletConnectProjectId,
}) => (
  <QueryClientProvider client={queryClient}>
    <Web3Provider walletConnectProjectId={walletConnectProjectId}>
      {children}
    </Web3Provider>
  </QueryClientProvider>
);

export default Web3ProviderWrapper;
