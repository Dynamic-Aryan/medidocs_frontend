import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import moment from "moment";
import { Table, Button, Tooltip, Input } from "antd";
import jsPDF from "jspdf";
import "jspdf-autotable";
import API_ENDPOINTS from "../api/endpoints";
import {
  LoadingOutlined,
  CheckCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchText, setSearchText] = useState("");

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

  const filteredAppointments = appointments.filter((item) => {
    const name = item.userId?.name?.toLowerCase() || "";
    const email = item.userId?.email?.toLowerCase() || "";
    const doctor = `${item.doctorId?.firstName || ""} ${
      item.doctorId?.lastName || ""
    }`.toLowerCase();

    return (
      name.includes(searchText.toLowerCase()) ||
      email.includes(searchText.toLowerCase()) ||
      doctor.includes(searchText.toLowerCase())
    );
  });

  const generatePDF = (appointment) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [105, 148],
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

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      render: (text) => <span className="text-gray-700">{text}</span>,
    },
    {
      title: "User Name",
      dataIndex: "userId",
      render: (_, record) => (
        <span className="text-gray-800 font-medium">{record.userId?.name}</span>
      ),
    },
    {
      title: "User Email",
      dataIndex: "userId",
      render: (_, record) => (
        <span className="text-gray-600">{record.userId?.email}</span>
      ),
    },
    {
      title: "Doctor Name",
      dataIndex: "doctorId",
      render: (_, record) => (
        <span className="text-indigo-600 font-medium">
          {`${record.doctorId?.firstName} ${record.doctorId?.lastName}`}
        </span>
      ),
    },
    {
      title: "Date & Time",
      dataIndex: "date",
      render: (_, record) => (
        <span className="text-blue-500 font-semibold">
          {moment(record.date).format("DD MMM YYYY, hh:mm A")}
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
            className={`px-3 py-1 rounded-full text-white font-medium inline-flex items-center gap-2 transition-all duration-300 ${
              isPending
                ? "bg-yellow-500"
                : isApproved
                ? "bg-green-500"
                : "bg-gray-400"
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
      render: (_, record) =>
        record.status?.toLowerCase().trim() === "approve" ? (
          <Tooltip title="Download Appointment PDF">
            <Button
              type="primary"
              className="bg-blue-600 hover:bg-blue-700 transition-all duration-200"
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
      <div className="p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Appointment History
        </h1>
        <div className="flex justify-between items-center mb-4">
          <input
            placeholder="Search by name or email"
            className="border px-3 py-1 rounded-md w-1/3"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={filteredAppointments}
            pagination={{ pageSize: 6 }}
            rowKey="_id"
            className="rounded-xl"
          />
        </div>
      </div>
    </Layout>
  );
};

export default Appointments;
