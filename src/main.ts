import { BlockChain, Transaction } from './blockchain';

let stChain = new BlockChain();

stChain.createTransaction(new Transaction("address1", "address2", 100));
stChain.createTransaction(new Transaction("address1", "address2", 200));
stChain.createTransaction(new Transaction("address2", "address1", 50));

stChain.minePendingTransactions('address3');

console.log(`Balance of address3 is : ${stChain.getBalanceOfAddress('address3')}`);

stChain.minePendingTransactions('address3');

console.log(`Balance of address3 is : ${stChain.getBalanceOfAddress('address3')}`);

console.log(stChain.chain);
