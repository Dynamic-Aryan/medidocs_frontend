import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import axios from 'axios';
import { Table } from 'antd';
import API_ENDPOINTS from '../../api/endpoints';

const Medicalcertusers = () => {
  const [users, setUsers] = useState([]);

   // Fetch all users
   const getCertUsers = async () => {
    try {
      const res = await axios.get(
        API_ENDPOINTS.getAllUsersCert,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCertUsers();
  }, []);

  const columns =[
    {
      title: "Name",
      dataIndex: "name",
      className: "text-lg font-semibold text-gray-700",
    },
    {
      title: "Email",
      dataIndex: "email",
      className: "text-gray-600",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      className: "text-gray-600",
    },
    {
      title: "Duration",
      dataIndex: "duration",
      className: "text-gray-600",
    },
    {
      title: "Reason",
      dataIndex: "reason",
      className: "text-gray-600",
    },
    {
      title: "Symptoms",
      dataIndex: "symptoms",
      className: "text-gray-600",
    },
  ]

  return (
    <Layout>
       <div className="p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Users</h1>
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={users}
            className="w-full border rounded-lg shadow-sm"
            pagination={{ pageSize: 5 }}
          />
        </div>
      </div>
    </Layout>
  )
}

export default Medicalcertusers