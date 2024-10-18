"use client";

import { BaseConnector } from "./BaseConnector";
import type {
  EIP6963ProviderDetail,
  EIP6963AnnounceProviderEvent,
} from "../utils/types";

export class InjectedConnector extends BaseConnector {
  private providers: EIP6963ProviderDetail[] = [];

  constructor() {
    super();
    // Only initialize providers if window is defined
    if (typeof window !== "undefined") {
      this.initializeProviders();
    }
  }

  private initializeProviders() {
    window.addEventListener("eip6963:announceProvider", ((
      event: CustomEvent<EIP6963AnnounceProviderEvent["detail"]>
    ) => {
      this.providers.push(event.detail);
    }) as EventListener);

    window.dispatchEvent(new Event("eip6963:requestProvider"));
  }

  getProviders(): EIP6963ProviderDetail[] {
    return this.providers;
  }

  async connect(providerId?: string): Promise<string> {
    if (providerId) {
      const selectedProvider = this.providers.find(
        (p) => p.info.uuid === providerId
      );
      if (selectedProvider) {
        this.provider = selectedProvider.provider;
      } else {
        throw new Error("Selected provider not found");
      }
    } else if (this.providers.length > 0) {
      this.provider = this.providers[0]!.provider;
    }

    if (this.provider) {
      try {
        const accounts = (await this.provider.request({
          method: "eth_requestAccounts",
        })) as string[];
        const account = accounts[0];
        if (!account) throw new Error("No accounts found");
        return account;
      } catch (error: unknown) {
        console.error(error);
        throw new Error("User rejected connection");
      }
    } else {
      throw new Error("No injected ethereum provider found");
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
