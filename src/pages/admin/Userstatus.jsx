import React, { useEffect, useState } from "react";
import {
  Table,
  Select,
  Button,
  message,
  Spin,
  Typography,
  Modal,
  Input,
} from "antd";
import axios from "axios";
import Layout from "../../components/Layout";
import API_ENDPOINTS from "../../api/endpoints";
import { SearchOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Title } = Typography;

const Userstatus = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [searchText, setSearchText] = useState("");

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setCurrentUserId(decoded.id);
      }

      const res = await axios.get(API_ENDPOINTS.adminGetAllUsers, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setUsers(res.data.data);
        setFilteredUsers(res.data.data);
      }
    } catch (error) {
      console.log(error);
      message.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (userId, newRole) => {
    setSelectedRoles((prev) => ({ ...prev, [userId]: newRole }));
  };

  const updateRole = async (user) => {
    const newRole = selectedRoles[user._id];
    if (!newRole) return;

    if (user._id === currentUserId && newRole !== "admin") {
      message.warning("❌ You can't change your own role from admin.");
      return;
    }

    const isDemotingDoctor = user.isDoctor && newRole === "user";

    if (isDemotingDoctor) {
      Modal.confirm({
        title: "Delete Doctor Data?",
        content:
          "The user was previously a doctor. Do you want to delete their doctor profile?",
        okText: "Yes, Delete",
        cancelText: "No, Keep It",
        onOk: () => sendRoleUpdate(user._id, newRole, true),
        onCancel: () => sendRoleUpdate(user._id, newRole, false),
      });
    } else {
      sendRoleUpdate(user._id, newRole, false);
    }
  };

  const sendRoleUpdate = async (userId, role, deleteDoctorData) => {
    try {
      const res = await axios.post(
        API_ENDPOINTS.changeUserRole,
        {
          targetUserId: userId,
          role,
          deleteDoctorData,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        message.success(`✅ Role updated to ${role}`);
        fetchUsers();
      }
    } catch (error) {
      console.error("Error updating role", error);
      message.error("Something went wrong");
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    const lowerValue = value.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.name?.toLowerCase().includes(lowerValue) ||
        user.email?.toLowerCase().includes(lowerValue)
    );
    setFilteredUsers(filtered);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Current Role",
      key: "role",
      render: (record) =>
        record.isAdmin ? "admin" : record.isDoctor ? "doctor" : "user",
    },
    {
      title: "Change Role",
      key: "action",
      render: (record) => {
        if (record.isAdmin) return <span className="text-gray-400">—</span>;

        return (
          <div style={{ display: "flex", gap: "8px" }}>
            <Select
              placeholder="Select Role"
              value={selectedRoles[record._id] || ""}
              onChange={(value) => handleRoleChange(record._id, value)}
              disabled={record._id === currentUserId}
              style={{ width: 120 }}
            >
              <Option value="user">User</Option>
              <Option value="doctor">Doctor</Option>
              <Option value="admin">Admin</Option>
            </Select>
            <Button
              type="primary"
              onClick={() => updateRole(record)}
              disabled={record._id === currentUserId}
            >
              Update
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <Layout>
      <div className="p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <Title level={3} className="!mb-0">
            Manage User Roles
          </Title>
          <Input
            placeholder="Search by name or email"
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            prefix={<SearchOutlined />}
            style={{ width: 250 }}
          />
        </div>

        {loading ? (
          <div className="flex justify-center p-10">
            <Spin tip="Loading users..." size="large" />
          </div>
        ) : (
          <Table
            dataSource={filteredUsers}
            columns={columns}
            rowKey="_id"
            pagination={{ pageSize: 6 }}
          />
        )}
      </div>
    </Layout>
  );
};

export default Userstatus;
