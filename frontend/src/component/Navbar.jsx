import React, { useState, useEffect } from 'react'
import { useAccount } from "../AccountContext";
import { ethers } from 'ethers';
import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
import Medical from "../artifacts/contracts/Medical.sol/Medical.json";


const Navbar = () => {

    const { account, setAccount, contract, setContract } = useAccount();
    // const navigate = useNavigate();
    const [provider, setProvider] = useState(null);

    useEffect(() => {
        console.log("Current account:", account);
        console.log("Contract 2 is ", contract);
    }, [account]);

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const providerInstance = new ethers.providers.Web3Provider(window.ethereum);
                setProvider(providerInstance);

                await window.ethereum.request({ method: "eth_requestAccounts" });

                const signer = providerInstance.getSigner();
                const address = await signer.getAddress();

                setAccount(address);
                localStorage.setItem("Medicalaccount", address); // Store in localStorage

                const contractAddress = "0x6B22FA2c8861eb32fE41D33F6E924cb3dfF5B63f";
                const contractInstance = new ethers.Contract(contractAddress, Medical.abi, signer);

                setContract(contractInstance);
                console.log("contract os ",contractInstance);
                
                toast.success("Wallet connected successfully!");
            } catch (error) {
                console.error("Wallet connection error:", error);
                toast.error("Failed to connect wallet.");
            }
        } else {
            toast.error("MetaMask not installed. Please install it to connect your wallet.");
        }
    };

    const disconnectWallet = () => {
        setAccount("");
        setContract(null);
        localStorage.removeItem("Medicalaccount"); // Remove from storage
        toast.success("Wallet disconnected!");
    };

    return (
        <div>
            <nav className="fixed top-0 left-0 w-full bg-white/10 backdrop-blur-md shadow-lg py-2 px-16 flex justify-between items-center">
                <h1 className="text-2xl font-extrabold text-white">🏥 HospitalChain</h1>
                <p className=''>
                    <span className='text-2xl text-blue-400'>Account:   </span>
                    <span className='text-xl text-gray-100'>
                        {account ? account : "Not connected"}
                    </span>
                </p>
                <div>


                    {
                        account ? (
                            <button
                                className="bg-red-500 text-white px-5 py-2 rounded-xl shadow-md hover:bg-red-600 transition font-semibold"
                                onClick={disconnectWallet}
                            >
                                Disconnect Wallet
                            </button>
                        ) : (
                            <button
                                className="bg-blue-500 text-white px-5 py-2 rounded-xl shadow-md hover:bg-blue-600 transition font-semibold"
                                onClick={connectWallet}
                            >
                                Connect Wallet
                            </button>
                        )
                    }
                </div>
            </nav >
        </div >
    )
}

export default Navbar