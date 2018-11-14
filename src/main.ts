import { BlockChain, Transaction } from './blockchain';
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('690f652779081437fd6586e8be349acdfd3dcd1eba3e85d20f27eaf08686a597');
const myWalletAddress = myKey.getPublic('hex');

let stChain = new BlockChain();

const tx1 = new Transaction(myWalletAddress, 'public key goes here', 10);
tx1.signTransaction(myKey);
stChain.addTransaction(tx1);

stChain.minePendingTransactions(myWalletAddress);
console.log(`Balance of address3 is : ${stChain.getBalanceOfAddress(myWalletAddress)}`);

console.log(stChain.chain);
