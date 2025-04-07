import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import DoctorData from "../Data/DoctorData";
import API_ENDPOINTS from "../api/endpoints";

const Doctorhub = () => {
  const [doctors, setDoctors] = useState([]);

  const getDoctorsData = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.getAllDoctors, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching doctor data:", error);
    }
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6 ">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Available Doctors</h1>
        {doctors.length === 0 ? (
          <p className="text-gray-600 text-center">No doctors available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {doctors.map((doctor) => (
              <DoctorData key={doctor._id} doctor={doctor} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Doctorhub;
