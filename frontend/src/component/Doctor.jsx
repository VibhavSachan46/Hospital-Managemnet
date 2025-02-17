import React, { useEffect, useState } from "react";
import { useAccount } from "../AccountContext";
import toast from "react-hot-toast";

const Doctor = () => {
  const { account, contract } = useAccount();
  const [doctor, setDoctor] = useState({ name: "", specialization: "", verified: false });
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, patientId: null, newTreatment: "" });

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!contract) return toast.error("Smart contract is not loaded");
      try {
        const doctorDetails = await contract.doctors(account);
        setDoctor({
          name: doctorDetails.name,
          specialization: doctorDetails.specialization,
          verified: doctorDetails.verified,
        });
      } catch (error) {
        toast.error("Failed to fetch doctor details");
      }
    };

    const fetchPatients = async () => {
      if (!contract) return toast.error("Smart contract is not loaded");
      setLoading(true);
      try {
        const patientIds = await contract.getPatientsByDoctor();
        const patientDetails = await Promise.all(
          patientIds.map(async (id) => {
            const patient = await contract.patients(id);
            return {
              id: id.toNumber(),
              name: patient.name,
              age: patient.age,
              gender: ["Male", "Female", "Other"][patient.gender],
              bloodType: patient.bloodType,
              treatment: patient.treatment,
              isActive: patient.isActive,
            };
          })
        );
        setPatients(patientDetails);
      } catch (error) {
        toast.error("Failed to fetch patients");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
    fetchPatients();
  }, [contract, account]);

  const handleUpdateTreatment = async () => {
    if (!contract || modal.patientId === null) return;
    try {
      await contract.updateTreatment(modal.patientId, modal.newTreatment);
      toast.success("Treatment updated successfully");
      setPatients((prev) =>
        prev.map((p) => (p.id === modal.patientId ? { ...p, treatment: modal.newTreatment } : p))
      );
      setModal({ open: false, patientId: null, newTreatment: "" });
    } catch (error) {
      toast.error("Failed to update treatment");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900 text-white py-24 px-8">
      <div className="w-full max-w-5xl bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex items-center space-x-4 border-b border-gray-600 pb-4">
          <div className="w-20 h-20 bg-blue-500 text-2xl font-bold flex items-center justify-center rounded-full">
            {doctor.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col gap-y-2">
            <h2 className="text-2xl font-semibold">{doctor.name}</h2>
            <p className="text-gray-300">{doctor.specialization}</p>
            {doctor.verified ? (
              <span className="bg-green-600 text-sm px-3 py-1 rounded-full">Verified</span>
            ) : (
              <span className="bg-red-500 text-sm px-3 py-1 rounded-full">Not Verified</span>
            )}
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6">Assigned Patients</h3>
        {loading ? (
          <p className="text-center text-lg font-bold">Loading patients...</p>
        ) : patients.length > 0 ? (
          <div className="overflow-x-auto mt-4">
            <table className="w-full border border-gray-700">
              <thead className="bg-gray-700 text-white">
                <tr>
                  <th className="p-3 border border-gray-600">ID</th>
                  <th className="p-3 border border-gray-600">Name</th>
                  <th className="p-3 border border-gray-600">Age</th>
                  <th className="p-3 border border-gray-600">Treatment</th>
                  <th className="p-3 border border-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id} className="bg-gray-800 hover:bg-gray-700">
                    <td className="p-3 border border-gray-600">{patient.id}</td>
                    <td className="p-3 border border-gray-600">{patient.name}</td>
                    <td className="p-3 border border-gray-600">{patient.age}</td>
                    <td className="p-3 border border-gray-600">{patient.treatment}</td>
                    <td className="p-3 border border-gray-600">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded"
                        onClick={() => setModal({ open: true, patientId: patient.id, newTreatment: patient.treatment })}
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400 text-lg mt-4">No patients assigned yet.</p>
        )}
      </div>

      {modal.open && (
        <div className="fixed inset-0 bg-opacity-100 flex items-center justify-center">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Update Treatment</h3>
            <input
              type="text"
              className="w-full p-2 border border-gray-600 rounded mb-4 text-white"
              value={modal.newTreatment}
              onChange={(e) => setModal({ ...modal, newTreatment: e.target.value })}
            />
            <div className="flex justify-end space-x-3">
              <button className="bg-gray-500 px-4 py-2 rounded" onClick={() => setModal({ open: false, patientId: null, newTreatment: "" })}>Cancel</button>
              <button className="bg-blue-500 px-4 py-2 rounded" onClick={handleUpdateTreatment}>Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctor;
