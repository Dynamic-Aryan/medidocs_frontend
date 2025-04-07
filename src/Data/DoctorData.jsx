import React from "react";
import { useNavigate } from "react-router-dom";

const DoctorData = ({ doctor }) => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white shadow-md hover:shadow-xl rounded-xl p-5 transition-transform transform  cursor-pointer border border-l-8 border-teal-600 mb-6 w-full"
      onClick={() => navigate(`/doctor/book-appointment/${doctor._id}`)}
    >
      {/* Header Section */}
      <div className="bg-teal-500 text-white text-lg font-semibold py-3 px-4 rounded-t-xl text-center">
        Dr. {doctor.firstName} {doctor.lastName}
      </div>

      {/* Body Content */}
      <div className="p-5 space-y-3 text-gray-700">
        <p className="text-md">
          <b className="text-teal-600">Specialization:</b> {doctor.specialization}
        </p>
        <p className="text-md">
          <b className="text-teal-600">Experience:</b> {doctor.experience} years
        </p>
        <p className="text-md">
          <b className="text-teal-600">Fees Per Consultation:</b> ${doctor.feesPerConsultation}
        </p>
        <p className="text-md">
          <b className="text-teal-600">Timings:</b> {doctor.timings[0]} - {doctor.timings[1]}
        </p>
        <p className="text-md">
          <b className="text-teal-600">Phone:</b> {doctor.phone}
        </p>
        <p className="text-md">
          <b className="text-teal-600">Email:</b> {doctor.email}
        </p>

        {/* Apply Link */}
       
      </div>
    </div>
  );
};

export default DoctorData;
