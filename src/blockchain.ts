import * as SHA256 from 'crypto-js/sha256';

class Transaction{
  public fromAddress: string;
  public toAddress: string;
  public amount: number;

  constructor(fromAddress: string, toAddress: string, amount: number){
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
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
    let block = new Block(Date.now().toString(), this.pendingTransactions);
    this.addBlock(block);

    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward)
    ];
  }

  public createTransaction = (transaction: Transaction) => {
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
