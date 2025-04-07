import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { useSelector } from "react-redux";
import { FaRegFileAlt, FaCalendarCheck, FaClipboardList, FaUserMd, FaNotesMedical } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import API_ENDPOINTS from "../api/endpoints";

const HomePage = () => {
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Fetch logged-in user data
  const getUserData = async () => {
    try {
      const res = await axios.post(
        API_ENDPOINTS.getUserData,
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <Layout>
      <div className="">
        <div className="">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gray-200 rounded-b-2xl flex items-center justify-center">
              <span className="text-gray-600 text-xl">👤</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
              Hello, {user?.isDoctor ? `Dr. ${user?.name}` : user?.name || "User"}!
              </h2>
            </div>
          </div>

          {user?.isDoctor ? (
            <div className="grid grid-cols-2 gap-4 text-center text-white ">
              <div className="flex flex-col items-center p-4 bg-gray-100 rounded-xl shadow">
                <FaUserMd className="text-blue-500 text-4xl mb-2" />
                <p className="text-gray-700">Review Certificates</p>
                <button className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-500rounded-lg cursor-pointer" onClick={() => navigate("/usersforcertificate")}>
                  Review
                </button>
              </div>
              <div className="flex flex-col items-center p-4 bg-gray-100 rounded-xl shadow">
                <FaNotesMedical className="text-green-500 text-4xl mb-2" />
                <p className="text-gray-700">Manage Appointments</p>
                <button className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-500  rounded-lg cursor-pointer" onClick={() => navigate("/doctor-appointments")}>
                  Manage
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 text-center text-white ">
              <div className="flex flex-col items-center p-4 bg-gray-100 rounded-xl shadow">
                <FaRegFileAlt className="text-blue-500 text-4xl mb-2" />
                <p className="text-gray-700">Request Certificate</p>
                <button className="mt-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg cursor-pointer" onClick={() => navigate("/medicalcert")}>
                  Request
                </button>
              </div>
              <div className="flex flex-col items-center p-4 bg-gray-100 rounded-xl shadow">
                <FaClipboardList className="text-indigo-500 text-4xl mb-2" />
                <p className="text-gray-700">View Certificate Status  </p>
                <button className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-400  rounded-lg cursor-pointer" onClick={() => navigate("/certificatestatus")}>
                  View
                </button>
              </div>
              <div className="flex flex-col items-center p-4 bg-gray-100 rounded-xl shadow">
                <FaCalendarCheck className="text-green-500 text-4xl mb-2" />
                <p className="text-gray-700">Book Appointment</p>
                <button className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-400 rounded-lg cursor-pointer" onClick={() => navigate("/doctorhub")}>
                  Book
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
