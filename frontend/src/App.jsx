import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AccountProvider } from './AccountContext'
import { useAccount } from "./AccountContext";
import LandingPage from './component/LandingPage'
import Doctor from './component/Doctor'
import Navbar from './component/Navbar';
import Admin from './component/Admin';
import { ethers } from 'ethers';
import Medical from "./artifacts/contracts/Medical.sol/Medical.json"
import RegisterDoctor from './component/RegisterDoctor';

function App() {

  const { account, setAccount, contract, setContract } = useAccount();

  useEffect(() => {
    const storedAddress = localStorage.getItem("contractAddress");
    if (window.ethereum && storedAddress && account) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const deployedContract = new ethers.Contract(storedAddress, Medical.abi, signer);
      setContract(deployedContract);
    }
  }, [account]);

  return (
    <div className='bg-gray-900'>
      <Navbar />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route
            path="/doctor"
            element={account ? <Doctor /> : <Navigate to="/" />}
          />
          <Route
            path="/admin"
            element={account ? <Admin /> : <Navigate to="/" />}
          />

          <Route
            path="/register-doctor"
            element={account ? <RegisterDoctor /> : <Navigate to="/" />}
          />
        </Routes>
      </Router>
    </div>
  )
}

export default App
