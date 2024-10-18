type Address = string | undefined;

export function formatAddress(address: Address): string {
  if (!address) {
    return 'Unknown Address';
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
