const { ethers } = require("ethers");

export const url =
  "https://speedy-nodes-nyc.moralis.io/c7fc98eca87d511079885e25/eth/rinkeby";
export const provider = new ethers.providers.JsonRpcProvider(url);

export const token_address = "0xFab46E002BbF0b4509813474841E0716E6730136";

export const wallet_address = "0x76823c8E70186A1ADB83304C04e5121C548Cf09A";

//Dummy wallet account private key
export const private_key =
  "1bad2703de127f05cd4bea87eae8c144276cd91039da52dddea3ad98fdd164dc";

export const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint)",
  "function approve(address spender, uint amount) view returns (bool)",
  "function transfer(address to, uint amount)",
];
export const wallet = new ethers.Wallet(private_key, provider);

export const contract = new ethers.Contract(token_address, ERC20_ABI, provider);
