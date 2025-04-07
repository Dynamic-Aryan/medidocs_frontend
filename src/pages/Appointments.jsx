import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import moment from "moment";
import { Table } from "antd";
import API_ENDPOINTS from "../api/endpoints";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);

  const getAppointments = async () => {
    try {
      const res = await axios.get(
        API_ENDPOINTS.userAppointments,
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
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
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
      render: (text) => (
        <span className={`px-3 py-1 rounded-full text-white ${text === 'Pending' ? 'bg-yellow-500' : 'bg-green-500'}`}>
          {text}
        </span>
      ),
    },
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Appointments</h1>
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={appointments}
            pagination={{ pageSize: 5 }}
            className="w-full border border-gray-200 rounded-lg"
          />
        </div>
      </div>
    </Layout>
  );
};

export default Appointments;
