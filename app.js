let Block = require('./block');
let Blockchain = require('./blockchain');
let Transaction = require('./transaction');
let BlockchainNode = require('./BlockchainNode');
let SomeSmartContract = require('smartContracts');

let fetch = require('node-fetch');

const express = require('express');
const app = express();
let port = 3000;
//Access the arguments
process.argv.forEach((val, index, array) => {
    port = array[2];
});

if (port == undefined) {
    port = 3000;
}

let transactions = [];
let nodes = [];
let genesisBlock = new Block();
let blockchain = new Blockchain(genesisBlock);

app.use(express.json());

app.post('/resolve', (req, res) => {
    nodes.forEach((node)=>{
        fetch(node.url + '/blockchain').then((response)=>{
            return response.json();
        })
    }).then((otherNodeBlockchain)=>{
        if(blockchain.blocks.length<otherNodeBlockchain.blocks.length){
            blockchain = otherNodeBlockchain;
        }
    });
});

app.post('/nodes/register', (req, res) => {
    let nodesLists = req.body.urls;
    nodesLists.forEach((nodeDictionary) => {
        let node = new BlockchainNode(nodeDictionary["url"]);
        nodes.push(node);
    });
    res.json(nodes);
});

app.get('/nodes', (req, res) => {
    res.json(nodes);
});

app.get('/', (req, res) => {
    res.send('Hello world');
});

app.post('/mine', (req, res) => {
    let block = blockchain.getNextBlock(transactions);
    blockchain.addBlock(block);
    transactions = [];
    res.json(block);
});

app.post('/transactions', (req, res) => {

    // Instance of smart contract here
    let smartContract = new SomeSmartContract();

    let to = req.body.to;
    let from = req.body.from;
    let amount = req.body.amount;

    let transaction = new Transaction(from, to, amount);

    // Apply here the smart contract
    smartContract.apply(transaction,blockchain.blocks);

    transactions.push(transaction);

    res.json(transactions);
});

app.get('/blockchain', (req, res) => {
    res.json(blockchain);
});

app.listen(port, () => {
    console.log('Server started!');
});