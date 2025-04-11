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
  Typography,
  Input,
} from "antd";
import moment from "moment";
import axios from "axios";
import {
  AliwangwangOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  LoadingOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import API_ENDPOINTS from "../../api/endpoints";

const { Title } = Typography;

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredAppointments = appointments.filter((appointment) =>
    appointment.userId?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


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
     <div className="p-4">
     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
     <Title level={3} className="mb-0">
            Doctor Appointments
          </Title>
          <div className="flex gap-2 flex-wrap">
            <Input
              placeholder="Search by user name..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 220 }}
            />
          </div>
      </div>
     </div>
     <Table
          columns={columns}
          dataSource={filteredAppointments}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
          
        />

      <Modal
        open={isModalVisible}
        title="Patient Details"
        footer={null}
        onCancel={handleCloseModal}
        width={800}
      >
        {selectedAppointment && (
          <Descriptions bordered column={1} size="small" labelStyle={{ fontWeight: "bold", width: "30%" }} >
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
