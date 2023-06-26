import { ethers } from "ethers";
import {useEffect, useState} from "react";
import {ABI} from "./ContractABI";

function App() {
  const address = "0x4fFF9dc35E704145B4AFC95783A76FD8617eb779"

  const [contract, setContract] = useState()

  useEffect(() => {
    if(!window.ethereum) return;

    window.ethereum.enable().then(() => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        setContract(new ethers.Contract(address, ABI, provider.getSigner()))
      });
  }, [])

  useEffect(() => {
    if(!contract) return;

    eventHandler()

  }, [contract])

  const eventHandler = () => {
    contract.on('TransactionNotification', (data, wasDeleted) => {
      console.log(data);
      console.log(wasDeleted);
    })
  }

  const getNumber = async () => {
    if(!contract) return;

    const num = await contract.number();
    console.log(num);
  }

  const getEvents = async () => {
    if(!contract) return;

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const filter = contract.filters.TransactionNotification(window.ethereum.selectedAddress);

    const result = await contract.queryFilter(filter);
    console.log(result)
  }

  const sendTransaction = async () => {
    if(!contract) return;

    let overrides = {
      value: ethers.utils.parseEther('0.001')
    }

    await contract.sendTransaction('0xaB854be0A4d499B6FD8D0bB5F796Ab5b33cE825b', overrides)
  }

  const clearHistory = async () => {
    if(!contract) return;

    await contract.clearHistory()
  }

  return (
    <div className="App">
      <button onClick={getNumber}>getNumber</button>
      <button onClick={sendTransaction}>sendTransaction</button>
      <button onClick={clearHistory}>clearHistory</button>
      <button onClick={getEvents}>getEvents</button>
    </div>
  );
}

export default App;
