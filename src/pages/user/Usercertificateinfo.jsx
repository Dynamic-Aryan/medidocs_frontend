import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { Table } from "antd";
import API_ENDPOINTS from "../../api/endpoints";
import { LoadingOutlined, CheckCircleOutlined } from "@ant-design/icons";

const Usercertificateinfo = () => {
  const [certificates, setCertificates] = useState([]);
  const [certificateCount, setCertificateCount] = useState(0);
  const [certificateUser, setCertificateUser] = useState([]);

  const getCertificates = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.userMedicalCertificateStatus, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setCertificates(res.data.data);
        setCertificateCount(res.data.data.length);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUserCertificateNo = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.userMedicalCertNoOfSubmissions, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setCertificateUser(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCertificates();
    getUserCertificateNo();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text) => <span className="font-semibold text-gray-800">{text}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text) => <span className="text-gray-600">{text}</span>,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      render: (text) => <span className="text-gray-600">{text}</span>,
    },
    {
      title: "Duration",
      dataIndex: "duration",
      render: (text) => <span className="text-gray-600">{text}</span>,
    },
    {
      title: "Reason",
      dataIndex: "reason",
      render: (text) => <span className="text-gray-600">{text}</span>,
    },
    {
      title: "Symptoms",
      dataIndex: "symptoms",
      render: (text) => <span className="text-gray-600">{text}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => {
        const isPending = text === "Pending";
        const isApproved = text === "Approved";
        return (
          <span
            className={`px-3 py-1 rounded-full font-medium text-white inline-flex items-center gap-2 ${
              isPending ? "bg-yellow-500" : isApproved ? "bg-green-500" : "bg-gray-500"
            }`}
          >
            {isPending && <LoadingOutlined />}
            {isApproved && <CheckCircleOutlined />}
            {text}
          </span>
        );
      },
    },
    {
      title: "Approved By",
      dataIndex: "signature",
      render: (text) => <span className="italic text-gray-700">Dr {text}</span>,
    },
    {
      title: "Certificate",
      dataIndex: "pdfUrl",
      render: (text, record) =>
        record.status === "Approved" ? (
          <a
            href="/certificates"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800 transition"
          >
            Download PDF
          </a>
        ) : (
          <span className="text-gray-400 italic">Not Available</span>
        ),
    },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6 bg-white shadow-xl rounded-2xl mt-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Medical Certificate Requests
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-100 p-4 rounded-xl shadow-sm text-center">
            <h2 className="text-lg font-semibold text-gray-700">
              Total Certificates Applied
            </h2>
            <p className="text-2xl font-bold text-blue-600 mt-1">{certificateCount}</p>
          </div>

          <div className="bg-gray-100 p-4 rounded-xl shadow-sm text-center">
            <h2 className="text-lg font-semibold text-gray-700">
              Your Total Submissions
            </h2>
            <p className="text-2xl font-bold text-indigo-600 mt-1">
              {certificateUser.count || 0}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={certificates}
            pagination={{ pageSize: 5 }}
            rowKey="_id"
            className="rounded-xl"
          />
        </div>
      </div>
    </Layout>
  );
};

export default Usercertificateinfo;
