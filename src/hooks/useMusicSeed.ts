import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { formatEther } from "viem";
import { CONTRACT_ADDRESSES, MUSIC_SEED_ABI } from "@/lib/contracts";

const CHAIN = "polygonAmoy" as const;
const address = CONTRACT_ADDRESSES[CHAIN].MusicSeed;

export function useSeedInfo(songId: bigint) {
  const { data, isLoading } = useReadContract({
    address,
    abi: MUSIC_SEED_ABI,
    functionName: "seedInfo",
    args: [songId],
  });

  if (!data) return { seedInfo: null, isLoading };

  return {
    isLoading,
    seedInfo: {
      artistWallet: data[0],
      totalSupply: Number(data[1]),
      soldAmount: Number(data[2]),
      initialPrice: formatEther(data[3]),
      revenuePerSeed: formatEther(data[4]),
      totalRevenue: formatEther(data[5]),
      active: data[6],
    },
  };
}

export function useCurrentPrice(songId: bigint) {
  const { data } = useReadContract({
    address,
    abi: MUSIC_SEED_ABI,
    functionName: "getCurrentPrice",
    args: [songId],
  });
  return data ? formatEther(data) : "0";
}

export function usePurchaseCost(songId: bigint, amount: bigint) {
  const { data } = useReadContract({
    address,
    abi: MUSIC_SEED_ABI,
    functionName: "getPurchaseCost",
    args: [songId, amount],
    query: { enabled: amount > 0n },
  });
  return data ? formatEther(data) : "0";
}

export function usePendingRoyalty(songId: bigint) {
  const { address: wallet } = useAccount();
  const { data, refetch } = useReadContract({
    address,
    abi: MUSIC_SEED_ABI,
    functionName: "pendingRoyalty",
    args: wallet ? [songId, wallet] : undefined,
    query: { enabled: !!wallet },
  });
  return { pending: data ? formatEther(data) : "0", refetch };
}

export function useBuySeed() {
  const { writeContract, data: txHash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  function buySeed(songId: bigint, amount: bigint) {
    writeContract({
      address,
      abi: MUSIC_SEED_ABI,
      functionName: "buySeed",
      args: [songId, amount],
    });
  }

  return { buySeed, txHash, isPending, isConfirming, isSuccess, error };
}

export function useClaimRoyalty() {
  const { writeContract, data: txHash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  function claimRoyalty(songId: bigint) {
    writeContract({
      address,
      abi: MUSIC_SEED_ABI,
      functionName: "claimRoyalty",
      args: [songId],
    });
  }

  return { claimRoyalty, txHash, isPending, isConfirming, isSuccess };
}
