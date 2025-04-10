import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import moment from "moment";
import { Table, Button, Tooltip } from "antd";
import jsPDF from "jspdf";
import "jspdf-autotable";
import API_ENDPOINTS from "../api/endpoints";
import { LoadingOutlined, CheckCircleOutlined } from "@ant-design/icons";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);

  const getAppointments = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.userAppointments, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

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
      render: (text, record) =>
        record.status?.toLowerCase().trim() === "approve" ? (
          <Tooltip title="Download PDF">
            <Button
              type="primary"
              className="bg-blue-600 hover:bg-blue-700 transition"
              onClick={() => generatePDF(record)}
            >
              Download PDF
            </Button>
          </Tooltip>
        ) : (
          <span className="text-gray-400 italic">Not available</span>
        ),
    },
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Appointments
        </h1>
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={appointments}
            pagination={{ pageSize: 5 }}
            rowKey="_id"
            className="w-full border border-gray-200 rounded-lg"
          />
        </div>
      </div>
    </Layout>
  );
};

export default Appointments;
