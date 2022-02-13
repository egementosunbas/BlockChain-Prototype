const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { v1: uuid } = require('uuid') //creates unique random string as the node adress
const port = process.argv[2]; //arg variable -> in package json there is a sentence, port number is 3. argument so, argv 0 1 '2'
const rp = require('request-promise');

const Blockchain = require('./blockchain')


const nodeAddress = uuid().split('-').join('') // creating node address

const eggChain = new Blockchain()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.get('/blockchain', function (req, res) {

    res.send(eggChain)
  
});

app.post('/transaction', function (req, res) {
   const newTransaction = req.body;
   const blockIndex = eggChain.addTAtoPendingTAs(newTransaction)
   res.json({ note: `Transaction will be added in block ${blockIndex}.`})
});


//creating a new ta and reporting it all the other nodes
app.post('/transaction/broadcast', function(req, res) {
    const newTransaction = eggChain.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient)
    eggChain.addTAtoPendingTAs(newTransaction); // add transaction to pending transactions

    const requestPromises = []
    eggChain.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/transaction',
            method: 'POST',
            body: newTransaction,
            json: true
        }
        requestPromises.push(rp(requestOptions))
    })

    Promise.all(requestPromises)
    .then(data => {
        res.json({ note: 'Transaction created and broadcast successfully.' })

    })
})

app.get('/mine', function (req, res) {
    const lastBlock = eggChain.getLastBlock()
    const previousBlockHash = lastBlock['hash']
    const currentBlockData = {
        transactions: eggChain.pendingTransactions,
        index: lastBlock['index']+1
    }

    const nonce = eggChain.proofOfWork(previousBlockHash, currentBlockData)
    const blockHash = eggChain.hashBlock(previousBlockHash, currentBlockData, nonce)

    

    //create new block
    const newBlock = eggChain.createNewBlock(nonce, previousBlockHash, blockHash)

    const requestPromises = []
    eggChain.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/receive-new-block',
            method: 'POST',
            body: { newBlock: newBlock},
            json: true
        }

        requestPromises.push(rp(requestOptions))
    })

    Promise.all(requestPromises)
    .then(data => { 
        const requestOptions = { // rewarding miner
            uri: eggChain.currentNodeUrl + '/transaction/broadcast',
            method: 'POST',
            body: {
                amount: 12.5,
                sender: "00",
                recipient: nodeAddress
            },
            json: true
        }

       return rp(requestOptions)

    })
    .then(data => {
          //notification
    res.json({
        note: `New block mined and broadcast by ${nodeAddress} successfully!`,
        block: newBlock
    })
    })
});

app.post('/receive-new-block', function(req, res) {
    const newBlock = req.body.newBlock
    const lastBlock = eggChain.getLastBlock()
    const correctHash = lastBlock.hash === newBlock.previousBlockHash; //controlling hashes
    const correctIndex = lastBlock['index'] + 1 === newBlock['index']  // controlling whether the new block is in the right index

    if(correctHash && correctIndex) {
        eggChain.chain.push(newBlock)
        eggChain.pendingTransactions = [];
        res.json( { note: 'New block received and accepted',
        newBlock: newBlock
    })
        
    } else {
        res.json({ note: 'New block rejected, it is not legitimate !!!!',
        newBlock: newBlock
    })
    }

})



// register and broadcast node (shares with the other nodes)
app.post('/register-and-broadcast-node', function(req, res) {
    const newNodeUrl = req.body.newNodeUrl
    if( eggChain.networkNodes.indexOf(newNodeUrl) == -1 ){ eggChain.networkNodes.push(newNodeUrl);}

    const registerNodesPromises = []
    eggChain.networkNodes.forEach(networkNodeUrl => {
        //'/register-node'
        const requestOptions = {
            uri: networkNodeUrl + '/register-node',
            method: 'POST',
            body: { newNodeUrl: newNodeUrl},
            json: true
        }

        registerNodesPromises.push(rp(requestOptions))
    })
        Promise.all(registerNodesPromises)
        .then(data => {
            const bulkRegisterOptions = {
                uri: newNodeUrl + '/register-nodes-bulk',
                method: 'Post',
                body: { allNetworkNodes: [...eggChain.networkNodes, eggChain.currentNodeUrl]},
                json: true
            }

           return rp(bulkRegisterOptions)
        })
        .then(data => {
            res.json({note: 'New node registered with network successfully..!'})
        })
});


//simply register a node with the network
app.post('/register-node', function(req, res) {
    const newNodeUrl = req.body.newNodeUrl;
    const nodeNotAlreadyPresent = eggChain.networkNodes.indexOf(newNodeUrl) == -1 //boolean
    const notCurrentNode = eggChain.currentNodeUrl !== newNodeUrl  //also boolean
    if(nodeNotAlreadyPresent && notCurrentNode) {eggChain.networkNodes.push(newNodeUrl)}
    res.json({note: 'New node registered successfully.'})
});


// register multiple nodes at once, hepsini birbirine tanıt
app.post('/register-nodes-bulk', function(req, res) {
    const allNetworkNodes = req.body.allNetworkNodes
    allNetworkNodes.forEach(networkNodeUrl => {

        const nodeNotAlreadyPresent = eggChain.networkNodes.indexOf(networkNodeUrl) == -1
        const notCurrentNode = eggChain.currentNodeUrl !== networkNodeUrl
       if(nodeNotAlreadyPresent && notCurrentNode) {eggChain.networkNodes.push(networkNodeUrl)} // if node already exists ,do not add it

    })

    res.json({ note:'Bulk registration successful.'})
});

app.get('/consensus', function(req, res) {
    const requestPromises = []
    eggChain.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/blockchain',
            method:'GET',
            json: true
        }
        requestPromises.push(rp(requestOptions))
    })
    Promise.all(requestPromises)
    .then(blockchains => {
        const currentChainLength = eggChain.chain.length
        let maxChainLength = currentChainLength
        let newLongestChain = null
        let newPendingTransactions = null
        blockchains.forEach(blockhain => {
            if(blockhain.chain.length > maxChainLength) {
                maxChainLength = blockhain.chain.length
                newLongestChain = blockhain.chain
                newPendingTransactions = blockhain.pendingTransactions
            }

        })

        if(!newLongestChain || (newLongestChain && !eggChain.chanIsValid(newLongestChain))) {
            res.json( {
                note: 'Current chain has not been replaced.',
                chain: eggChain.chain
            })
        } else {
            eggChain.chain = newLongestChain
            eggChain.pendingTransactions = newPendingTransactions
            res.json( {
                note: 'This chain has ben replaced..',
                chain: eggChain.chain
            })

        }

    })
})

app.get('/block/:blockHash', function(req, res) { // localhost:3001/block/0xasgdubhıanosdnıp123yb182
    const blockHash = req.params.blockHash
    const correctBlock = eggChain.getBlock(blockHash)
    res.json({ block: correctBlock })

})

app.get('/transaction/:transactionID', function(req, res) {
    const transactionID = req.params.transactionID
    const correctTransaction = eggChain.getTransaction(transactionID)
    res.json({ transaction: correctTransaction.transaction,
               block: correctTransaction.block
      })
    
})

app.get('/address/:address', function(req, res) {
    const address = req.params.address
    const addressData = eggChain.getAddressData(address)

    res.json({
        addressData: addressData
    })
    
})

app.get('/block-explorer', function(req, res) {
    res.sendFile('./block-explorer/index.html', { root: __dirname })
})









app.listen(port, function() {
    console.log(`Listening on port ${port}...`)
}) // port number  http://localhost:3000/