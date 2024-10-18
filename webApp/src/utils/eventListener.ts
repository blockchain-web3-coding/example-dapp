import { ethers } from 'ethers';

interface EventListenerConfig {
  rpcUrl: string;
  contractAddress: string;
  intervalMs: number;
  abi: ethers.utils.Fragment[] | string[] | ethers.utils.Interface;
}

class EventListener {
  private provider: ethers.providers.JsonRpcProvider;
  private contract: ethers.Contract;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor(private config: EventListenerConfig) {
    this.provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
    this.contract = new ethers.Contract(
      config.contractAddress,
      config.abi,
      this.provider
    );
  }

  public start(callback: (events: ethers.Event[]) => void): void {
    if (this.intervalId) {
      console.warn('Event listener is already running');
      return;
    }

    let lastBlockNumber = 0;

    this.intervalId = setInterval(async () => {
      try {
        const currentBlockNumber = await this.provider.getBlockNumber();

        if (currentBlockNumber > lastBlockNumber) {
          const events = await this.contract.queryFilter(
            '*',
            lastBlockNumber + 1,
            currentBlockNumber
          );
          if (events.length > 0) {
            callback(events);
          }
          lastBlockNumber = currentBlockNumber;
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    }, this.config.intervalMs);
  }

  public stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export { EventListener };
export type { EventListenerConfig };
