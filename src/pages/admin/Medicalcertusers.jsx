import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import axios from 'axios';
import {
  Table,
  Modal,
  Tooltip,
  Button,
  Descriptions,
  Input
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import API_ENDPOINTS from '../../api/endpoints';

const Medicalcertusers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Fetch all users
  const getCertUsers = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.getAllUsersCert, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setUsers(res.data.data);
        setFilteredUsers(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCertUsers();
  }, []);

  const showProfileModal = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    const lowerSearch = value.toLowerCase();
    const filtered = users.filter(user =>
      user.name?.toLowerCase().includes(lowerSearch) ||
      user.email?.toLowerCase().includes(lowerSearch) ||
      user.reason?.toLowerCase().includes(lowerSearch)
    );
    setFilteredUsers(filtered);
  };

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
      render: symptoms => symptoms?.join(', '),
    },
    {
      title: "Status",
      dataIndex: "status",
      className: "text-gray-600",
    },
    {
      title: "Approved By",
      dataIndex: "signature",
      className: "text-gray-600",
      render: (text) => <b>By {text}</b>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Tooltip title="View Profile">
          <Button onClick={() => showProfileModal(record)} className="border-gray-500">
            View Profile
          </Button>
        </Tooltip>
      ),
    }
  ];

  return (
    <Layout>
      <div className="p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-extrabold text-gray-800">Users Certificate Details</h1>
        <div className="flex justify-between items-center mb-4">
  
          <input
            placeholder="Search by name, email or reason"
             className="border px-3 py-1 rounded-md w-1/3"
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            
          />
        </div>
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={filteredUsers}
            className="w-full border rounded-lg shadow-sm"
            pagination={{ pageSize: 5 }}
            rowKey="_id"
          />
        </div>
      </div>

      {/* Profile Modal */}
      <Modal
        title="User Profile"
        visible={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={700}
      >
        {selectedUser && (
          <Descriptions
            bordered
            column={1}
            size="small"
            labelStyle={{ fontWeight: 'bold', width: '30%' }}
          >
            <Descriptions.Item label="Name">{selectedUser.name}</Descriptions.Item>
            <Descriptions.Item label="Age">{selectedUser.age}</Descriptions.Item>
            <Descriptions.Item label="Gender">{selectedUser.gender}</Descriptions.Item>
            <Descriptions.Item label="Address">{selectedUser.address}</Descriptions.Item>
            <Descriptions.Item label="Employer">{selectedUser.employer}</Descriptions.Item>
            <Descriptions.Item label="Email">{selectedUser.email}</Descriptions.Item>
            <Descriptions.Item label="Reason">{selectedUser.reason}</Descriptions.Item>
            <Descriptions.Item label="Symptoms">{selectedUser.symptoms?.join(', ')}</Descriptions.Item>
            <Descriptions.Item label="Duration of Symptoms">{selectedUser.duration}</Descriptions.Item>
            <Descriptions.Item label="Duration of Illness">{selectedUser.durationOfIllness}</Descriptions.Item>
            <Descriptions.Item label="Medical History">{selectedUser.medicalHistory}</Descriptions.Item>
            <Descriptions.Item label="Medications">{selectedUser.medications}</Descriptions.Item>
            <Descriptions.Item label="Emergency Treatment">{selectedUser.emergencyTreatment}</Descriptions.Item>
            <Descriptions.Item label="Previous Surgeries">{selectedUser.previousSurgeries}</Descriptions.Item>
            <Descriptions.Item label="Family History">{selectedUser.familyHistory}</Descriptions.Item>
            <Descriptions.Item label="Environmental Cause">{selectedUser.environmentalCause}</Descriptions.Item>
            <Descriptions.Item label="Severity">{selectedUser.severity}</Descriptions.Item>
            <Descriptions.Item label="Consultation Status">{selectedUser.consultationStatus}</Descriptions.Item>
            <Descriptions.Item label="Certificate Purpose">{selectedUser.certificatePurpose}</Descriptions.Item>
            <Descriptions.Item label="Status">{selectedUser.status}</Descriptions.Item>
            <Descriptions.Item label="Digital Signature">{selectedUser.digitalSignature || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Requested At">
              {new Date(selectedUser.requestedAt).toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </Layout>
  );
};

export default Medicalcertusers;
