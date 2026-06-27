// 배포 후 실제 주소로 교체
export const CONTRACT_ADDRESSES = {
  polygonAmoy: {
    AETHToken: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    MusicSeed: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    StreamingSettlement: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  },
  polygon: {
    AETHToken: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    MusicSeed: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    StreamingSettlement: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  },
};

export const AETH_TOKEN_ABI = [
  { name: "balanceOf", type: "function", stateMutability: "view",
    inputs: [{ name: "account", type: "address" }], outputs: [{ type: "uint256" }] },
  { name: "totalSupply", type: "function", stateMutability: "view",
    inputs: [], outputs: [{ type: "uint256" }] },
  { name: "totalBurned", type: "function", stateMutability: "view",
    inputs: [], outputs: [{ type: "uint256" }] },
  { name: "approve", type: "function", stateMutability: "nonpayable",
    inputs: [{ name: "spender", type: "address" }, { name: "amount", type: "uint256" }],
    outputs: [{ type: "bool" }] },
  { name: "allowance", type: "function", stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }, { name: "spender", type: "address" }],
    outputs: [{ type: "uint256" }] },
] as const;

export const MUSIC_SEED_ABI = [
  { name: "seedInfo", type: "function", stateMutability: "view",
    inputs: [{ name: "songId", type: "uint256" }],
    outputs: [
      { name: "artistWallet", type: "address" },
      { name: "totalSupply", type: "uint256" },
      { name: "soldAmount", type: "uint256" },
      { name: "initialPrice", type: "uint256" },
      { name: "revenuePerSeed", type: "uint256" },
      { name: "totalRevenue", type: "uint256" },
      { name: "active", type: "bool" },
    ] },
  { name: "balanceOf", type: "function", stateMutability: "view",
    inputs: [{ name: "account", type: "address" }, { name: "id", type: "uint256" }],
    outputs: [{ type: "uint256" }] },
  { name: "getCurrentPrice", type: "function", stateMutability: "view",
    inputs: [{ name: "songId", type: "uint256" }], outputs: [{ type: "uint256" }] },
  { name: "getPurchaseCost", type: "function", stateMutability: "view",
    inputs: [{ name: "songId", type: "uint256" }, { name: "amount", type: "uint256" }],
    outputs: [{ type: "uint256" }] },
  { name: "pendingRoyalty", type: "function", stateMutability: "view",
    inputs: [{ name: "songId", type: "uint256" }, { name: "holder", type: "address" }],
    outputs: [{ type: "uint256" }] },
  { name: "buySeed", type: "function", stateMutability: "nonpayable",
    inputs: [{ name: "songId", type: "uint256" }, { name: "amount", type: "uint256" }],
    outputs: [] },
  { name: "claimRoyalty", type: "function", stateMutability: "nonpayable",
    inputs: [{ name: "songId", type: "uint256" }], outputs: [] },
] as const;
