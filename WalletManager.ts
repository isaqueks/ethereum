import Web3, { Web3BaseWalletAccount } from "web3";
import fs from 'fs';

export default class WalletManager {

  constructor(
    private web3: Web3
  ) {}

  public async createWallet(): Promise<Web3BaseWalletAccount> {
    const account = this.web3.eth.accounts.create();
    return account;
  }

  public async saveWalletToFile(
    wallet: Web3BaseWalletAccount, 
    password: string, 
    fileName: string
  ) {
    const encryptedWallet = await wallet.encrypt(password);
    await fs.promises.writeFile(fileName, JSON.stringify(encryptedWallet), 'utf-8');
    return encryptedWallet;
  }

  public async loadWalletFromFile(
    fileName: string,
    password: string 
  ): Promise<Web3BaseWalletAccount> {

    // check if file exists

    await fs.promises.access(fileName, fs.constants.F_OK);

    const encryptedWallet = await fs.promises.readFile(fileName, 'utf-8');
    const decryptedWallet = await this.web3.eth.accounts.decrypt(JSON.parse(encryptedWallet), password);
    return decryptedWallet;
  }

}