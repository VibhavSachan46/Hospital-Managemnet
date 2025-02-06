// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract Medical {
    address public manager;
    uint256 public patientCount;
    uint256 public doctorCount;

    enum Gender {
        Male,
        Female,
        Other
    }

    struct Patient {
        uint256 id;
        string name;
        uint8 age;
        Gender gender;
        string bloodType;
        string treatment;
        address assignedDoctor;
        uint256 createdAt;
        bool isActive;
    }

    struct Doctor {
        uint256 id;
        string name;
        string specialization;
        address doctorAddress;
        bool verified;
    }

    mapping(uint256 => Patient) public patients;
    mapping(address => Doctor) public doctors;
    mapping(address => bool) public isVerifiedDoctor;
    mapping(address => uint256[]) private doctorPatients;

    uint256[] private activePatients;  // Stores only active patient IDs
    uint256[] private  inactivePatients; // Stores only inactive patient IDs
    // uint256[] public allPatients;

    modifier onlyManager() {
        require(msg.sender == manager, "Only manager can perform this action");
        _;
    }

    modifier onlyVerifiedDoctor() {
        require(isVerifiedDoctor[msg.sender], "Only verified doctors can access");
        _;
    }

    constructor() {
        manager = msg.sender;
    }

    function registerDoctor(string memory _name, string memory _specialization) external {
        require(doctors[msg.sender].doctorAddress == address(0), "Doctor already registered");

        doctorCount++;
        doctors[msg.sender] = Doctor(doctorCount, _name, _specialization, msg.sender, false);
    }

    function approveDoctor(address _doctorAddress) external onlyManager {
        require(doctors[_doctorAddress].doctorAddress != address(0), "Doctor not registered");
        isVerifiedDoctor[_doctorAddress] = true;
        doctors[_doctorAddress].verified = true;
    }

    function addPatient(
        string memory _name,
        uint8 _age,
        Gender _gender,
        string memory _bloodType,
        string memory _treatment,
        address _assignedDoctor
    ) external onlyManager {
        require(isVerifiedDoctor[_assignedDoctor], "Doctor must be verified first");

        patientCount++;
        patients[patientCount] = Patient(
            patientCount,
            _name,
            _age,
            _gender,
            _bloodType,
            _treatment,
            _assignedDoctor,
            block.timestamp,
            true
        );

        doctorPatients[_assignedDoctor].push(patientCount);
        activePatients.push(patientCount); // Store active patient IDs
    }

    function updateTreatment(uint256 _patientId, string memory _newTreatment) external onlyVerifiedDoctor {
        require(patients[_patientId].assignedDoctor == msg.sender, "Not assigned to this patient");
        require(patients[_patientId].isActive, "Patient record is not active");
        patients[_patientId].treatment = _newTreatment;
    }

    function deletePatient(uint256 _patientId) external onlyManager {
        require(patients[_patientId].isActive, "Patient already deleted");

        patients[_patientId].isActive = false; // Mark patient as inactive
        inactivePatients.push(_patientId); // Move to inactive list

        // Remove from activePatients list (Gas efficient)
        uint256 length = activePatients.length;
        for (uint256 i = 0; i < length; i++) {
            if (activePatients[i] == _patientId) {
                activePatients[i] = activePatients[length - 1];
                activePatients.pop();
                break;
            }
        }
    }

    function getPatientsByDoctor() external view onlyVerifiedDoctor returns (uint256[] memory) {
        return doctorPatients[msg.sender];
    }

    function getActivePatients() external view onlyManager returns (uint256[] memory) {
        return activePatients;
    }

    function getInactivePatients() external view onlyManager returns (uint256[] memory) {
        return inactivePatients;
    }
}
