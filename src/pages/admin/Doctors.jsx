import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { Button, Descriptions, message, Modal, Table, Tooltip } from "antd";
import { AliwangwangOutlined, CheckCircleOutlined, DeleteOutlined, LoadingOutlined } from "@ant-design/icons";
import API_ENDPOINTS from "../../api/endpoints";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const getDoctors = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.adminGetAllDoctors, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAccountStatus = async (record, status) => {
    try {
      const res = await axios.post(
        API_ENDPOINTS.changeAccountStatus,
        {
          doctorId: record._id,
          userId: record.userId,
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
        getDoctors();
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  const handleDeleteDoctor = async (doctorId) => {
    try {
      const res = await axios.delete(API_ENDPOINTS.deleteDoctor, {
        data: { doctorId },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
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

  const showProfileModal = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setSelectedDoctor(null);
    setIsModalVisible(false);
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const fullName = `${doctor.firstName} ${doctor.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? doctor.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

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
      render: (text) => {
        const status = text?.toLowerCase().trim();
        const isPending = status === "pending";
        const isApproved = status === "approve";

        return (
          <span
            className={`px-3 py-1 rounded-full text-white font-semibold inline-flex items-center gap-2 ${
              isPending ? "bg-yellow-500" : isApproved ? "bg-green-500" : "bg-red-500"
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
      title: "Phone",
      dataIndex: "phone",
      className: "text-gray-600",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="flex gap-1">
          <Tooltip title="View Profile">
            <Button
              type="default"
              onClick={() => showProfileModal(record)}
              className="border-gray-500"
              icon={<AliwangwangOutlined />}
            ></Button>
          </Tooltip>
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
        <h1 className="text-3xl font-extrabold text-gray-800 mb-4">Doctors</h1>
        <div className="flex justify-between items-center mb-4">
          <input
            placeholder="Search by name or email"
            className="border px-3 py-1 rounded-md w-1/3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="border px-3 py-1 rounded-md"
            onChange={(e) => setStatusFilter(e.target.value)}
            value={statusFilter}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={filteredDoctors}
            className="w-full border rounded-lg shadow-sm"
            pagination={{ pageSize: 5 }}
            rowKey="_id"
          />
        </div>
      </div>

      <Modal
        title="Doctor Profile"
        visible={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={800}
      >
        {selectedDoctor && (
          <Descriptions
            bordered
            column={1}
            size="small"
            labelStyle={{ fontWeight: "bold", width: "30%" }}
          >
            <Descriptions.Item label="Full Name">
              {selectedDoctor.firstName} {selectedDoctor.lastName}
            </Descriptions.Item>
            <Descriptions.Item label="Email">{selectedDoctor.email}</Descriptions.Item>
            <Descriptions.Item label="Phone">{selectedDoctor.phone}</Descriptions.Item>
            <Descriptions.Item label="Address">{selectedDoctor.address}</Descriptions.Item>
            <Descriptions.Item label="Website">{selectedDoctor.website || "N/A"}</Descriptions.Item>
            <Descriptions.Item label="Specialization">{selectedDoctor.specialization}</Descriptions.Item>
            <Descriptions.Item label="Experience">{selectedDoctor.experience} years</Descriptions.Item>
            <Descriptions.Item label="Fees">{selectedDoctor.feesPerConsultation} ₹</Descriptions.Item>
            <Descriptions.Item label="Timings">
              {selectedDoctor.timings.join(" - ")}
            </Descriptions.Item>
            <Descriptions.Item label="Status">{selectedDoctor.status}</Descriptions.Item>
            <Descriptions.Item label="Created At">
              {new Date(selectedDoctor.createdAt).toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </Layout>
  );
};

export default Doctors;