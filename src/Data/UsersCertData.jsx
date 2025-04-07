import React from 'react';
import { useNavigate } from 'react-router-dom';

const UsersCertData = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow-md hover:shadow-xl rounded-xl p-5 transition-transform transform  cursor-pointer border border-l-8 border-teal-600 mb-6">
      <div className="bg-teal-500 text-white text-lg font-semibold py-3 px-4 rounded-t-xl text-center"
      onClick={()=> navigate(`/user/leavestatus/${user._id}`)}
      >
        {user.name}
      </div>

      {/* Body Content */}
      <div className="p-5 space-y-3 text-gray-700">
        <p className="text-md">
          <b className="text-teal-600">Age:</b> {user.age}
        </p>
        <p className="text-md">
          <b className="text-teal-600">Gender:</b> {user.gender}
        </p>
        <p className="text-md">
          <b className="text-teal-600">Address:</b> {user.address}
        </p>
        <p className="text-md">
          <b className="text-teal-600">Employer:</b> {user.employer}
        </p>
        <p className="text-md">
          <b className="text-teal-600">Email:</b> {user.email}
        </p>
        <p className="text-md">
          <b className="text-teal-600">Reason:</b> {user.reason}
        </p>
        <p className="text-md">
          <b className="text-teal-600">Symptoms:</b> {user.symptoms}
        </p>
        <p className="text-md">
          <b className="text-teal-600">Duration of Illness:</b> {user.durationOfIllness}
        </p>
        <p className="text-md">
          <b className="text-teal-600">Medical History:</b> {user.medicalHistory}
        </p>
        <p className="text-md">
          <b className="text-teal-600">Medications:</b> {user.medications}
        </p>
        <p className="text-md">
          <b className="text-teal-600">Emergency Treatment:</b> {user.emergencyTreatment}
        </p>
        <p className="text-md">
          <b className="text-teal-600">Previous Surgeries:</b> {user.previousSurgeries}
        </p>
        <p className="text-md">
          <b className="text-teal-600">Family History:</b> {user.familyHistory}
        </p>
        <p className="text-md">
          <b className="text-teal-600">Environmental Cause:</b> {user.environmentalCause}
        </p>
        <p className="text-md">
          <b className="text-teal-600">Severity:</b> {user.severity}
        </p>
        <p className="text-md">
          <b className="text-teal-600">Consultation Status:</b> {user.consultationStatus}
        </p>
        <p className="text-md">
          <b className="text-teal-600">Certificate Purpose:</b> {user.certificatePurpose}
        </p>
        <p className="text-md">
          <b className="text-teal-600">Status:</b> {user.status}
        </p>

        {/* Apply Link */}
        {/* <button
          onClick={() => navigate(`/user/certificatestatus/${user._id}`)}
          className="mt-4 bg-cyan-500 text-white py-2 px-4 rounded-md hover:bg-cyan-600 transition duration-300 cursor-pointer"
        >
          View Certificate Status
        </button> */}
      </div>
    </div>
  );
};

export default UsersCertData;
