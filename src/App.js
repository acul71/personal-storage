import './App.css';
import {ethers} from 'ethers';
import axios from 'axios';
import lighthouse from 'lighthouse-web3';
import { lighthouseAbi } from 'lighthouse-web3/Lighthouse/contractAbi/lighthouseAbi';
import React, {useRef, useState, useEffect}  from 'react'

function App() {
  const uploadInfo = React.createRef()


  const sign_message = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const res = await axios.get(`https://api.lighthouse.storage/api/lighthouse/get_message?publicKey=${address}`);
    const message = res.data;
    const signed_message = await signer.signMessage(message);
    return({
      message: message,
      signed_message: signed_message,
      address: await signer.getAddress()
    });
  }

  const execute_transaction = async (cid, fileName, fileSize, cost, network) =>{
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract_address = lighthouse.getContractAddress(network);

    const signer = provider.getSigner();
    const contract = new ethers.Contract(contract_address, lighthouseAbi, signer);
    const txResponse = await contract.store(cid, "", fileName, fileSize, {
      value: ethers.utils.parseEther(cost),
    });
    return(txResponse);
  }

  const uploadFile = async (e) => {
    e.persist();

    let network = "fantom-testnet";
    if(window.ethereum.networkVersion === "137") {
      network = "polygon";
    } else if(window.ethereum.networkVersion === "250") {
      network = "fantom";
    } else if(window.ethereum.networkVersion === "56") {
      network = "binance";
    } else if(window.ethereum.networkVersion === "10") {
      network = "optimism";
    } else if(window.ethereum.networkVersion === "4002") {
      network = "fantom-testnet";
    } else if(window.ethereum.networkVersion === "80001") {
      network = "polygon-testnet";
    } else if(window.ethereum.networkVersion === "97") {
      network = "binance-testnet";
    } else if(window.ethereum.networkVersion === "69") {
      network = "optimism-testnet";
    } else{
      network = null;
    }
    
    if(network){

      uploadInfo.current.textContent += '--------------\n'
      uploadInfo.current.textContent += 'Signing...\n'
      const signing_response = await sign_message();

      uploadInfo.current.textContent += 'File: ' + e.target.files[0].name + '\n'

      const cost = (await lighthouse.getQuote(e.target.files[0].size, network)).totalCost.toFixed(18).toString();
      console.log('cost=', cost)
      uploadInfo.current.textContent += 'upload cost= ' + cost + '\n'
      uploadInfo.current.textContent += 'file size= ' + e.target.files[0].size + '\n'

      // Last parameter is file/folder. true if file is uploaded, false in case of folder
      const deploy_response = await lighthouse.deploy(e, signing_response.address, signing_response.signed_message, true);
      // If directory use below lines to get cid of root for transaction
      // deploy_response = deploy_response.split("\n");
      // deploy_response = JSON.parse(deploy_response[deploy_response.length - 2])
      console.log('deploy_response=', deploy_response);
      uploadInfo.current.textContent += 'File deployed\n'
      uploadInfo.current.textContent += 'URL: https://gateway.lighthouse.storage/ipfs/' + deploy_response.Hash + '\n'

      const transaction = await execute_transaction(deploy_response.Hash, deploy_response.Name, deploy_response.Size, cost, network);
      console.log('transaction=', transaction);

      const add_cid_response = await lighthouse.addCid(deploy_response.Name, deploy_response.Hash);
      console.log('add_cid_response=', add_cid_response);
      uploadInfo.current.textContent += 'Pinned!'
      
    } else{
      console.log("Please connect to a supported network");
    }
  }
  
  
  return (
    <div className="App">
        <h1>Personal Storage</h1>
        <h3>
          Upload your file
        </h3>
        <input onChange={e=>uploadFile(e)} type="file" />
        <h4>Info:</h4>
        <textarea rows='15' cols='60' ref={uploadInfo}></textarea>
        <footer>Made with React - lighthouse.storage</footer>
    </div>
  );
}


export default App;
