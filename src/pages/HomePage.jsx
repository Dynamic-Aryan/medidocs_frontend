import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { useSelector } from "react-redux";
import {
  FaRegFileAlt,
  FaCalendarCheck,
  FaClipboardList,
  FaUserMd,
  FaNotesMedical,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Card, Button, Row, Col, Typography, Spin } from "antd";
import API_ENDPOINTS from "../api/endpoints";

const { Title, Text } = Typography;

const HomePage = () => {
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getUserData = async () => {
    try {
      await axios.post(
        API_ENDPOINTS.getUserData,
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-96">
          <Spin size="large" />
        </div>
      </Layout>
    );
  }

  const renderDoctorDashboard = () => (
    <Row gutter={[24, 24]}>
      <Col span={12}>
        <Card
          title="Review Certificates"
          bordered={false}
          className="shadow-lg"
          actions={[
            <Button type="primary" onClick={() => navigate("/usersforcertificate")}>
              Review
            </Button>,
          ]}
        >
          <FaUserMd className="text-blue-500 text-5xl mb-2" />
          <Text type="secondary">Access & Review submitted certificates</Text>
        </Card>
      </Col>
      <Col span={12}>
        <Card
          title="Manage Appointments"
          bordered={false}
          className="shadow-lg"
          actions={[
            <Button type="primary" onClick={() => navigate("/doctor-appointments")}>
              Manage
            </Button>,
          ]}
        >
          <FaNotesMedical className="text-green-500 text-5xl mb-2" />
          <Text type="secondary">View and organize appointment slots</Text>
        </Card>
      </Col>
    </Row>
  );

  const renderUserDashboard = () => (
    <Row gutter={[24, 24]}>
      <Col span={8}>
        <Card
          title="Request Certificate"
          bordered={false}
          className="shadow-lg"
          actions={[
            <Button type="primary" onClick={() => navigate("/medicalcert")}>
              Request
            </Button>,
          ]}
        >
          <FaRegFileAlt className="text-blue-500 text-5xl mb-2" />
          <Text type="secondary">Submit a request for medical leave</Text>
        </Card>
      </Col>
      <Col span={8}>
        <Card
          title="View Certificate Status"
          bordered={false}
          className="shadow-lg"
          actions={[
            <Button type="primary" onClick={() => navigate("/certificatestatus")}>
              View
            </Button>,
          ]}
        >
          <FaClipboardList className="text-indigo-500 text-5xl mb-2" />
          <Text type="secondary">Track your application progress</Text>
        </Card>
      </Col>
      <Col span={8}>
        <Card
          title="Book Appointment"
          bordered={false}
          className="shadow-lg"
          actions={[
            <Button type="primary" onClick={() => navigate("/doctorhub")}>
              Book
            </Button>,
          ]}
        >
          <FaCalendarCheck className="text-green-500 text-5xl mb-2" />
          <Text type="secondary">Choose a doctor & set a consultation</Text>
        </Card>
      </Col>
    </Row>
  );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="mb-6">
          <Title level={3}>
            Hello, {user?.isDoctor ? `Dr. ${user?.name}` : user?.name || "User"}!
          </Title>
          <Text type="secondary">Welcome to your dashboard</Text>
        </div>

        {user?.isDoctor ? renderDoctorDashboard() : renderUserDashboard()}
      </div>
    </Layout>
  );
};

export default HomePage;
