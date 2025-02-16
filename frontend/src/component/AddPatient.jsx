import React, { useState, useEffect } from "react";
import { useAccount } from "../AccountContext";
import toast from "react-hot-toast";

const AddPatient = () => {

    const { contract,account } = useAccount();
    const [formData, setFormData] = useState({
        name: "",
        age: "",
        gender: "0", // Default: Male (Enum values in Solidity start from 0)
        bloodType: "",
        treatment: "",
        assignedDoctor: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!contract) {
            toast.error("Smart contract not connected!");
            return;
        }

        try {
            const { name, age, gender, bloodType, treatment, assignedDoctor } = formData;
            const tx = await contract.addPatient(name, Number(age), gender, bloodType, treatment, assignedDoctor, { from: account });
            await tx.wait(); // Wait for transaction confirmation

            toast.success("Patient added successfully!");
            setFormData({ name: "", age: "", gender: "0", bloodType: "", treatment: "", assignedDoctor: "" }); // Reset form
        } catch (error) {
            console.error("Error adding patient:", error);
            toast.error("Failed to add patient.");
        }
    };


    return (
        <form onSubmit={handleSubmit} className="flex flex-col px-4 py-4 bg-gray-800 shadow-md rounded-2xl space-y-4 gap-y-4 lg:min-w-2xl">
            <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required className="w-full p-2 border rounded" />

            <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required className="w-full p-2 border rounded" />

            <select name="gender" value={formData.gender} onChange={handleChange} required className="w-full p-2 border rounded bg-gray-700">
                <option value="0">Male</option>
                <option value="1">Female</option>
                <option value="2">Other</option>
            </select>

            <input type="text" name="bloodType" placeholder="Blood Type" value={formData.bloodType} onChange={handleChange} required className="w-full p-2 border rounded" />

            <input type="text" name="treatment" placeholder="Treatment" value={formData.treatment} onChange={handleChange} required className="w-full p-2 border rounded" />

            <input type="text" name="assignedDoctor" placeholder="Doctor's Address" value={formData.assignedDoctor} onChange={handleChange} required className="w-full p-2 border rounded" />

            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                Add Patient
            </button>
        </form>
    )
}

export default AddPatient