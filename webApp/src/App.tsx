import { useState } from 'react';
import { WalletModal } from './components/WalletModal';
import { useAccount } from './connectWallet/Provider';
import { formatAddress } from './utils/formatAddress';
import { useSwitchChain } from './connectWallet/hooks/useSwitchChain';
import { chains, type Chain } from './connectWallet/utils/consts';
import EventListener from './components/EventListener';

function App() {
  const { account, chainId, supportedChain, chain } = useAccount();
  const switchChain = useSwitchChain();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('wallet');

  const handleSwitchChain = async (newChainId: number) => {
    try {
      await switchChain(newChainId);
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Failed to switch chain:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center">
      {!account ? (
        <WalletModal>
          <button className="bg-blue-800/80 hover:bg-blue-600 text-white rounded-full py-2 px-4">
            Connect Wallet
          </button>
        </WalletModal>
      ) : (
        <div className="bg-gray-700 p-8 rounded-lg shadow-xl w-full max-w-4xl">
          <div className="flex mb-4">
            <button
              className={`mr-2 px-4 py-2 rounded-t-lg ${
                activeTab === 'wallet'
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-800 text-gray-400'
              }`}
              onClick={() => setActiveTab('wallet')}
            >
              Wallet Details
            </button>
            <button
              className={`px-4 py-2 rounded-t-lg ${
                activeTab === 'events'
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-800 text-gray-400'
              }`}
              onClick={() => setActiveTab('events')}
            >
              Event Listener
            </button>
          </div>

          {activeTab === 'wallet' ? (
            <div>
              <p className="text-white mb-2">
                Address: {formatAddress(account)}
              </p>
              <p className="text-white mb-2">Chain ID: {chainId}</p>
              {supportedChain && chain ? (
                <p className="text-white mb-2">Chain: {chain.name}</p>
              ) : (
                <p className="text-red-500 mb-2">Unsupported Chain</p>
              )}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="bg-blue-800/80 hover:bg-blue-600 text-white rounded-full py-2 px-4"
                >
                  Switch Chain
                </button>
                {isDropdownOpen && (
                  <div className="absolute mt-2 w-48 rounded-md shadow-lg bg-gray-800 bg-opacity-50 backdrop-blur-md outline outline-gray-700 outline-1">
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    >
                      {Object.values(chains).map((supportedChain: Chain) => (
                        <button
                          key={supportedChain.id}
                          onClick={() => handleSwitchChain(supportedChain.id)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-400 cursor-pointer hover:text-gray-300 bg-opacity-80  hover:bg-gray-700 "
                          role="menuitem"
                        >
                          {supportedChain.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <EventListener />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
