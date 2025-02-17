import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAccount } from "../AccountContext";
import ActivePatients from "./ActivePatients";
import AddPatient from "./AddPatient";

const Admin = () => {
    const { contract } = useAccount();
    const [patients, setPatients] = useState([]);
    const [patientName, setPatientName] = useState("");
    const [patientAge, setPatientAge] = useState("");
    const [activeTab, setActiveTab] = useState("addPatient");
    const [doctorAddress, setDoctorAddress] = useState("")


    useEffect(() => {
        const fetchPatients = async () => {
            if (!contract) return;
            try {
                const patientList = await contract.getActivePatients();
                // console.log("Patients arte", patientList);
                setPatients(patientList);


            } catch (error) {
                console.error("Error fetching patients:", error);
            }
        };
        fetchPatients();
    }, [contract]);

    const approveDoctor = async (doctorAddress) => {
        if (!contract) {
            toast.error("Smart contract not loaded.");
            return;
        }
        try {
            const doctorDetails = await contract.doctors(doctorAddress)

            if (doctorDetails.name != "") {
                toast.success(`Doctor is registerd ${doctorDetails.name}`)

                if(doctorDetails.verified == true){
                    toast.error(`Doctor is already verified`)
                }else{
                    const tx= await contract.approveDoctor(doctorAddress)
                    await tx.wait()
                    toast.success("Doctor approved successfully!");
                }
            } else {
                toast.error("Doctor is not registered")
            }
        } catch (error) {
            console.error("Failed to approve doctor:", error);
            toast.error("Failed to approve doctor");
        }
    };

    // const addPatient = async (e) => {
    //     e.preventDefault();
    //     if (!contract) {
    //         toast.error("Smart contract not loaded.");
    //         return;
    //     }
    //     if (!patientName || !patientAge) {
    //         toast.error("Please fill all fields.");
    //         return;
    //     }
    //     try {
    //         const tx = await contract.addPatient(patientName, patientAge);
    //         await tx.wait();
    //         toast.success("Patient added successfully!");
    //         setPatientName("");
    //         setPatientAge("");
    //     } catch (error) {
    //         console.error("Failed to add patient:", error);
    //         toast.error("Failed to add patient.");
    //     }
    // };

    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-white px-8 py-16 items-center">
            <h1 className="text-4xl font-bold text-center text-blue-400 mb-8">Admin Panel</h1>

            <div className="flex justify-center mb-8">
                {[
                    { id: "addPatient", label: "Add Patient" },
                    { id: "viewPatients", label: "View All Patients" },
                    { id: "approveDoctor", label: "Approve Doctor" }

                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-2 mx-4 rounded-lg transition ${activeTab === tab.id ? "bg-blue-500" : "bg-gray-700 hover:bg-gray-600"}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === "approveDoctor" && (
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg lg:min-w-2xl">
                    <h2 className="text-2xl font-semibold mb-4">Approve Doctor</h2>
                    <div className="flex flex-col gap-y-4">
                        <input
                            className=" border border-gray-300 p-4 rounded-xl"
                            placeholder="Enter doctor's address"
                            type="text"
                            name="doctorAddress"
                            value={doctorAddress}
                            onChange={(e) => setDoctorAddress(e.target.value)}
                        />
                        <button
                            className="bg-blue-500 rounded-2xl py-2 text-xl"
                            onClick={() => approveDoctor(doctorAddress)}>
                            Approve
                        </button>
                    </div>
                </div>
            )}

            {activeTab === "addPatient" && (
                <AddPatient />
            )}

            {activeTab === "viewPatients" && (
                <ActivePatients />
            )}
        </div>
    );
};

export default Admin;
