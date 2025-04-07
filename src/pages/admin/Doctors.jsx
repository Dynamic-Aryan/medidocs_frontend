import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { message, Table } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import API_ENDPOINTS from "../../api/endpoints";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);

  // Fetch all doctors
  const getDoctors = async () => {
    try {
      const res = await axios.get(
        API_ENDPOINTS.adminGetAllDoctors,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //handleaccountstatus
  const handleAccountStatus = async (record, status) => {
    try {
      const res = await axios.post(
        API_ENDPOINTS.changeAccountStatus,
        {
          doctorId: record._id,userId:record.userId,
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        window.location.reload();
      }
    } catch (error) {
      message.error("Something went Wrong");
    }
  };

  //handledeletedoctor
  const handleDeleteDoctor = async (doctorId) => {
    try {
      const res = await axios.delete(
        API_ENDPOINTS.deleteDoctor,
        {
          data: { doctorId }, 
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        message.success("Doctor deleted successfully");
        getDoctors(); 
      }
    } catch (error) {
      message.error("Error deleting doctor");
    }
  };

  useEffect(() => {
    getDoctors();
  }, []);

  // Define AntD table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <span className="font-medium text-gray-700">
          {record.firstName} {record.lastName}
        </span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      className: "text-gray-600",
    },
    {
      title: "Specialization",
      dataIndex: "specialization",
      className: "text-gray-600 font-medium",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => (
        <span
          className={
            text === "pending"
              ? "text-yellow-500 font-semibold"
              : "text-green-600 font-semibold"
          }
        >
          {text}
        </span>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      className: "text-gray-600",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="flex space-x-2">
          {record.status === "pending" ? (
            <button
              className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all"
              onClick={() => handleAccountStatus(record, "approved")}
            >
              Approve
            </button>
          ) : (
            <button
                className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all cursor-pointer"
                onClick={() => handleAccountStatus(record, "rejected")}
              >
                Reject
              </button>
          )}
          <DeleteOutlined
            className="text-red-600 text-lg cursor-pointer hover:text-red-800 transition-all"
            onClick={() => handleDeleteDoctor(record._id)}
          />
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Doctors</h1>
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={doctors}
            className="w-full border rounded-lg shadow-sm"
            pagination={{ pageSize: 5 }}
            
          />
        </div>
      </div>
    </Layout>
  );
};

export default Doctors;
