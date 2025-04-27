import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Modal, Descriptions } from "antd";
import { UserOutlined, EyeOutlined } from "@ant-design/icons";

const DoctorData = ({ doctor }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = (e) => {
    e.stopPropagation(); // Prevent card click
    setIsModalVisible(true);
  };
  const handleCancel = () => setIsModalVisible(false);

  const navigate = useNavigate();

  return (
    <>
      <Card
        title={
          <div className="flex justify-between items-center">
            <span className="font-semibold text-lg text-gray-800">
              <UserOutlined className="mr-2 text-teal-600" />
              Dr. {doctor.firstName} {doctor.lastName}
            </span>
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={showModal}
              size="middle"
            >
              View Profile
            </Button>
          </div>
        }
        bordered={false}
        className="shadow-md hover:shadow-lg rounded-xl border border-teal-100 transition-all duration-300 mb-6 cursor-pointer"
        onClick={() => navigate(`/doctor/book-appointment/${doctor._id}`)}
      >
        <p>
          <b>Specialization:</b> {doctor.specialization}
        </p>
        <p>
          <b>Experience:</b> {doctor.experience} years
        </p>
        <p>
          <b>Fees Per Consultation:</b> ${doctor.feesPerConsultation}
        </p>
        {/* <p>
          <b>Timings:</b> {doctor.timings[0]} - {doctor.timings[1]}
        </p> */}
        <p>
          <b>Phone:</b> {doctor.phone}
        </p>
        <p>
          <b>Email:</b> {doctor.email}
        </p>
      </Card>

      <Modal
        title={`Doctor Profile - Dr. ${doctor.firstName} ${doctor.lastName}`}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={700}
        centered
      >
        <Descriptions
          column={2}
          bordered
          size="small"
          labelStyle={{ fontWeight: "bold", color: "#08979c" }}
        >
          <Descriptions.Item label="ID">{doctor._id}</Descriptions.Item>
          <Descriptions.Item label="First Name">{doctor.firstName}</Descriptions.Item>
          <Descriptions.Item label="Last Name">{doctor.lastName}</Descriptions.Item>
          <Descriptions.Item label="Email">{doctor.email}</Descriptions.Item>
          <Descriptions.Item label="Phone">{doctor.phone}</Descriptions.Item>
          <Descriptions.Item label="Specialization">{doctor.specialization}</Descriptions.Item>
          <Descriptions.Item label="Experience">{doctor.experience} years</Descriptions.Item>
          <Descriptions.Item label="Fees">${doctor.feesPerConsultation}</Descriptions.Item>
          <Descriptions.Item label="Timings" span={2}>
            {doctor.timings[0]} - {doctor.timings[1]}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </>
  );
};

export default DoctorData;
