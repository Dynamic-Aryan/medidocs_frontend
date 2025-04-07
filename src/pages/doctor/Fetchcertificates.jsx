import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { Button, Table } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import API_ENDPOINTS from "../../api/endpoints";

const Fetchcertificates = () => {
  const [certificates, setCertificates] = useState([]);

  //fetchallcertificates
  const fetchCertificates = async () => {
    try {
      const res = await axios.get(
        API_ENDPOINTS.getAllUsersCert,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setCertificates(res.data.data);
    } catch (error) {
      console.error("Error fetching certificates", error);
    }
  };
  useEffect(() => {
    fetchCertificates();
  }, []);

  //approvecertificates
  const handleApprove = async (certificateId) => {
    try {
      await axios.put(
        API_ENDPOINTS.approveRejectCertificate,
        { certificateId, status: "Approved" },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setCertificates(
        certificates.map((cert) =>
          cert._id === certificateId ? { ...cert, status: "Approved" } : cert
        )
      );
    } catch (error) {
      console.error("Error approving certificate", error);
    }
  };

  //rejectcertificates
  const handleReject = async (certificateId) => {
    try {
      await axios.put(
        API_ENDPOINTS.approveRejectCertificate,
        { certificateId, status: "Rejected" },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setCertificates(
        certificates.map((cert) =>
          cert._id === certificateId ? { ...cert, status: "Rejected" } : cert
        )
      );
    } catch (error) {
      console.error("Error rejecting certificate", error);
    }
  };

  //deletecertificates
  const handleDelete = async (certificateId) => {
    try {
      await axios.delete(
        API_ENDPOINTS.deleteCertificate(certificateId),
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setCertificates(
        certificates.filter((cert) => cert._id !== certificateId)
      );
    } catch (error) {
      console.error("Error deleting certificate", error);
    }
  };

  const columns = [
    { title: "User", dataIndex: "name", key: "name" },
    { title: "Reason", dataIndex: "reason", key: "reason" },
    { title: "Duration", dataIndex: "duration", key: "duration" },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Button
            onClick={() => handleApprove(record._id)}
            disabled={record.status !== "Pending"}
          >
            Approve
          </Button>
          <Button
            onClick={() => handleReject(record._id)}
            disabled={record.status !== "Pending"}
          >
            Reject
          </Button>
          <Button
            onClick={() => handleDelete(record._id)}
            type="dashes"
            icon={<DeleteOutlined />}
          />
        </>
      ),
    },
  ];
  return (
    <Layout>
      <div>
        <Table columns={columns} dataSource={certificates} rowKey="_id" />
      </div>
    </Layout>
  );
};

export default Fetchcertificates;
