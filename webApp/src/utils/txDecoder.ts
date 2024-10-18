import { ethers } from "ethers";

class TxDecoder {
  private interface: ethers.utils.Interface;

  constructor(
    abi: ethers.utils.Fragment[] | string[] | ethers.utils.Interface
  ) {
    if (abi instanceof ethers.utils.Interface) {
      this.interface = abi;
    } else {
      this.interface = new ethers.utils.Interface(abi);
    }
  }

  public decodeTxInput(txInput: string): ethers.utils.TransactionDescription {
    try {
      return this.interface.parseTransaction({ data: txInput });
    } catch (error) {
      throw new Error(`Failed to decode transaction input: ${error}`);
    }
  }

  public decodeTxInputFromFullTx(
    tx: ethers.providers.TransactionResponse
  ): ethers.utils.TransactionDescription {
    if (!tx.data) {
      throw new Error("Transaction does not contain input data");
    }
    return this.decodeTxInput(tx.data);
  }

  public decodeLogs(
    logs: ethers.providers.Log[]
  ): ethers.utils.LogDescription[] {
    return logs
      .map((log) => {
        try {
          return this.interface.parseLog(log);
        } catch (error) {
          console.warn(`Failed to decode log: ${error}`);
          return null;
        }
      })
      .filter((log): log is ethers.utils.LogDescription => log !== null);
  }
}

export { TxDecoder };
