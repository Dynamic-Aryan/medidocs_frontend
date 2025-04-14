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

  const renderAdminDashboard = () => (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <Title level={4} className="mb-6 text-center text-gray-700">
        Admin Controls & Management Panel
      </Title>
      <Row gutter={[24, 24]}>
        <Col xl={8} md={12} sm={24}>
          <Card
            title="All Appointments"
            bordered={false}
            hoverable
            className="rounded-2xl shadow-lg transition-all duration-300"
            actions={[
              <Button type="primary" onClick={() => navigate("/admin/allappointments")}>
                View
              </Button>,
            ]}
          >
            <FaCalendarCheck className="text-blue-500 text-5xl mb-4" />
            <Text type="secondary">Monitor all user appointments</Text>
          </Card>
        </Col>
  
        <Col xl={8} md={12} sm={24}>
          <Card
            title="All Doctors"
            bordered={false}
            hoverable
            className="rounded-2xl shadow-lg transition-all duration-300"
            actions={[
              <Button type="primary" onClick={() => navigate("/admin/doctors")}>
                View
              </Button>,
            ]}
          >
            <FaUserMd className="text-purple-500 text-5xl mb-4" />
            <Text type="secondary">Manage registered doctors</Text>
          </Card>
        </Col>
  
        <Col xl={8} md={12} sm={24}>
          <Card
            title="All Certificate Requests"
            bordered={false}
            hoverable
            className="rounded-2xl shadow-lg transition-all duration-300"
            actions={[
              <Button type="primary" onClick={() => navigate("/userhub")}>
                Review
              </Button>,
            ]}
          >
            <FaRegFileAlt className="text-red-500 text-5xl mb-4" />
            <Text type="secondary">View all requested certificates</Text>
          </Card>
        </Col>
  
        <Col xl={8} md={12} sm={24}>
          <Card
            title="All Users"
            bordered={false}
            hoverable
            className="rounded-2xl shadow-lg transition-all duration-300"
            actions={[
              <Button type="primary" onClick={() => navigate("/admin/users")}>
                Manage
              </Button>,
            ]}
          >
            <FaClipboardList className="text-green-500 text-5xl mb-4" />
            <Text type="secondary">Manage user accounts</Text>
          </Card>
        </Col>
  
        <Col xl={8} md={12} sm={24}>
          <Card
            title="Change User Status"
            bordered={false}
            hoverable
            className="rounded-2xl shadow-lg transition-all duration-300"
            actions={[
              <Button type="primary" onClick={() => navigate("/admin/changestatus")}>
                Change
              </Button>,
            ]}
          >
            <FaNotesMedical className="text-indigo-500 text-5xl mb-4" />
            <Text type="secondary">Promote or demote users/roles</Text>
          </Card>
        </Col>
  
        <Col xl={8} md={12} sm={24}>
          <Card
            title="Fetch User Certificates"
            bordered={false}
            hoverable
            className="rounded-2xl shadow-lg transition-all duration-300"
            actions={[
              <Button type="primary" onClick={() => navigate("/fetchcertificates")}>
                Fetch
              </Button>,
            ]}
          >
            <FaClipboardList className="text-orange-500 text-5xl mb-4" />
            <Text type="secondary">Access specific user certificate data</Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
  

  const renderDoctorDashboard = () => (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <Title level={4} className="mb-6 text-center text-gray-700">
        Doctor Controls & Management Panel
      </Title>
      <Row gutter={[24, 24]}>
      <Col xl={12} md={12} sm={24}>
        <Card
          title="Review Certificates"
          bordered={false}
          hoverable
          className="rounded-2xl shadow-lg transition-all duration-300"
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
          hoverable
          className="rounded-2xl shadow-lg transition-all duration-300"
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
    </div>
  );

  const renderUserDashboard = () => (
    <div className="bg-white p-6 rounded-xl shadow-md">
     <Title level={4} className="mb-6 text-center text-gray-700">
        Hello Welcome to MediDocs
      </Title>
      <Row gutter={[24, 24]}>
      <Col xl={8} md={12} sm={24}>
        <Card
          title="Request Certificate"
          bordered={false}
          hoverable
            className="rounded-2xl shadow-lg transition-all duration-300"
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
          hoverable
            className="rounded-2xl shadow-lg transition-all duration-300"
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
          hoverable
            className="rounded-2xl shadow-lg transition-all duration-300"
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
    </div>
  );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="mb-6">
           <Title level={3}>
            Hello,{" "}
            {user?.isAdmin
              ? `Sir ${user?.name}`
              : user?.isDoctor
              ? `Dr. ${user?.name}`
              : user?.name || "User"}
            !
          </Title>
          <Text type="secondary">Welcome to your dashboard</Text>
        </div>

        {user?.isAdmin
          ? renderAdminDashboard()
          : user?.isDoctor
          ? renderDoctorDashboard()
          : renderUserDashboard()}
      </div>
    </Layout>
  );
};

export default HomePage;
