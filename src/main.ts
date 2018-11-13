import * as SHA256 from 'crypto-js/sha256';

class Block {
  public index: number;
  public timestamp: string;
  public data: any;
  public previousHash: string;
  public hash: string;
  public nonce: number;

  constructor(
    index: number,
    timestamp: string,
    data: any,
    previousHash: string = '',
    nonce: number = 0
  ) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  public calculateHash = (): string => {
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
  }

  public mineBlock = (difficulty: number) => {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
      this.nonce++;
      this.hash = this.calculateHash();
      console.log(this.hash);
      
    }
    console.log(`block mined : ${this.hash}, nonce : ${this.nonce}`);
    
  }
}

class BlockChain{
  public chain: Array<Block>;
  public diffculty: number;

  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.diffculty = 2;
  }

  private createGenesisBlock = (): Block => {
    return new Block(0, "13/11/2018", "Genesis block", "0");
  }

  public getLatestBlock = (): Block => {
    return this.chain[this.chain.length - 1];
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

let stChain = new BlockChain();
console.log(`Mining block 1...`);
stChain.addBlock(new Block(1, "14/11/2018", { ammount: 4 }));
console.log(`Mining block 2...`);
stChain.addBlock(new Block(2, "15/11/2018", { ammount: 10 }));

//console.log(stChain.chain);
