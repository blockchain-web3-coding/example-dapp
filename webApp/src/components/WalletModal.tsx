import type { ReactNode } from 'react';
import { useState, useMemo } from 'react';
import { useAccount } from '../connectWallet/Provider';
import { FaTimes } from 'react-icons/fa';

interface WalletModalProps {
  children: ReactNode;
}

type ConnectorId = 'injected' | 'metamask' | 'coinbase' | 'walletconnect';

export function WalletModal({ children }: WalletModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const handleToggle = () => setIsOpen(!isOpen);

  const { connect: connectWallet, injectedWallets } = useAccount();

  const staticWalletOptions = [
    {
      name: 'MetaMask',
      connectorId: 'metamask',
      img: '/wallets/metamaskIcon.svg',
      providerId: undefined,
    },
    {
      name: 'Coinbase',
      connectorId: 'coinbase',
      img: '/wallets/coinbaseIcon.svg',
      providerId: undefined,
    },
    {
      name: 'WalletConnect',
      connectorId: 'walletconnect',
      img: '/wallets/walletConnectIcon.svg',
      providerId: undefined,
    },
  ];

  const filteredInjectedWallets = useMemo(() => {
    const seenNames = new Set();
    return injectedWallets
      .filter((wallet) => {
        const name = wallet.info.name.toLowerCase();
        if (
          seenNames.has(name) ||
          name === 'metamask' ||
          name === 'coinbase wallet'
        ) {
          return false;
        }
        seenNames.add(name);
        return true;
      })
      .map((wallet) => ({
        name: wallet.info.name,
        connectorId: 'injected',
        img: wallet.info.icon,
        providerId: wallet.info.uuid,
      }));
  }, [injectedWallets]);

  const allWalletOptions = [...staticWalletOptions, ...filteredInjectedWallets];

  const handleConnect = async (connectorId: string, providerId?: string) => {
    try {
      if (connectorId === 'injected' && providerId) {
        await connectWallet('injected', providerId);
      } else {
        await connectWallet(connectorId as ConnectorId);
      }
      handleToggle();
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  return (
    <>
      <div onClick={handleToggle} className="z-99">
        {children}
      </div>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 backdrop-blur-md z-50">
          <div className="w-[400px] p-6 rounded-lg shadow-xl bg-gray-800 bg-opacity-80 outline outline-gray-700 outline-1">
            <div className="flex justify-between items-center mb-5">
              <h1 className="text-white">Connect Wallet</h1>
              <FaTimes
                onClick={handleToggle}
                className="text-gray-400 cursor-pointer hover:text-gray-300"
              />
            </div>
            <div className="flex flex-col gap-4 mt-4">
              {allWalletOptions.map((wallet) => (
                <div
                  key={wallet.name}
                  onClick={() =>
                    handleConnect(wallet.connectorId, wallet.providerId)
                  }
                  className="cursor-pointer flex items-center hover:bg-gray-700 transition rounded-lg p-3"
                >
                  <h1 className="text-white">{wallet.name}</h1>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
