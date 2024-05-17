import { Web3BaseWalletAccount } from "web3";


export default interface IXCoinToken {
    balanceOf(address: string): Promise<number>;
    mint(to: string, amount: number): Promise<any>;
    transfer(from: Web3BaseWalletAccount, to: string, amount: number): Promise<any>;
}