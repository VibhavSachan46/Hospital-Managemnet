import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useAccount } from "../AccountContext";
import { MdDeleteForever } from "react-icons/md";
import toast from "react-hot-toast";


const contractAddress = "0x6B22FA2c8861eb32fE41D33F6E924cb3dfF5B63f";

const ActivePatients = ({ provider }) => {
    const [patients, setPatients] = useState([]);
    const [inactivePatinets, setInactivePatinets] = useState([]);
    const { contract } = useAccount();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatients = async () => {
            setLoading(true);
            try {
                const patientIds = await contract.getActivePatients();
                // console.log("Patient id ", patientIds);

                const inactivePatientIds = await contract.getInactivePatients();
                // console.log("inactivePatient id ", inactivePatientIds);

                const patientDetails = [];


                for (let id of patientIds) {
                    const patient = await contract.patients(id);
                    patientDetails.push({
                        id: id.toNumber(),
                        name: patient.name,
                        age: patient.age,
                        gender: ["Male", "Female", "Other"][patient.gender], // Convert enum to string
                        bloodType: patient.bloodType,
                        treatment: patient.treatment,
                        doctor: patient.assignedDoctor,
                        createdAt: new Date(patient.createdAt * 1000).toLocaleString(), // Convert timestamp
                        isActive: patient.isActive,
                    });
                }

                setPatients(patientDetails);

                const inactivePatientDetails = [];

                for (let id of inactivePatientIds) {
                    const inactivePatient = await contract.patients(id);
                    inactivePatientDetails.push({
                        id: id.toNumber(),
                        name: inactivePatient.name,
                        age: inactivePatient.age,
                        gender: ["Male", "Female", "Other"][inactivePatient.gender], // Convert enum to string
                        bloodType: inactivePatient.bloodType,
                        treatment: inactivePatient.treatment,
                        doctor: inactivePatient.assignedDoctor,
                        createdAt: new Date(inactivePatient.createdAt * 1000).toLocaleString(), // Convert timestamp
                        isActive: inactivePatient.isActive,
                    });
                }

                setInactivePatinets(inactivePatientDetails);
            } catch (error) {
                console.error("Error fetching patients:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, [provider]);

    const deletePatient = async (id) => {
        if (!contract) {
            toast.error("Contract not loaded");
            return;
        }

        try {
            const response = await contract.deletePatient(id)
            await response.wait();
            toast.success(`Patient ${id} deleted successfully`);

            setPatients((prevPatients) => prevPatients.filter((patient) => patient.id !== id));

        } catch (error) {
            console.error("Error deleting patient:", error);
            toast.error("Failed to delete patient");
        }
    }

    return (
        <div className="container mx-auto p-6">
            {loading ? (
                <p className="text-center text-lg font-bold">Loading patients...</p>
            ) : (
                <div>
                    <h2 className="text-2xl font-bold mb-4 text-center">Active Patients</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-600 rounded-4xl">
                            <thead className="bg-gray-800 ">
                                <tr className="text-left ">
                                    <th className="border border-gray-600 px-4 py-2">ID</th>
                                    <th className="border border-gray-600 px-4 py-2">Name</th>
                                    <th className="border border-gray-600 px-4 py-2">Age</th>
                                    <th className="border border-gray-600 px-4 py-2">Gender</th>
                                    <th className="border border-gray-600 px-4 py-2">Blood Type</th>
                                    <th className="border border-gray-600 px-4 py-2">Treatment</th>
                                    <th className="border border-gray-600 px-4 py-2">Doctor</th>
                                    <th className="border border-gray-600 px-4 py-2">Created At</th>
                                    <th className="border border-gray-600 px-4 py-2">Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patients.length > 0 ? (
                                    patients.map((patient) => (
                                        <tr key={patient.id} className="hover:bg-gray-700">
                                            <td className="border border-gray-600 px-4 py-2">{patient.id}</td>
                                            <td className="border border-gray-600 px-4 py-2">{patient.name}</td>
                                            <td className="border border-gray-600 px-4 py-2">{patient.age}</td>
                                            <td className="border border-gray-600 px-4 py-2">{patient.gender}</td>
                                            <td className="border border-gray-600 px-4 py-2">{patient.bloodType}</td>
                                            <td className="border border-gray-600 px-4 py-2">{patient.treatment}</td>
                                            <td className="border border-gray-600 px-4 py-2">
                                                {patient.doctor.substring(0, 6)}...{patient.doctor.slice(-4)}
                                            </td>
                                            <td className="border border-gray-600 px-4 py-2">{patient.createdAt}</td>
                                            <td className="border border-gray-600 px-4 py-2 items-center justify-center">
                                                <button className="bg-red-500 text-white px-5 py-2 rounded-xl shadow-md hover:bg-red-600 transition cursor-pointer"
                                                    onClick={() => deletePatient(patient.id)}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center border border-gray-600 px-4 py-2">
                                            No active patients found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <h2 className="text-2xl font-bold mt-8 mb-4 text-center">Inactive Patients</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-600 rounded-4xl">
                            <thead className="bg-gray-800 ">
                                <tr className="text-left ">
                                    <th className="border border-gray-600 px-4 py-2">ID</th>
                                    <th className="border border-gray-600 px-4 py-2">Name</th>
                                    <th className="border border-gray-600 px-4 py-2">Age</th>
                                    <th className="border border-gray-600 px-4 py-2">Gender</th>
                                    <th className="border border-gray-600 px-4 py-2">Blood Type</th>
                                    <th className="border border-gray-600 px-4 py-2">Treatment</th>
                                    <th className="border border-gray-600 px-4 py-2">Doctor</th>
                                    <th className="border border-gray-600 px-4 py-2">Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inactivePatinets.length > 0 ? (
                                    inactivePatinets.map((inactivePatinet) => (
                                        <tr key={inactivePatinets.id} className="hover:bg-gray-700">
                                            <td className="border border-gray-600 px-4 py-2">{inactivePatinet.id}</td>
                                            <td className="border border-gray-600 px-4 py-2">{inactivePatinet.name}</td>
                                            <td className="border border-gray-600 px-4 py-2">{inactivePatinet.age}</td>
                                            <td className="border border-gray-600 px-4 py-2">{inactivePatinet.gender}</td>
                                            <td className="border border-gray-600 px-4 py-2">{inactivePatinet.bloodType}</td>
                                            <td className="border border-gray-600 px-4 py-2">{inactivePatinet.treatment}</td>
                                            <td className="border border-gray-600 px-4 py-2">
                                                {inactivePatinet.doctor.substring(0, 6)}...{inactivePatinet.doctor.slice(-4)}
                                            </td>
                                            <td className="border border-gray-600 px-4 py-2">{inactivePatinet.createdAt}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center border border-gray-600 px-4 py-2">
                                            No in-active patients found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div >
            )}
        </div >
    );
};

export default ActivePatients;