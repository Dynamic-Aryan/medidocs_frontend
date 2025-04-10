import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Button, Descriptions, message, Modal, Table, Tooltip } from "antd";
import moment from "moment";
import axios from "axios";
import { AliwangwangOutlined, CheckCircleOutlined, DeleteOutlined, LoadingOutlined } from "@ant-design/icons";
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

  //deleteappointments
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
        setAppointments((prevAppointments) =>
          prevAppointments.filter(
            (appointment) => appointment._id !== appointmentId
          )
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

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
    },
    {
      title: "Patient Name",
      dataIndex: "userId",
      render: (text, record) => <span>{record.userId.name}</span>,
    },
    {
      title: "Patient Email",
      dataIndex: "userId",
      render: (text, record) => <span>{record.userId.email}</span>,
    },
    {
      title: "Date & Time",
      dataIndex: "date",
      render: (text, record) => (
        <span>{moment(record.date).format("DD-MM-YYYY HH:mm")}</span>
      ),
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
              isPending ? "bg-yellow-500" : "bg-green-500"
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
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="flex text-white">
          {record.status === "pending" && (
            <div className="flex gap-0.5">
              <button
                className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition cursor-pointer"
                onClick={() => handleStatus(record, "approve")}
              >
                Approve
              </button>
              <button
                className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition cursor-pointer"
                onClick={() => handleStatus(record, "rejected")}
              >
                Reject
              </button>
            </div>
          )}
          <Tooltip title="View Profile">
            <Button
              type="default"
              onClick={() => showProfileModal(record)}
              className="border-gray-500"
              icon={<AliwangwangOutlined />}
            ></Button>
          </Tooltip>
             <Button
                      className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition cursor-pointer"
                      onClick={() => handleAppointments(record._id)}
                      type="dashed"
                      icon={<DeleteOutlined />}
                    ></Button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-semibold mb-4 text-center">
          Doctor Appointments
        </h1>
        <Table
          columns={columns}
          dataSource={appointments}
          rowKey="_id"
          className="shadow-lg"
        />
      </div>
      <Modal
        visible={isModalVisible}
        title="Profile Details"
        footer={null}
        onCancel={handleCloseModal}
      >
        {selectedAppointment && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="User Name">
              {selectedAppointment.userId?.name || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="User Email">
              {selectedAppointment.userId?.email || "N/A"}
            </Descriptions.Item>

            <Descriptions.Item label="Appointment Date">
              {moment(selectedAppointment.date).format("DD-MM-YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Time">
              {moment(selectedAppointment.date).format("HH:mm")}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {selectedAppointment.status}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </Layout>
  );
};

export default DoctorAppointments;
