import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { Table, Button, message, Popconfirm } from "antd";
import API_ENDPOINTS from "../../api/endpoints";

const Users = () => {
  const [users, setUsers] = useState([]);

  // Fetch all users
  const getUsers = async () => {
    try {
      const res = await axios.get(
        API_ENDPOINTS.adminGetAllUsers,
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
    getUsers();
  }, []);

  // Handle user deletion
  const deleteUser = async (userId) => {
    try {
      const res = await axios.delete(
        API_ENDPOINTS.deleteUser(userId), 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      if (res.data.success) {
        message.success("User deleted successfully");
        getUsers(); // Refresh users list
      } else {
        message.error(res.data.message || "Failed to delete user");
      }
    } catch (error) {
      console.log("Error deleting user:", error);
      message.error("Error deleting user");
    }
  };
  

  // Define AntD table columns
  const columns = [
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
      title: "Doctor",
      dataIndex: "isDoctor",
      render: (text, record) => (
        <span className={record.isDoctor ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
          {record.isDoctor ? "Yes" : "No"}
        </span>
      ),
    },
    {
      title: "Admin",
      dataIndex: "isAdmin",
      render: (text, record) => (
        <span className={record.isAdmin ? "text-blue-600 font-medium" : "text-gray-500 font-medium"}>
          {record.isAdmin ? "Yes" : "No"}
        </span>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) =>
        !record.isAdmin && ( // Hide delete button for admins
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => deleteUser(record._id)}
            okText="Yes"
            cancelText="No"
          >
          
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        ),
    },
  ];

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
            rowKey="_id"
          />
        </div>
      </div>
    </Layout>
  );
};

export default Users;
