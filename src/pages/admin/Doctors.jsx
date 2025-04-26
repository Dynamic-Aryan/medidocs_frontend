import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import {
  Button,
  Descriptions,
  message,
  Modal,
  Table,
  Tooltip,
  Input,
  Select,
  Typography,
} from "antd";
import {
  AliwangwangOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  LoadingOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import API_ENDPOINTS from "../../api/endpoints";

const { Title } = Typography;
const { Option } = Select;

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
      render: (_, record) => (
        <span className="font-medium text-gray-700">
          {record.firstName} {record.lastName}
        </span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Specialization",
      dataIndex: "specialization",
    },
    {
      title: "Valid Signature",
      dataIndex: "signatureUrl",
      render: (url) =>
        url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            View Signature
          </a>
        ) : (
          <span className="text-gray-400 italic">N/A</span>
        ),
    },
    {
      title: "Authorized Degree",
      dataIndex: "degreeUrl",
      render: (url) =>
        url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 underline hover:text-green-800"
          >
            View Degree
          </a>
        ) : (
          <span className="text-gray-400 italic">N/A</span>
        ),
    },
    
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => {
        const status = text?.toLowerCase().trim();
        const isPending = status === "pending";
        const isApproved = status === "approved";

        return (
          <span
            className={`px-3 py-1 rounded-full text-white font-semibold inline-flex items-center gap-2 ${
              isPending
                ? "bg-yellow-500"
                : isApproved
                ? "bg-green-500"
                : "bg-red-500"
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
    },
    {
      title: "Actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Tooltip title="View Profile">
            <Button
              icon={<AliwangwangOutlined />}
              onClick={() => showProfileModal(record)}
            />
          </Tooltip>
          {record.status === "pending" ? (
            <Button
              type="primary"
              className="bg-green-600"
              onClick={() => handleAccountStatus(record, "approved")}
            >
              Approve
            </Button>
          ) : (
            <Button
              danger
              onClick={() => handleAccountStatus(record, "rejected")}
            >
              Reject
            </Button>
          )}
          <Tooltip title="Delete Doctor">
            <DeleteOutlined
              className="text-red-600 text-lg cursor-pointer hover:text-red-800"
              onClick={() => handleDeleteDoctor(record._id)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <Title level={3} className="mb-0">
            Manage Doctors
          </Title>
          <div className="flex gap-2 flex-wrap">
            <Input
              placeholder="Search by name"
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 220 }}
            />
            <Select
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
              style={{ width: 180 }}
              placeholder="Filter by status"
            >
              <Option value="">All Statuses</Option>
              <Option value="pending">Pending</Option>
              <Option value="approved">Approved</Option>
              <Option value="rejected">Rejected</Option>
            </Select>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filteredDoctors}
          rowKey="_id"
          pagination={{ pageSize: 6 }}
        />
      </div>

      <Modal
        title="Doctor Profile"
        open={isModalVisible}
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
            <Descriptions.Item label="Email">
              {selectedDoctor.email || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              {selectedDoctor.phone || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Address">
              {selectedDoctor.address || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Website">
              {selectedDoctor.website || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Specialization">
              {selectedDoctor.specialization || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Experience">
              {selectedDoctor.experience
                ? `${selectedDoctor.experience} years`
                : "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Fees">
              {selectedDoctor.feesPerConsultation
                ? `${selectedDoctor.feesPerConsultation} ₹`
                : "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Timings">
              {Array.isArray(selectedDoctor.timings)
                ? selectedDoctor.timings.join(" - ")
                : selectedDoctor.timings || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Signature">
              {selectedDoctor.signatureUrl ? (
                <a
                  href={selectedDoctor.signatureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Signature
                </a>
              ) : (
                "N/A"
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Degree">
              {selectedDoctor.degreeUrl ? (
                <a
                  href={selectedDoctor.degreeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Degree
                </a>
              ) : (
                "N/A"
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {selectedDoctor.status || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {selectedDoctor.createdAt
                ? new Date(selectedDoctor.createdAt).toLocaleString()
                : "N/A"}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </Layout>
  );
};

export default Doctors;
