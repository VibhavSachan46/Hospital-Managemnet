import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAccount } from "../AccountContext";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import Medical from "../artifacts/contracts/Medical.sol/Medical.json";

const LandingPage = () => {
    const { account, setAccount, contract, setContract } = useAccount();
    const navigate = useNavigate();
    const [provider, setProvider] = useState(null);

    useEffect(() => {
        console.log("Current account:", account);
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
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 w-full bg-white/10 backdrop-blur-md shadow-lg py-4 px-8 flex justify-between items-center">
                <h1 className="text-2xl font-extrabold text-white">🏥 HospitalChain</h1>
                <div>
                    <button
                        className="bg-blue-500 text-white px-5 py-2 rounded-xl shadow-md hover:bg-blue-600 transition font-semibold"
                        onClick={account ? disconnectWallet : connectWallet}
                    >
                        {account ? "Disconnect Wallet" : "Connect Wallet"}
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center h-screen text-center px-6">
                {!account ? (
                    <h2 className="text-4xl font-extrabold text-gray-300">Please connect your wallet</h2>
                ) : (
                    <>
                        <h2 className="text-5xl font-extrabold drop-shadow-lg">
                            Secure & Smart <span className="text-blue-400">Hospital Management</span>
                        </h2>
                        <p className="mt-4 text-lg text-gray-300 max-w-2xl">
                            Manage patient records, verify doctors, and ensure secure healthcare with blockchain technology.
                        </p>

                        <p className="mt-4">
                            <span className="font-bold text-xl"> Connected Account :</span> <span className="text-blue-400 text-xl">{account}</span>
                        </p>
                        <div className="mt-6 flex space-x-4">
                            <button
                                className="bg-green-500 px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition text-white font-semibold"
                                onClick={() => navigate("/admin")}
                            >
                                Login as Admin
                            </button>
                            <button
                                className="bg-yellow-500 px-6 py-3 rounded-lg shadow-md hover:bg-yellow-600 transition text-white font-semibold"
                                onClick={() => navigate("/doctor")}
                            >
                                Login as Doctor
                            </button>
                            <button
                                className="bg-purple-500 px-6 py-3 rounded-lg shadow-md hover:bg-purple-600 transition text-white font-semibold"
                                onClick={() => navigate("/register-doctor")}
                            >
                                Register as Doctor
                            </button>
                        </div>
                    </>
                )}
            </section>

            {/* Footer */}
            <footer className="text-center py-6 bg-gray-950 text-gray-400">
                <p>&copy; 2024 HospitalChain. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
