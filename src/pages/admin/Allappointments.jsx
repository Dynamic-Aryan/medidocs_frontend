import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import API_ENDPOINTS from "../../api/endpoints";
import axios from "axios";
import {
  Button,
  Descriptions,
  Input,
  message,
  Modal,
  Table,
  Tooltip,
  Typography,
  Select
} from "antd";
import moment from "moment";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  AliwangwangOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  DownloadOutlined,
  LoadingOutlined,
  SearchOutlined,
} from "@ant-design/icons";


const { Title } = Typography;


const Allappointments = () => {
  const [allappointments, setAllappointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Get all appointments
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

  // Delete appointment
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
        setAllappointments((prev) =>
          prev.filter((appointment) => appointment._id !== appointmentId)
        );
      }
    } catch (error) {
      console.error("Error deleting appointment", error);
      message.error("Failed to delete appointment");
    }
  };

  // Generate PDF
  const generatePDF = (appointment) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [105, 148], // A6
    });

    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, 105, 20, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Appointment Confirmation", 52.5, 12, { align: "center" });

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

  const filteredAppointments = allappointments.filter((appointment) =>
    appointment.userId?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              />
            </Tooltip>
          )}
          <Tooltip title="View Profile">
            <Button
              type="default"
              onClick={() => showProfileModal(record)}
              icon={<AliwangwangOutlined />}
            />
          </Tooltip>
          <Button
            onClick={() => handleAppointments(record._id)}
            type="dashed"
            icon={<DeleteOutlined />}
            danger
          />
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <Title level={3} className="mb-0">
            All Appointments
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

        <Table
          columns={columns}
          dataSource={filteredAppointments}
          pagination={{ pageSize: 6 }}
          rowKey="_id"
        />
      </div>
      <Modal
        open={isModalVisible}
        title="Profile Details"
        footer={null}
        onCancel={handleCloseModal}
        width={800}
      >
        {selectedAppointment && (
          <Descriptions
            bordered
            column={1}
            size="small"
            labelStyle={{ fontWeight: "bold", width: "30%" }}
          >
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
