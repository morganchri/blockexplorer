/* global BigInt */

import { Alchemy, Network } from 'alchemy-sdk';
import React, { useEffect, useState } from 'react';

import './App.css';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};


// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState("");
  const [block, setBlock] = useState("");
  const [receipts, setReceipts] = useState("");
  const [clicked, setClicked] = useState(false);
  const [transaction, setTransaction] = useState("");

  async function getBlockNumber() {
    const blockNumber = await alchemy.core.getBlockNumber();
    if (blockNumber !== "") {
      setBlockNumber(blockNumber);
    }
  }

  useEffect(() => {
    getBlockNumber();
  }, []);

  const getBlock = async () => {
    const block = await alchemy.core.getBlockWithTransactions(blockNumber)
    if (block !== "") {
      setBlock(block);
    }
  }

  const getReceipts = async () => {
    if (block !== "") {
      const receipt = await alchemy.core.getTransactionReceipt(transaction.hash);
      setReceipts(receipt);
    }
  }

  useEffect(()=>{
    getBlock();
    
  }, []);

  const seeTransactions = () => {
    setClicked(true);
    let txns = document.getElementById('transactions');
    txns.style.display = "inline";
  }

  const seeReceipts = (transaction) => {
    let rcpts = document.getElementById('receipts');
    rcpts.style.display = "inline";
    if (transaction !== "") {
      setTransaction(transaction);
    }
    
  }

  useEffect(() => {
    getReceipts();
  }, [transaction])

  if (block !== "") {
    console.log(block)
    return (
      <div className="App">
        <h1>
          Block
        </h1>
        <a onClick={seeTransactions}>
          <h2>{block.number}</h2>
        </a>
        <div id="transactions" style={{display:"none"}}>
          <div>
            {clicked && block.transactions.map((transaction) => (
              <div key={transaction.hash} onClick={() => seeReceipts(transaction)}>
                {<h3>{transaction.hash}</h3>}
                <div id="receipts" style={{display:"none"}}>
                  {receipts !== "" && <h4>to: {receipts.to}</h4>}
                  {receipts !== "" && <h4>Effective Gas Price: {parseInt(receipts.effectiveGasPrice)}</h4>}
                </div>
              </div>
            ))}
          </div>
        </div>
        
      </div>
      ); 
  } else {
    return (
      <div>
        Loading...
      </div>
    )
  }
}



export default App;
