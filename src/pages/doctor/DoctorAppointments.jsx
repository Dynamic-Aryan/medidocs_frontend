import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Button, message, Table } from "antd";
import moment from "moment";
import axios from "axios";
import { DeleteOutlined } from "@ant-design/icons";
import API_ENDPOINTS from "../../api/endpoints";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  const getAppointments = async () => {
    try {
      const res = await axios.get(
        API_ENDPOINTS.doctorAppointments,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
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

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
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
      render: (text, record) => (
        <span
          className={`px-3 py-1 rounded-full text-white ${
            record.status === "pending"
              ? "bg-yellow-500"
              : record.status === "approved"
              ? "bg-green-500"
              : "bg-red-500"
          }`}
        >
          {record.status}
        </span>
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="flex text-white">
          {record.status === "pending" && (
            <>
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
            </>
          )}
          <Button
            className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition cursor-pointer"
            onClick={() => handleAppointments(record._id)}
            type="dashed"
            icon={<DeleteOutlined />}
          >
          
          </Button>
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
    </Layout>
  );
};

export default DoctorAppointments;
