"use client";

import type { EthereumProvider } from "../utils/types";

export abstract class BaseConnector {
  protected provider: EthereumProvider | null = null;

  abstract connect(): Promise<string>;
  abstract disconnect(): Promise<void>;
  abstract getAccount(): Promise<string | null>;
  abstract getChainId(): Promise<number | null>;
  abstract isAuthorized(): Promise<boolean>;

  getProvider(): EthereumProvider | null {
    return this.provider;
  }

  on(event: string, callback: (...args: unknown[]) => void): void {
    if (this.provider) {
      this.provider.on(event, callback);
    }
  }

  off(event: string, callback: (...args: unknown[]) => void): void {
    if (this.provider) {
      this.provider.off(event, callback);
    }
  }
}
