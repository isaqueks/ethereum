import Web3, { Web3BaseWallet, Web3BaseWalletAccount } from 'web3';
import fs from 'fs';
import WalletManager from './WalletManager';
import XCoinToken from './contracts/XCoin/XCoinToken.implementation';
import { XCoinTokenABI } from './contracts/XCoin/XCoinToken.abi';

const web3 = new Web3('https://rpc2.sepolia.org');
const walletManager = new WalletManager(new Web3('https://rpc2.sepolia.org'));
const xCoin = new XCoinToken(web3, '0x2be8c2f385b7E6f24D0c1571Ceab5433eC650f98', XCoinTokenABI);

const CONTA_A_ADDRESS = '0x15F4DEa7b2A1F4b3051552d262F903b6eE2F3Ec7';

(async () => {


  const WALLET_FILE = 'wallets/wallet.json';
  const WALLET_PASSWORD = 'sua senha super secreta';

  let wallet: Web3BaseWalletAccount;

  if (!fs.existsSync(WALLET_FILE)) {
    wallet = await walletManager.createWallet();
    walletManager.saveWalletToFile(wallet, WALLET_PASSWORD, WALLET_FILE);
  }
  else {
    wallet = await walletManager.loadWalletFromFile(WALLET_FILE, WALLET_PASSWORD);
  }

  console.log('Endereço da Conta:', wallet.address);

  let etherBalance = await web3.eth.getBalance(wallet.address);
  let xCoinBalance = await xCoin.balanceOf(wallet.address);

  console.log('Saldo (ETH):\t', web3.utils.fromWei(etherBalance, 'ether'), 'ETH');
  console.log('Saldo (XCoin):\t', xCoinBalance / (10**2), 'XCoin');

  console.log(`Transferindo 2 XCoin para ${CONTA_A_ADDRESS}`);
  try {
    console.log(await xCoin.transfer(wallet, CONTA_A_ADDRESS, 2 /* 2 XCoin */ * 10**2));
  }
  catch (err) {
    console.error(err);
    console.log('Transação falhou');
    throw err;
  }
  console.log('Transferência realizada com sucesso!')

  etherBalance = await web3.eth.getBalance(wallet.address);
  xCoinBalance = await xCoin.balanceOf(wallet.address);

  console.log('Saldo (ETH):\t', web3.utils.fromWei(etherBalance, 'ether'), 'ETH');
  console.log('Saldo (XCoin):\t', xCoinBalance / (10**2), 'XCoin');

  // const signed = await wallet.signTransaction({
  //   to: '0x15F4DEa7b2A1F4b3051552d262F903b6eE2F3Ec7', 
  //   from: wallet.address, 
  //   value: web3.utils.toWei("0.01", "ether"),
  //   gasPrice: web3.utils.toWei("10", "gwei"),
  //   gas: 21000,

  // });

  // console.log('Transação assinada:', signed);

  // await web3.eth.sendSignedTransaction(signed.rawTransaction as any)

  

})()
.catch(e => {
  console.error(e);
})