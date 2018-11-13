import * as SHA256 from 'crypto-js/sha256';

class Block {
  public index: number;
  public timestamp: string;
  public data: any;
  public previousHash: string;
  public hash: string;

  constructor(
    index: number,
    timestamp: string,
    data: any,
    previousHash: string = ''
  ) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  public calculateHash = (): string => {
    return SHA256(this.index + this.previousHash + this.timestamp, JSON.stringify(this.data)).toString();
  }
}

class BlockChain{
  public chain: Array<Block>;

  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  private createGenesisBlock = (): Block => {
    return new Block(0, "13/11/2018", "Genesis block", "0");
  }

  public getLatestBlock = (): Block => {
    return this.chain[this.chain.length - 1];
  }

  public addBlock = (newBlock: Block): void => {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }
}

let stChain = new BlockChain();
stChain.addBlock(new Block(1, "14/11/2018", { ammount: 4 }));
stChain.addBlock(new Block(2, "15/11/2018", { ammount: 10 }));

console.log(JSON.stringify(stChain, null, 4));