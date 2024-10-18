export interface WalletConnectProviderOptions {
  rpc: { [chainId: number]: string };
}

export interface EIP6963ProviderInfo {
  uuid: string;
  name: string;
  icon: string;
  rdns: string;
}

export interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo;
  provider: EthereumProvider;
}

export interface EIP6963AnnounceProviderEvent extends CustomEvent {
  detail: EIP6963ProviderDetail;
}

export interface EthereumProvider {
  request(args: { method: string; params?: unknown[] }): Promise<unknown>;
  on(event: string, callback: (...args: unknown[]) => void): void;
  off(event: string, callback: (...args: unknown[]) => void): void;
  isMetaMask?: boolean;
  isCoinbaseWallet?: boolean;
}

export interface Chain {
  chainId: number;
  name: string;
  rpcUrl: string;
}

export interface WalletConnectOptions {
  projectId: string;
  chains: number[];
  showQrModal?: boolean;
}
