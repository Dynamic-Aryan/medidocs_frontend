import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import {
  Table,
  Button,
  message,
  Popconfirm,
  Tooltip,
  Tag,
  Input,
  Typography,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import API_ENDPOINTS from "../../api/endpoints";

const { Title } = Typography;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchText, setSearchText] = useState("");

  const getUsers = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.adminGetAllUsers, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setUsers(res.data.data);
        setFilteredUsers(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Failed to load users.");
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter((user) => {
      const nameMatch = user.name
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const emailMatch = user.email
        .toLowerCase()
        .includes(searchText.toLowerCase());
      return nameMatch || emailMatch;
    });
    setFilteredUsers(filtered);
  }, [searchText, users]);

  const deleteUser = async (userId) => {
    try {
      const res = await axios.delete(API_ENDPOINTS.deleteUser(userId), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        message.success("User deleted successfully");
        getUsers();
      } else {
        message.error(res.data.message || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      message.error("Error deleting user");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => (
        <span className="font-semibold text-gray-800">{text}</span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
      render: (text) => <span className="text-gray-600">{text}</span>,
    },
    {
      title: "Doctor",
      dataIndex: "isDoctor",
      render: (isDoctor) =>
        isDoctor ? <Tag color="green">Yes</Tag> : <Tag color="red">No</Tag>,
    },
    {
      title: "Admin",
      dataIndex: "isAdmin",
      render: (isAdmin) =>
        isAdmin ? <Tag color="blue">Yes</Tag> : <Tag color="default">No</Tag>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) =>
        !record.isAdmin && (
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => deleteUser(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete user">
              <Button type="primary" danger>
                Delete
              </Button>
            </Tooltip>
          </Popconfirm>
        ),
    },
  ];

  return (
    <Layout>
      <div className="p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <Title level={3} className="mb-0">
            Users
          </Title>
          <div className="flex gap-2 flex-wrap">
            <Input
              placeholder="Search by name or email"
              prefix={<SearchOutlined />}
              style={{ width: 220 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="_id"
          pagination={{ pageSize: 6 }}
          
        />
      </div>
    </Layout>
  );
};

export default Users;
