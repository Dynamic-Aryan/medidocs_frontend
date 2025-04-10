import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import API_ENDPOINTS from "../../api/endpoints";
import axios from "axios";
import { Button, Descriptions, message, Modal, Table, Tooltip } from "antd";
import moment from "moment";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  AliwangwangOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  DownCircleTwoTone,
  DownloadOutlined,
  LoadingOutlined,
  ProfileOutlined,
  ProfileTwoTone,
} from "@ant-design/icons";

const Allappointments = () => {
  const [allappointments, setAllappointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  //getallappointments
  const getAllappointments = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.allAppointments, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setAllappointments(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };
  useEffect(() => {
    getAllappointments();
  }, []);

  //deleteappointments
  const handleAppointments = async (appointmentId) => {
    try {
      const res = await axios.delete(
        API_ENDPOINTS.deleteAppointmentByAdmin(appointmentId),
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (res.data.success) {
        message.success(res.data.message);
        setAllappointments((prevAppointments) =>
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

  const generatePDF = (appointment) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [105, 148], // A6 size: 105mm x 148mm
    });

    // Custom styling
    doc.setFillColor(41, 128, 185); // Blue header
    doc.rect(0, 0, 105, 20, "F"); // Fill rectangle (header)

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Appointment Confirmation", 52.5, 12, { align: "center" });

    // Reset for body
    doc.setTextColor(33, 33, 33);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    const details = [
      ["Appointment ID", appointment._id],
      ["User Name", appointment.userId?.name || "N/A"],
      ["User Email", appointment.userId?.email || "N/A"],
      [
        "Doctor Name",
        `${appointment.doctorId?.firstName} ${appointment.doctorId?.lastName}`,
      ],

      ["Date", moment(appointment.date).format("DD-MM-YYYY")],
      ["Time", moment(appointment.date).format("HH:mm")],
      ["Status", appointment.status],
    ];

    doc.autoTable({
      startY: 28,
      theme: "grid",
      head: [["Field", "Details"]],
      body: details,
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
      },
      margin: { left: 10, right: 10 },
    });

    // Footer note
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(
      "Please carry this confirmation during your visit.",
      52.5,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );

    doc.save(`Appointment-${appointment.userId?.name}.pdf`);
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
      title: "User Name",
      dataIndex: "userId",
      render: (text, record) => <span>{record.userId?.name}</span>,
    },
    {
      title: "User Email",
      dataIndex: "userId",
      render: (text, record) => <span>{record.userId?.email}</span>,
    },
    {
      title: "Doctor Name",
      dataIndex: "doctorId",
      render: (text, record) => (
        <span>{`${record.doctorId?.firstName} ${record.doctorId?.lastName}`}</span>
      ),
    },
    {
      title: "Date and Time",
      dataIndex: "date",
      render: (text, record) => (
        <span className="text-blue-500">
          {moment(record.date).format("DD-MM-YYYY HH:mm")}
        </span>
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
      render: (text, record) => (
        <div className="flex gap-2">
          {record.status?.toLowerCase().trim() === "approve" && (
            <Tooltip title="Download PDF">
              <Button
                type="primary"
                onClick={() => generatePDF(record)}
                icon={<DownloadOutlined />}
              ></Button>
            </Tooltip>
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
      <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
        <h1 className='text-2xl font-bold text-gray-800 mb-4 text-center"'>
          All Appointments
        </h1>
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={allappointments}
            pagination={{ pageSize: 6 }}
            rowKey="_id"
            className="w-full border border-gray-200 rounded-lg"
          />
        </div>
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
            <Descriptions.Item label="Doctor Name">
              {`${selectedAppointment.doctorId?.firstName || ""} ${
                selectedAppointment.doctorId?.lastName || ""
              }`}
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

export default Allappointments;
