const sha256 = require('sha256');
const { v1: uuid } = require('uuid') //creates unique random string
const currentNodeUrl = process.argv[3]


// constructor function of our blockchain
function Blockchain() {
    this.chain = []; // created blocks will be stored here
    this.pendingTransactions = []; // transactions will be stored before settled in a block

    this.currentNodeUrl = currentNodeUrl;
    this.networkNodes = [];

    this.createNewBlock(100,'0000','0000');
}

Blockchain.prototype.createNewBlock = function (nonce, previousBlockHash, hash) {
    //block in our chain
    const newBlock = {
        index: this.chain.length + 1,
        timestamp: Date.now(),
        transactions: this.pendingTransactions,
        nonce: nonce, // comes from PoW, just a number, a proof that we created this block in a legitimate way by using PoW
        hash: hash,
        previousBlockHash: previousBlockHash
    };

    this.pendingTransactions = []; // clearing old transactions for the newBlock
    this.chain.push(newBlock);

    return newBlock;
}


//shows last block
Blockchain.prototype.getLastBlock = function ()  {
    return this.chain[this.chain.length-1];
}


//creates new transaction
Blockchain.prototype.createNewTransaction = function(amount, sender, recipient) {
    const newTransaction = {
        amount: amount,
        sender: sender,
        recipient: recipient,
        transactionID: uuid().split('-').join('')
    };

    return newTransaction;
}


Blockchain.prototype.addTAtoPendingTAs = function(transactionObj) {

    this.pendingTransactions.push(transactionObj);

    return this.getLastBlock['index'] + 1;

}
 

Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) {

    const dataStringVer = previousBlockHash + String(nonce) + JSON.stringify(currentBlockData) //currentBlockData it can be an object or sth.
    const hash = sha256(dataStringVer)  

    return hash;
}

//PoW
Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData) {
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);

    while( hash.substring(0,4) !== '0000' ) {
        nonce++;
        hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    }

    return nonce;
}


// comparing hashes, transactions, etc.
Blockchain.prototype.chanIsValid = function(blockchain) {
    let validChain = true
    for(var i =1; i< blockchain.length; i++) {
        const currentBlock = blockchain[i];
        const prevBlock = blockchain[i-1]
        const blockHash = this.hashBlock(prevBlock['hash'], {transactions: currentBlock['transactions'],index: currentBlock['index']}, currentBlock['nonce'])

        if(blockHash.substring(0,4) !== '0000') {validChain = false}
        if(currentBlock['previousBlockHash'] !== prevBlock['hash']) {validChain = false}
    }

    const genesisBlock = blockchain[0]
    const correctNonce = genesisBlock['nonce'] === 100;
    const correctPreviousHash = genesisBlock['previousBlockHash'] === '0000'
    const correctHash = genesisBlock['hash'] === '0000'
    const correctTransactions = genesisBlock['transactions'].length === 0

    if(!correctNonce || !correctPreviousHash || !correctHash || !correctTransactions) {validChain = false}

    return validChain;
}


//these functions are for the browser

Blockchain.prototype.getBlock = function(blockHash) {
    let correctBlock = null
    this.chain.forEach(block => {

        if(block.hash === blockHash) {correctBlock = block}
    })

    return correctBlock;
}



Blockchain.prototype.getTransaction = function(transactionID) {
    let correctTransaction = null
    let correctBlock = null
    this.chain.forEach(block => {
        block.transactions.forEach(transaction => {

            if(transaction.transactionID === transactionID) {
                correctTransaction = transaction
                correctBlock = block
            }
        })
    })
    
    return  {
        transaction: correctTransaction,
        block: correctBlock
            }
}

Blockchain.prototype.getAddressData = function(address) {
    const addressTransactions = []
    this.chain.forEach(block => {
        block.transactions.forEach(transaction => {

            if(transaction.sender === address || transaction.recipient === address) {
                addressTransactions.push(transaction)
            }
        })
    })
    
    let balance = 0
    addressTransactions.forEach(transaction => {
        if(transaction.recipient == address) {balance += transaction.amount}
        else if(transaction.sender == address) {balance -= transaction.amount}
    })

    return {
        addressTransactions: addressTransactions,
        addressBalance: balance
    }
}





module.exports = Blockchain;