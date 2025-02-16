import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAccount } from "../AccountContext";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import Medical from "../artifacts/contracts/Medical.sol/Medical.json";

const contractAddress = "0x6B22FA2c8861eb32fE41D33F6E924cb3dfF5B63f";

const LandingPage = () => {
    const { account, setAccount, contract, setContract } = useAccount();
    const navigate = useNavigate();
    const [provider, setProvider] = useState(null);

    useEffect(() => {
        const loadContract = async () => {
            if (window.ethereum && account) {
                try {
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const signer = provider.getSigner();

                    // Reinitialize contract instance
                    const deployedContract = new ethers.Contract(
                        contractAddress,
                        Medical.abi,
                        signer
                    );

                    setProvider(provider);
                    setContract(deployedContract);

                    // Store contract address in localStorage for persistence
                    localStorage.setItem("contractAddress", contractAddress);
                } catch (error) {
                    console.error("Error loading contract:", error);
                }
            }
        };

        loadContract();
    }, [account]); // Reload contract when the account is available


    const toAdmin = async () => {
        try {
            if (!contract) {
                toast.error("Smart contract not loaded.");
                return;
            }
            const managerAddress = await contract.manager();

            if (managerAddress.toLowerCase() === account.toLowerCase()) {
                toast.success("Welcome to admin Panel");
                navigate("/admin");
            } else {
                toast.error("Access denied. You are not the admin.");
            }
        } catch (error) {
            console.error("Error checking admin:", error);
            toast.error("Failed to verify admin. Please try again.");
        }
    };

    const toDoctor = async () => {
        try {
            if (!contract) {
                toast.error("Smart contract not loaded.");
                return;
            }

            const doctor = await contract.doctors(account)
            console.log("Doctor  hniubh", doctor)
            console.log("Doctor is", doctor.name)

            if (doctor.name == "") {
                toast.error("You are not a registered doctor");
            } else {
                toast.success(`Welcome Dr. ${doctor.name}`);
                navigate("/doctor");
            }
        } catch (error) {
            console.error("Error checking doctor:", error);
            toast.error("Failed to verify doctor. Please try again.");
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <section className="flex flex-col items-center justify-center h-screen text-center px-6">
                <h2 className="text-5xl font-extrabold drop-shadow-lg">
                    Secure & Smart <span className="text-blue-400">Hospital Management</span>
                </h2>
                <p className="mt-4 text-lg text-gray-300 max-w-2xl">
                    Manage patient records, verify doctors, and ensure secure healthcare with blockchain technology.
                </p>
                {!account ? (
                    <h2 className="text-4xl font-extrabold text-gray-300">Please connect your wallet</h2>
                ) : (
                    <>
                        <div className="mt-6 flex space-x-4">
                            <button
                                className="bg-green-500 px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition text-white font-semibold cursor-pointer"
                                onClick={toAdmin}
                            >
                                Login as Admin
                            </button>
                            <button
                                className="bg-yellow-500 px-6 py-3 rounded-lg shadow-md hover:bg-yellow-600 transition text-white font-semibold"
                                onClick={toDoctor}
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
