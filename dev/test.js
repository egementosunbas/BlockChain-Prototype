const Blockchain = require('./blockchain');
const bitcoin = new Blockchain();

const bc1 ={
    "chain": [
    {
    "index": 1,
    "timestamp": 1644578788357,
    "transactions": [],
    "nonce": 100,
    "hash": "0000",
    "previousBlockHash": "0000"
    },
    {
    "index": 2,
    "timestamp": 1644578831564,
    "transactions": [],
    "nonce": 36813,
    "hash": "0000f835f87019159f9d1deac7359937fc1475fa5dc7f6b336a6b16a175e074b",
    "previousBlockHash": "0000"
    },
    {
    "index": 3,
    "timestamp": 1644578882468,
    "transactions": [
    {
    "amount": 12.5,
    "sender": "00",
    "recipient": "745b43508b2d11ec851773ad6c8e036a",
    "transactionID": "8e239ad08b2d11ec851773ad6c8e036a"
    },
    {
    "amount": 4,
    "sender": "tuna",
    "recipient": "turancan",
    "transactionID": "a47e69e08b2d11ec851773ad6c8e036a"
    },
    {
    "amount": 30,
    "sender": "tuna",
    "recipient": "turancan",
    "transactionID": "a714a5208b2d11ec851773ad6c8e036a"
    },
    {
    "amount": 53,
    "sender": "tuna",
    "recipient": "turancan",
    "transactionID": "a9ab2e808b2d11ec851773ad6c8e036a"
    }
    ],
    "nonce": 43492,
    "hash": "00000a39a837f57ce792fdc4c46f61db3a2ddcb78f8f1ed98a81ecb30b55e1a3",
    "previousBlockHash": "0000f835f87019159f9d1deac7359937fc1475fa5dc7f6b336a6b16a175e074b"
    },
    {
    "index": 4,
    "timestamp": 1644578924155,
    "transactions": [
    {
    "amount": 12.5,
    "sender": "00",
    "recipient": "745b43508b2d11ec851773ad6c8e036a",
    "transactionID": "ac73c4608b2d11ec851773ad6c8e036a"
    },
    {
    "amount": 40,
    "sender": "tuna",
    "recipient": "turancan",
    "transactionID": "bcae6e208b2d11ec851773ad6c8e036a"
    },
    {
    "amount": 50,
    "sender": "tuna",
    "recipient": "turancan",
    "transactionID": "be6964908b2d11ec851773ad6c8e036a"
    },
    {
    "amount": 60,
    "sender": "tuna",
    "recipient": "turancan",
    "transactionID": "c0914da08b2d11ec851773ad6c8e036a"
    },
    {
    "amount": 70,
    "sender": "tuna",
    "recipient": "turancan",
    "transactionID": "c2a699108b2d11ec851773ad6c8e036a"
    }
    ],
    "nonce": 19632,
    "hash": "00005c014831466ffd12d38581b45bffac6850fec4ccfcf830335c9777ab2586",
    "previousBlockHash": "00000a39a837f57ce792fdc4c46f61db3a2ddcb78f8f1ed98a81ecb30b55e1a3"
    },
    {
    "index": 5,
    "timestamp": 1644578943658,
    "transactions": [
    {
    "amount": 12.5,
    "sender": "00",
    "recipient": "745b43508b2d11ec851773ad6c8e036a",
    "transactionID": "c54cb2d08b2d11ec851773ad6c8e036a"
    }
    ],
    "nonce": 198892,
    "hash": "0000a8e88f7d1140e9950f679337ff722a3c99b5729d62c62776074ed2a77d56",
    "previousBlockHash": "00005c014831466ffd12d38581b45bffac6850fec4ccfcf830335c9777ab2586"
    },
    {
    "index": 6,
    "timestamp": 1644578947079,
    "transactions": [
    {
    "amount": 12.5,
    "sender": "00",
    "recipient": "745b43508b2d11ec851773ad6c8e036a",
    "transactionID": "d0ec9ec08b2d11ec851773ad6c8e036a"
    }
    ],
    "nonce": 210137,
    "hash": "0000821eab9e7c0ede19e9ce47111aad13dcc268ebffabf1bf6fb976cad17943",
    "previousBlockHash": "0000a8e88f7d1140e9950f679337ff722a3c99b5729d62c62776074ed2a77d56"
    }
    ],
    "pendingTransactions": [
    {
    "amount": 12.5,
    "sender": "00",
    "recipient": "745b43508b2d11ec851773ad6c8e036a",
    "transactionID": "d2f69f908b2d11ec851773ad6c8e036a"
    }
    ],
    "currentNodeUrl": "http://localhost:3001",
    "networkNodes": []
    }


    console.log(bitcoin.chanIsValid(bc1.chain))