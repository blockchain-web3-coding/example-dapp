"use client";

import { BaseConnector } from "./BaseConnector";
import { EthereumProvider } from "@walletconnect/ethereum-provider";

type Event =
  | "connect"
  | "disconnect"
  | "message"
  | "chainChanged"
  | "accountsChanged"
  | "session_delete"
  | "session_event"
  | "session_update"
  | "display_uri";

export class WalletConnectConnector extends BaseConnector {
  private wcProvider: InstanceType<typeof EthereumProvider> | null = null;

  constructor(private projectId: string, private chains: number[]) {
    super();
    if (typeof window !== "undefined") {
      this.initProvider();
    }
  }

  private async initProvider() {
    if (!this.wcProvider) {
      this.wcProvider = await EthereumProvider.init({
        projectId: this.projectId,
        // chains: this.chains,
        optionalChains: this.chains as [number, ...number[]],
        showQrModal: true,
        methods: [
          "eth_sendTransaction",
          "eth_signTransaction",
          "personal_sign",
          "eth_sign",
          "eth_signTypedData",
          "eth_signTypedData_v4",
        ],
        events: [
          "disconnect",
          "accountsChanged",
          "chainChanged",
          "connect",
          "session_event",
          "display_uri",
        ],
      });
      this.provider = this.wcProvider;
    }
  }

  async connect(): Promise<string> {
    await this.initProvider();
    if (!this.wcProvider) {
      throw new Error("Failed to initialize WalletConnect provider");
    }

    try {
      const accounts = await this.wcProvider.enable();
      return accounts[0] ?? "";
    } catch (error) {
      console.error("WalletConnect connection error:", error);
      throw new Error("User rejected connection");
    }
  }

  async disconnect(): Promise<void> {
    if (this.wcProvider) {
      await this.wcProvider.disconnect();
      this.wcProvider = null;
      this.provider = null;
    }
  }

  async getAccount(): Promise<string | null> {
    if (this.provider) {
      const accounts = (await this.provider.request({
        method: "eth_accounts",
      })) as string[];
      return accounts[0] ?? null;
    }
    return null;
  }

  async getChainId(): Promise<number | null> {
    if (this.provider) {
      const chainId = await this.provider.request({ method: "eth_chainId" });
      return parseInt(chainId as string, 16);
    }
    return null;
  }

  private getLocalStorage() {
    if (typeof window !== "undefined") {
      return window.localStorage;
    }
    return null;
  }

  async isAuthorized(): Promise<boolean> {
    await this.initProvider();
    if (this.wcProvider) {
      const localStorage = this.getLocalStorage();
      if (localStorage) {
        const sessionKey = `wc@2:client:0.3//session`;
        const session = localStorage.getItem(sessionKey);
        return !!session;
      }
    }
    return false;
  }

  on(event: Event, callback: (...args: unknown[]) => void): void {
    if (this.wcProvider) {
      this.wcProvider.on(event, callback);
    }
  }

  off(event: Event, callback: (...args: unknown[]) => void): void {
    if (this.wcProvider) {
      this.wcProvider.off(event, callback);
    }
  }
}
