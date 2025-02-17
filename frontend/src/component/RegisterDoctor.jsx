import React, { useState } from 'react'
import { useAccount } from "../AccountContext";
import toast from 'react-hot-toast';

const RegisterDoctor = () => {
    const { account, contract } = useAccount()

    const [name, setName] = useState("")
    const [specialization, setSpecialization] = useState("")

    const handleRegister = async (e) => {
        e.preventDefault()

        if (!contract) {
            toast.error("Smart contract not loaded.")
            return;
        }

        if (!name || !specialization) {
            toast.error("Please fill all fields")
            return;
        }

        const managerAddress = await contract.manager();

        if (managerAddress.toLowerCase() === account.toLowerCase()) {
            toast.error("You are the manager, Manager cannot register as Doctor")
        } else {
            try {

                const tx = await contract.registerDoctor(name, specialization)
                await tx.wait()

                toast.success("Doctor registered successfully!");
                setName("");
                setSpecialization("");

            } catch (error) {
                console.error("Registration failed:", error.reason);
                toast.error(`${error.reason}`);
            }

        }


    }



    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-3xl font-bold text-center text-blue-400 mb-6">
                    Register Doctor
                </h2>
                <form onSubmit={handleRegister}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-400 focus:outline-none"

                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Specialization</label>
                        <input
                            type="text"
                            value={specialization}
                            onChange={(e) => setSpecialization(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-400 focus:outline-none"

                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold transition"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    )
}

export default RegisterDoctor