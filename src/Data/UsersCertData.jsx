import React, { useState } from 'react';
import { Card, Button, Modal, Descriptions } from 'antd';
import { UserOutlined, EyeOutlined } from '@ant-design/icons';

const UsersCertData = ({ user }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  return (
    <>
      <Card
        title={
          <div className="flex justify-between items-center">
            <span className="font-semibold text-lg text-gray-800">
              <UserOutlined className="mr-2 text-teal-600" />
              {user.name}
            </span>
            <Button type="primary" icon={<EyeOutlined />} onClick={showModal}>
              View Profile
            </Button>
          </div>
        }
        bordered={false}
        className="shadow-md hover:shadow-lg rounded-xl border border-teal-100 transition-all duration-300"
      >
         <p><b>ID:</b> {user._id}</p>
        <p><b>Email:</b> {user.email}</p>
        <p><b>Employer:</b> {user.employer}</p>
        <p><b>Status:</b> {user.status}</p>
      </Card>

      <Modal
        title={`Profile Details - ${user.name}`}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={750}
        centered
      >
        <Descriptions
          column={2}
          bordered
          size="small"
          labelStyle={{ fontWeight: 'bold', color: '#08979c' }}
        >
          <Descriptions.Item label="ID">{user._id}</Descriptions.Item>
          <Descriptions.Item label="Age">{user.age}</Descriptions.Item>
          <Descriptions.Item label="Gender">{user.gender}</Descriptions.Item>
          <Descriptions.Item label="Address" span={2}>{user.address}</Descriptions.Item>
          <Descriptions.Item label="Employer">{user.employer}</Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Reason" span={2}>{user.reason}</Descriptions.Item>
          <Descriptions.Item label="Symptoms">{user.symptoms}</Descriptions.Item>
          <Descriptions.Item label="Duration of Illness">{user.durationOfIllness}</Descriptions.Item>
          <Descriptions.Item label="Medical History" span={2}>{user.medicalHistory}</Descriptions.Item>
          <Descriptions.Item label="Medications">{user.medications}</Descriptions.Item>
          <Descriptions.Item label="Emergency Treatment">{user.emergencyTreatment}</Descriptions.Item>
          <Descriptions.Item label="Previous Surgeries">{user.previousSurgeries}</Descriptions.Item>
          <Descriptions.Item label="Family History">{user.familyHistory}</Descriptions.Item>
          <Descriptions.Item label="Environmental Cause">{user.environmentalCause}</Descriptions.Item>
          <Descriptions.Item label="Severity">{user.severity}</Descriptions.Item>
          <Descriptions.Item label="Consultation Status">{user.consultationStatus}</Descriptions.Item>
          <Descriptions.Item label="Certificate Purpose">{user.certificatePurpose}</Descriptions.Item>
          <Descriptions.Item label="Status">{user.status}</Descriptions.Item>
        </Descriptions>
      </Modal>
    </>
  );
};

export default UsersCertData;
