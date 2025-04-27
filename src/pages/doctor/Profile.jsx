import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Input, message, TimePicker } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/features/alertSlice";
import moment from "moment";
import API_ENDPOINTS from "../../api/endpoints";

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const [doctor, setDoctor] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const handleFinish = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        API_ENDPOINTS.updateProfile,
        {
          ...values,
          userId: user._id,
          timings: [
            moment(values.timings[0]).format("HH:mm"),
            moment(values.timings[1]).format("HH:mm"),
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
        navigate("/");
      } else {
        message.error(res.data.success);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something Went Wrong");
    }
  };

  const getDoctorInfo = async () => {
    try {
      const res = await axios.post(
      API_ENDPOINTS.getDoctorInfo,
        { userId: params.id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setDoctor(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDoctorInfo();
  }, []);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg mt-6">
        <h1 className="text-2xl font-bold text-center mb-6">Manage Profile</h1>
        {doctor && (
          <div className="mb-6 p-4 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-semibold">Doctor Details</h2>
            <p><strong>Name:</strong> {doctor.firstName} {doctor.lastName}</p>
            <p><strong>Phone:</strong> {doctor.phone}</p>
            <p><strong>Email:</strong> {doctor.email}</p>
            <p><strong>Specialization:</strong> {doctor.specialization}</p>
            <p><strong>Experience:</strong> {doctor.experience} years</p>
            <p><strong>Fees Per Consultation:</strong> {doctor.feesPerConsultation}</p>
            <p><strong>Timings:</strong> {doctor.timings[0]} - {doctor.timings[1]}</p>
          </div>
        )}
        {doctor && (
          <Form
            layout="vertical"
            onFinish={handleFinish}
            className="space-y-6"
            initialValues={{
              ...doctor,
              timings: [
                moment(doctor.timings[0], "HH:mm"),
                moment(doctor.timings[1], "HH:mm"),
              ],
            }}
          >
            <h4 className="text-lg font-semibold mb-4">Personal Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item label="First Name" name="firstName" rules={[{ required: true }]}> 
                <Input className="w-full p-2 border rounded" placeholder="Your first name" />
              </Form.Item>
              <Form.Item label="Last Name" name="lastName" rules={[{ required: true }]}> 
                <Input className="w-full p-2 border rounded" placeholder="Your last name" />
              </Form.Item>
              <Form.Item label="Phone No" name="phone" rules={[{ required: true }]}> 
                <Input className="w-full p-2 border rounded" placeholder="Your contact no" />
              </Form.Item>
              <Form.Item label="Email" name="email" rules={[{ required: true }]}> 
                <Input className="w-full p-2 border rounded" placeholder="Your email address" />
              </Form.Item>
              <Form.Item label="Website" name="website"> 
                <Input className="w-full p-2 border rounded" placeholder="Your website" />
              </Form.Item>
              <Form.Item label="Address" name="address" rules={[{ required: true }]}> 
                <Input className="w-full p-2 border rounded" placeholder="Your clinic address" />
              </Form.Item>
            </div>
            <h4 className="text-lg font-semibold mb-4">Professional Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item label="Specialization" name="specialization" rules={[{ required: true }]}> 
                <Input className="w-full p-2 border rounded" placeholder="Your specialization" />
              </Form.Item>
              <Form.Item label="Experience" name="experience" rules={[{ required: true }]}> 
                <Input className="w-full p-2 border rounded" placeholder="Your experience" />
              </Form.Item>
              <Form.Item label="Fees Per Consultation" name="feesPerConsultation" rules={[{ required: true }]}> 
                <Input className="w-full p-2 border rounded" placeholder="Fees per consultation" />
              </Form.Item>
              <Form.Item label="Timings" name="timings" rules={[{ required: true }]}> 
                <TimePicker.RangePicker format="HH:mm" className="w-full p-2 border rounded" />
              </Form.Item>
            </div>
            <div className="flex justify-center mt-4">
              <button className="bg-cyan-200 cursor-pointer text-white py-2 px-6 rounded-lg hover:bg-blue-400 transition duration-300">Update</button>
            </div>
          </Form>
        )}
      </div>
    </Layout>
  );
};

export default Profile;
