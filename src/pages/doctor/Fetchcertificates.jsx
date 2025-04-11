import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { Button, Table, Modal, Input, message, Typography } from "antd";
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import API_ENDPOINTS from "../../api/endpoints";

const { Title } = Typography;

const Fetchcertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [filteredCertificates, setFilteredCertificates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [signatureModalVisible, setSignatureModalVisible] = useState(false);
  const [selectedCertificateId, setSelectedCertificateId] = useState(null);
  const [signatureInput, setSignatureInput] = useState("");

  const fetchCertificates = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.getAllUsersCert, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCertificates(res.data.data);
      setFilteredCertificates(res.data.data);
    } catch (error) {
      console.error("Error fetching certificates", error);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value);
    const filtered = certificates.filter((cert) =>
      cert.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCertificates(filtered);
  };

  const handleApproveWithSignature = async () => {
    try {
      if (!signatureInput) {
        message.error("Please enter a signature before approving.");
        return;
      }

      await axios.put(
        API_ENDPOINTS.approveRejectCertificate,
        {
          certificateId: selectedCertificateId,
          status: "Approved",
          signature: signatureInput,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const updated = certificates.map((cert) =>
        cert._id === selectedCertificateId
          ? { ...cert, status: "Approved", signature: signatureInput }
          : cert
      );

      setCertificates(updated);
      setFilteredCertificates(
        updated.filter((cert) =>
          cert.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );

      message.success("Certificate approved with signature!");
      setSignatureModalVisible(false);
      setSignatureInput("");
      setSelectedCertificateId(null);
    } catch (error) {
      console.error("Error approving certificate", error);
      message.error("Error approving certificate");
    }
  };

  const handleReject = async (certificateId) => {
    try {
      await axios.put(
        API_ENDPOINTS.approveRejectCertificate,
        { certificateId, status: "Rejected" },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const updated = certificates.map((cert) =>
        cert._id === certificateId ? { ...cert, status: "Rejected" } : cert
      );
      setCertificates(updated);
      setFilteredCertificates(
        updated.filter((cert) =>
          cert.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } catch (error) {
      console.error("Error rejecting certificate", error);
    }
  };

  const handleDelete = async (certificateId) => {
    try {
      await axios.delete(API_ENDPOINTS.deleteCertificate(certificateId), {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const updated = certificates.filter((cert) => cert._id !== certificateId);
      setCertificates(updated);
      setFilteredCertificates(
        updated.filter((cert) =>
          cert.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } catch (error) {
      console.error("Error deleting certificate", error);
    }
  };

  const showSignatureModal = (certificateId) => {
    setSelectedCertificateId(certificateId);
    setSignatureModalVisible(true);
  };

  const columns = [
    { title: "User", dataIndex: "name", key: "name" },
    { title: "Reason", dataIndex: "reason", key: "reason" },
    { title: "Duration", dataIndex: "duration", key: "duration" },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Signature",
      key: "signature",
      render: (_, record) => (
        <div className="space-y-1">
          <div>
            <span className="font-semibold">Typed:</span>{" "}
            {record.signature || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Digital:</span>{" "}
            {record.digitalSignature || "N/A"}
          </div>
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <button
            onClick={() => showSignatureModal(record._id)}
            disabled={record.status !== "Pending"}
            className={`px-3 py-1 rounded text-white ${
              record.status === "Pending"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Approve
          </button>
          <button
            onClick={() => handleReject(record._id)}
            disabled={record.status !== "Pending"}
            className={`px-3 py-1 rounded text-white ${
              record.status === "Pending"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Reject
          </button>
          <button
            onClick={() => handleDelete(record._id)}
            className="px-3 py-1 rounded text-red-600 border border-red-600 hover:bg-red-100"
          >
            <DeleteOutlined />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
    <div className="p-4">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
    <Title level={3} className="mb-0">
            Manage Certificates
          </Title>

        {/* 🔍 Search Input */}
        <div className="flex gap-2 flex-wrap">
          <Input
            placeholder="Search by name..."
             prefix={<SearchOutlined />}
             style={{ width: 220 }}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

       
      </div>
      
          <Table
            columns={columns}
            dataSource={filteredCertificates}
            rowKey="_id"
            pagination={{ pageSize: 6 }}
          />
       

        <Modal
          title="Add Your Signature"
          open={signatureModalVisible}
          onOk={handleApproveWithSignature}
          onCancel={() => {
            setSignatureModalVisible(false);
            setSignatureInput("");
            setSelectedCertificateId(null);
          }}
          okText="Approve"
          cancelText="Cancel"
        >
          <div className="mb-2 text-sm">
            Please enter your digital signature:
          </div>
          <Input
            placeholder="Dr. John Doe"
            value={signatureInput}
            onChange={(e) => setSignatureInput(e.target.value)}
            className="mt-1"
          />
        </Modal>
    </div>
    </Layout>
  );
};

export default Fetchcertificates;
