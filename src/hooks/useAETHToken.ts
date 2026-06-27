import { useReadContract, useAccount } from "wagmi";
import { formatEther } from "viem";
import { CONTRACT_ADDRESSES, AETH_TOKEN_ABI } from "@/lib/contracts";

export function useAETHBalance() {
  const { address } = useAccount();
  const chain = "polygonAmoy" as const;

  const { data, isLoading } = useReadContract({
    address: CONTRACT_ADDRESSES[chain].AETHToken,
    abi: AETH_TOKEN_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  return {
    balance: data ? formatEther(data) : "0",
    isLoading,
  };
}

export function useAETHTotalSupply() {
  const { data } = useReadContract({
    address: CONTRACT_ADDRESSES.polygonAmoy.AETHToken,
    abi: AETH_TOKEN_ABI,
    functionName: "totalSupply",
  });
  return data ? formatEther(data) : "0";
}
