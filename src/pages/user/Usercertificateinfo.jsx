import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { Table } from "antd";
import API_ENDPOINTS from "../../api/endpoints";

const Usercertificateinfo = () => {
  const [certificates, setCertificates] = useState([]);
  const [certificateCount, setCertificateCount] = useState(0);
  const [certificateUser, setCertificateUser] = useState([]);

  const getCertificates = async () => {
    try {
      const res = await axios.get(
        API_ENDPOINTS.userMedicalCertificateStatus,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setCertificates(res.data.data);
        setCertificateCount(res.data.data.length); // Set the count dynamically
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCertificates();
  }, []);

  const getUserCertificateNo = async () => {
    try {
      const res = await axios.get(
        API_ENDPOINTS.userMedicalCertNoOfSubmissions,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setCertificateUser(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserCertificateNo();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      className: "text-lg font-semibold text-gray-700",
    },
    {
      title: "Email",
      dataIndex: "email",
      className: "text-gray-600",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      className: "text-gray-600",
    },
    {
      title: "Duration",
      dataIndex: "duration",
      className: "text-gray-600",
    },
    {
      title: "Reason",
      dataIndex: "reason",
      className: "text-gray-600",
    },
    {
      title: "Symptoms",
      dataIndex: "symptoms",
      className: "text-gray-600",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => (
        <span
          className={`px-3 py-1 rounded-full text-white ${
            text === "Pending" ? "bg-yellow-500" : "bg-green-500"
          }`}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Certificate",
      dataIndex: "pdfUrl",
      render: (text, record) =>
        record.status === "Approved" ? (
          <a
            href={'/certificates'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            Download PDF
          </a>
        ) : (
          <span className="text-gray-500">Not Available</span>
        ),
    },
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Medical Certificate Requests
        </h1>

        {/* Certificate Count */}
        <div className="mb-4 p-4 bg-gray-100 rounded-lg shadow-sm text-center">
          <h2 className="text-lg font-semibold text-gray-700">
            Total Certificates Applied: {certificateCount}
          </h2>
        </div>
        {/* User's Certificate Submission Count */}
        <div className="mb-4 p-4 bg-gray-100 rounded-lg shadow-sm text-center">
          <h2 className="text-lg font-semibold text-gray-700">
            Your Total Submissions: {certificateUser.count || 0}
          </h2>
        </div>

        {/* Certificate Table */}
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={certificates}
            pagination={{ pageSize: 5 }}
            className="w-full border border-gray-200 rounded-lg"
          />
        </div>
      </div>
    </Layout>
  );
};

export default Usercertificateinfo;
