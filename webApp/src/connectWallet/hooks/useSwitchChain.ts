import type { ethers } from 'ethers';
import { useAccount } from '../Provider';
import { useCallback } from 'react';

export const useSwitchChain = () => {
  const { signer } = useAccount();

  const switchChain = useCallback(
    async (newChainId: number) => {
      if (!signer) {
        throw new Error('Signer not initialized');
      }

      const provider = signer.provider as ethers.providers.Web3Provider;
      if (!provider) {
        throw new Error('Provider not found');
      }

      try {
        await provider.send('wallet_switchEthereumChain', [
          { chainId: `0x${newChainId.toString(16)}` },
        ]);
      } catch (switchError: unknown) {
        if (
          typeof switchError === 'object' &&
          switchError !== null &&
          'code' in switchError
        ) {
        }
        if ((switchError as { code: number }).code === 4902) {
          try {
            await provider.send('wallet_addEthereumChain', [
              {
                chainId: `0x${newChainId.toString(16)}`,
              },
            ]);
          } catch (addError) {
            console.error('Failed to add chain:', addError);
            throw addError;
          }
        } else {
          console.error('Failed to switch chain:', switchError);
          throw switchError;
        }
      }
    },
    [signer]
  );

  return switchChain;
};
