import Web3, { Contract, Web3BaseWalletAccount } from "web3";
import IXCoinToken from "./XCoinToken.interface";


export default class XCoinToken implements IXCoinToken {

  private readonly contract: Contract<any>;

  constructor(
    private web3: Web3,
    private address: string,
    private abi: any
  ) {
    this.contract = new web3.eth.Contract(abi, address);
  }

  public async balanceOf(address: string): Promise<number> {
    return Number(await this.contract.methods.balanceOf(address).call());
  }

  public async mint(to: string, amount: number): Promise<any> {
    return await this.contract.methods.mint(to, amount).send({ from: to });
  }

  public async transfer(from: Web3BaseWalletAccount, to: string, amount: number): Promise<any> {

    const query = this.contract.methods.transfer(to, amount);
    const encodedABI = query.encodeABI();
    // const signedTx = await this.web3.eth.accounts.signTransaction(
    //   {
    //     data: encodedABI,
    //     from: from.address,
    //     gas: 91000,
    //     gasPrice: '10000000000',
    //     to: this.contract.options.address,
    //   },
    //   from.privateKey
    // );

    const gasPrice = await this.web3.eth.getGasPrice();
    const latestBlock = await this.web3.eth.getBlock('latest');
    const baseFeePerGas = Number(latestBlock.baseFeePerGas);

const maxPriorityFeePerGas = this.web3.utils.toWei('2', 'gwei'); // Adjust as needed
const maxFeePerGas = Number(baseFeePerGas) + parseInt(maxPriorityFeePerGas);

const signedTx = await this.web3.eth.accounts.signTransaction(
  {
    data: encodedABI,
    from: from.address,
    gas: 91000,
    gasPrice: undefined, // Set to null when using EIP-1559
    maxFeePerGas: maxFeePerGas,
    maxPriorityFeePerGas: maxPriorityFeePerGas,
    to: this.contract.options.address,
  },
  from.privateKey
);

    return this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  }

}