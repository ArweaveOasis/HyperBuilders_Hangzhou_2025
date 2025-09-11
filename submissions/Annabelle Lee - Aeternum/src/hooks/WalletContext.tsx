import { useActiveAddress, useConnection } from "arweave-wallet-kit";
import { useCallback } from "react";

export const useWallet = () => {
  const { connect } = useConnection();
  const activeAddress = useActiveAddress();
  const checkLogin = useCallback(() => {
    if (!activeAddress) {
      connect();
      return false;
    }
    return true;
  }, [connect, activeAddress]);
  return { checkLogin, activeAddress };
}; 