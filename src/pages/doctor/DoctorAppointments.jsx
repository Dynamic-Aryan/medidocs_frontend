import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import {
  Button,
  Descriptions,
  message,
  Modal,
  Table,
  Tooltip,
  Tag,
} from "antd";
import moment from "moment";
import axios from "axios";
import {
  AliwangwangOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import API_ENDPOINTS from "../../api/endpoints";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const getAppointments = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.doctorAppointments, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (error) {
      console.log(error);
      message.error("Failed to fetch appointments");
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  const handleStatus = async (record, status) => {
    try {
      const res = await axios.post(
        API_ENDPOINTS.updateAppointmentStatus,
        { appointmentsId: record._id, status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        getAppointments();
      }
    } catch (error) {
      console.log(error);
      message.error("Something went wrong");
    }
  };

  const handleAppointments = async (appointmentId) => {
    try {
      const res = await axios.delete(
        API_ENDPOINTS.deleteAppointment(appointmentId),
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (res.data.success) {
        message.success(res.data.message);
        setAppointments((prev) =>
          prev.filter((appointment) => appointment._id !== appointmentId)
        );
      }
    } catch (error) {
      console.error("Error deleting appointment", error);
      message.error("Failed to delete appointment");
    }
  };

  const showProfileModal = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedAppointment(null);
  };

  const renderStatusTag = (status) => {
    const lower = status?.toLowerCase().trim();
    if (lower === "pending") {
      return (
        <Tag color="gold" icon={<LoadingOutlined />}>
          Pending
        </Tag>
      );
    } else if (lower === "approve") {
      return (
        <Tag color="green" icon={<CheckCircleOutlined />}>
          Approved
        </Tag>
      );
    } else {
      return <Tag color="red">{status}</Tag>;
    }
  };

  const columns = [
    {
      title: "Appointment ID",
      dataIndex: "_id",
      width: 120,
      ellipsis: true,
    },
    {
      title: "Patient Name",
      dataIndex: "userId",
      render: (text, record) => <span>{record.userId?.name}</span>,
    },
    {
      title: "Email",
      dataIndex: "userId.email",
      render: (text, record) => <span>{record.userId?.email}</span>,
    },
    {
      title: "Date & Time",
      dataIndex: "date",
      render: (_, record) => (
        <span>{moment(record.date).format("DD-MM-YYYY HH:mm")}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => renderStatusTag(text),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_, record) => (
        <div className="flex flex-wrap gap-2">
          {record.status === "pending" && (
            <>
              <Button
                className="bg-green-600 text-white hover:bg-green-700"
                onClick={() => handleStatus(record, "approve")}
              >
                Approve
              </Button>
              <Button
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={() => handleStatus(record, "rejected")}
              >
                Reject
              </Button>
            </>
          )}
          <Tooltip title="View Patient Profile">
            <Button
              icon={<AliwangwangOutlined />}
              onClick={() => showProfileModal(record)}
            />
          </Tooltip>
          <Tooltip title="Delete Appointment">
            <Button
              danger
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => handleAppointments(record._id)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 bg-white shadow-xl rounded-xl mt-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Doctor Appointments
        </h1>
        <Table
          columns={columns}
          dataSource={appointments}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
          className="rounded-xl"
        />
      </div>

      <Modal
        open={isModalVisible}
        title="Patient Details"
        footer={null}
        onCancel={handleCloseModal}
      >
        {selectedAppointment && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Patient Name">
              {selectedAppointment.userId?.name || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {selectedAppointment.userId?.email || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Date">
              {moment(selectedAppointment.date).format("DD-MM-YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Time">
              {moment(selectedAppointment.date).format("HH:mm")}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {renderStatusTag(selectedAppointment.status)}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </Layout>
  );
};

export default DoctorAppointments;
