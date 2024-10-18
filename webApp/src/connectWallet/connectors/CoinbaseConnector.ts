'use client';

import { BaseConnector } from './BaseConnector';
import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk';

export class CoinbaseConnector extends BaseConnector {
  private coinbaseWallet: CoinbaseWalletSDK | null = null;

  constructor(
    appName: string,
    appLogoUrl: string,
    _jsonRpcUrl: string,
    _chainId: number
  ) {
    super();
    if (typeof window !== 'undefined') {
      this.coinbaseWallet = new CoinbaseWalletSDK({
        appName,
        appLogoUrl,
      });
      this.provider = this.coinbaseWallet.makeWeb3Provider();
    }
  }

  async connect(): Promise<string> {
    if (!this.provider) {
      throw new Error('Coinbase Wallet not initialized');
    }
    try {
      const accounts = (await this.provider.request({
        method: 'eth_requestAccounts',
      })) as string[];
      if (!accounts[0]) throw new Error('No accounts found');
      return accounts[0];
    } catch (error: unknown) {
      console.error(error);
      throw new Error('User rejected connection');
    }
  }

  async disconnect(): Promise<void> {
    this.provider = null;
  }

  async getAccount(): Promise<string | null> {
    if (this.provider) {
      const accounts = (await this.provider.request({
        method: 'eth_accounts',
      })) as string[];
      return accounts[0] ?? null;
    }
    return null;
  }

  async getChainId(): Promise<number | null> {
    if (this.provider) {
      const chainId = (await this.provider.request({
        method: 'eth_chainId',
      })) as string;
      return parseInt(chainId, 16);
    }
    return null;
  }

  async isAuthorized(): Promise<boolean> {
    if (this.provider) {
      const accounts = await this.getAccount();
      return accounts !== null;
    }
    return false;
  }
}
