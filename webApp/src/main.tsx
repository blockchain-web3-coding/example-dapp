import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Web3ProviderWrapper } from './connectWallet/Provider';

const walletConnectProjectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Web3ProviderWrapper walletConnectProjectId={walletConnectProjectId}>
      <App />
    </Web3ProviderWrapper>
  </StrictMode>
);
