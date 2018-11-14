import * as SHA256 from 'crypto-js/sha256';
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Transaction{
  public fromAddress: string;
  public toAddress: string;
  public amount: number;
  public signature: any;

  constructor(fromAddress: string, toAddress: string, amount: number){
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
  public calculateHash = (): string => {
    return SHA256(this.fromAddress + this.toAddress + this. amount).toString();
  }

  public signTransaction = (signingKey): void => {
    if(signingKey.getPublic('hex') !== this.fromAddress){
      throw new Error('You cannot sign transacitons for other wallets');
    }

    const hashTx = this.calculateHash();
    const sig = signingKey.sign(hashTx, 'base64');
    this.signature = sig.toDER('hex');
  }

  public isValid = () => {
    if(this.fromAddress === null) return true;

    if(!this.signature || this.signature.length === 0) {
      throw new Error('No signature in this transaction');
    }

    const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
    return publicKey.verify(this.calculateHash(), this.signature);
  }
}

class Block {
  public timestamp: string;
  public transactions: Array<Transaction>;
  public previousHash: string;
  public hash: string;
  public nonce: number;

  constructor(
    timestamp: string,
    transactions: Array<Transaction>,
    previousHash: string = ''
  ) {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0; // nonce 초기화
  }

  public calculateHash = (): string => {
    return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
  }

  public mineBlock = (difficulty: number): void => {
    // 조건에 맞는 nonce 값을 찿으면 블록 생성 가능
    // 지금의 조건은 hash값이 difficulty 만큼의 0을 포함하고 있을 때 블록 생성
    // 얼마든지 다른 조건으로 변경가능
    // difficult가 4일 경우 nonce가 약 60000, 5일 경우 nonce가 기하 급수적으로 증가
    // 시간에 따라 difficult를 변화함으로써 블록 생성 속도 조정 가능
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
      this.nonce++;
      this.hash = this.calculateHash();
      
    }
    console.log(`block mined : ${this.hash}, nonce : ${this.nonce}`);
    
  }
  public hasValidTransactions = (): boolean => {
    for(const tx of this.transactions){
      if(!tx.isValid()){
        return false;
      }
    }
    return true;
  }
}

class BlockChain{
  public chain: Array<Block>;
  public diffculty: number;
  public pendingTransactions: Array<Transaction>;
  public miningReward: number;

  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.diffculty = 2;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  private createGenesisBlock = (): Block => {
    return new Block("13/11/2018", [], "0");
  }

  public getLatestBlock = (): Block => {
    return this.chain[this.chain.length - 1];
  }

  public minePendingTransactions = (miningRewardAddress: string): void => {
    const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
    this.pendingTransactions.push(rewardTx);
    
    let block = new Block(Date.now().toString(), this.pendingTransactions);
    this.addBlock(block);

    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward)
    ];
  }

  public addTransaction = (transaction: Transaction) => {
    if(!transaction.fromAddress || !transaction.toAddress) {
      throw new Error("Transaction must include from and to address");
    }

    if(!transaction.isValid()){
      throw new Error('Cannot add invalid transaction to chain');
    }

    this.pendingTransactions.push(transaction);
  }

  public getBalanceOfAddress = (address: string) => {
    let balance = 0;

    for(const block of this.chain){
      for(const trans of block.transactions){
        if(trans.fromAddress === address){
          balance -= trans.amount;
        }
        if(trans.toAddress === address){
          balance += trans.amount;
        }
      }
    }

    return balance;
  }

  public addBlock = (newBlock: Block): void => {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.diffculty);
    this.chain.push(newBlock);
  }

  public isChainValid = (): boolean => {
    for(let i = 1; i < this.chain.length; i++){
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if(!currentBlock.hasValidTransactions()){
        return false;
      }
      if(currentBlock.hash !== currentBlock.calculateHash()){
        return false;
      }
      if(currentBlock.previousHash !== previousBlock.hash){
        return false;
      }
    }
    return true;
  }
}

export { BlockChain, Transaction };
