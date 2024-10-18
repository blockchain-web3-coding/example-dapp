import { ethers } from "ethers";

export class DappUtils {
  private provider: ethers.providers.JsonRpcProvider;

  constructor(rpcUrl: string) {
    this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  }

  /**
   * Estimates gas for a transaction
   */
  async estimateGas(
    to: string,
    data: string,
    value: string = "0"
  ): Promise<ethers.BigNumber> {
    const gasEstimate = await this.provider.estimateGas({
      to,
      data,
      value: ethers.utils.parseEther(value),
    });
    return gasEstimate;
  }

  /**
   * Gets the current gas price
   */
  async getGasPrice(): Promise<ethers.BigNumber> {
    return await this.provider.getGasPrice();
  }

  /**
   * Converts Wei to Ether
   */
  weiToEther(wei: ethers.BigNumberish): string {
    return ethers.utils.formatEther(wei);
  }

  /**
   * Converts Ether to Wei
   */
  etherToWei(ether: string): ethers.BigNumber {
    return ethers.utils.parseEther(ether);
  }

  /**
   * Checks if an address is a contract
   */
  async isContract(address: string): Promise<boolean> {
    const code = await this.provider.getCode(address);
    return code !== "0x";
  }

  /**
   * Gets the latest block number
   */
  async getLatestBlockNumber(): Promise<number> {
    return await this.provider.getBlockNumber();
  }

  /**
   * Gets a block by its number
   */
  async getBlock(blockNumber: number): Promise<ethers.providers.Block> {
    return await this.provider.getBlock(blockNumber);
  }

  /**
   * Waits for a transaction to be mined and returns the receipt
   */
  async waitForTransaction(
    txHash: string
  ): Promise<ethers.providers.TransactionReceipt> {
    return await this.provider.waitForTransaction(txHash);
  }
}
