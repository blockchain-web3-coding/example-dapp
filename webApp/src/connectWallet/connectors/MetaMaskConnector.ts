"use client";

import { BaseConnector } from "./BaseConnector";
import type { EIP6963AnnounceProviderEvent } from "../utils/types";

export class MetaMaskConnector extends BaseConnector {
  constructor() {
    super();
    if (typeof window !== "undefined") {
      this.initializeProvider();
    }
  }

  private initializeProvider() {
    // Listen for EIP-6963 wallet announcements
    window.addEventListener("eip6963:announceProvider", ((
      event: CustomEvent<EIP6963AnnounceProviderEvent["detail"]>
    ) => {
      const { detail } = event;
      if (detail.info.name === "MetaMask") {
        this.provider = detail.provider;
      }
    }) as EventListener);

    // Dispatch a request to get any available providers
    window.dispatchEvent(new Event("eip6963:requestProvider"));
  }

  async connect(): Promise<string> {
    if (!this.provider) {
      throw new Error("MetaMask not found");
    }
    try {
      const accounts = (await this.provider.request({
        method: "eth_requestAccounts",
      })) as string[];
      if (!accounts.length) {
        throw new Error("No accounts found");
      }
      const account = accounts[0];
      if (!account) throw new Error("No accounts found");

      return account;
    } catch (error: unknown) {
      console.error(error);
      throw new Error("User rejected connection");
    }
  }

  async disconnect(): Promise<void> {
    this.provider = null;
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
      const chainId = (await this.provider.request({
        method: "eth_chainId",
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
