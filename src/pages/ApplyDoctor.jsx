import React from "react";
import Layout from "../components/Layout";
import { Form, Input, message, TimePicker } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import axios from "axios";
import moment from 'moment'
import API_ENDPOINTS from "../api/endpoints";

const ApplyDoctor = () => {
  const { user } = useSelector((state) => state.user) || {}; // Ensure user exists
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Safe access to user properties
  const initialValues = {
    firstName: user?.name?.split(" ")[0] || "", // Extract first word as first name
    lastName: user?.name?.split(" ")[1] || "",  // Extract second word as last name
    email: user?.email || "",
  };
  
  const handleFinish = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        API_ENDPOINTS.applyDoctor,
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
        message.success(res.data.success);
        navigate("/");
      } else {
        message.error(res.data.success);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something went wrong");
    }
  };

  return (
    <Layout>
      <div>
        <h1 className="text-center text-2xl font-semibold mb-6">Apply as a Doctor</h1>
        <Form layout="vertical" onFinish={handleFinish} className="space-y-4" initialValues={initialValues}>
          <h6 className="text-xl font-medium">Personal Details</h6>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item label="First Name" name="firstName" rules={[{ required: true }]}> 
              <Input placeholder="Your first name" className="w-full" />
            </Form.Item>
            <Form.Item label="Last Name" name="lastName" rules={[{ required: true }]}> 
              <Input placeholder="Your last name" className="w-full" />
            </Form.Item>
            <Form.Item label="Phone No" name="phone" rules={[{ required: true }]}> 
              <Input placeholder="Phone number" className="w-full" />
            </Form.Item>
            <Form.Item label="Email" name="email" rules={[{ required: true }]}> 
              <Input placeholder="Email address" className="w-full" />
            </Form.Item>
            <Form.Item label="Website" name="website"> 
              <Input placeholder="Website (optional)" className="w-full" />
            </Form.Item>
            <Form.Item label="Address" name="address" rules={[{ required: true }]}> 
              <Input placeholder="Your address" className="w-full" />
            </Form.Item>
          </div>
          
          <h6 className="text-xl font-medium mt-4">Professional Details</h6>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item label="Specialization" name="specialization" rules={[{ required: true }]}> 
              <Input placeholder="Specialization" className="w-full" />
            </Form.Item>
            <Form.Item label="Experience" name="experience" rules={[{ required: true }]}> 
              <Input placeholder="Years of experience" className="w-full" />
            </Form.Item>
            <Form.Item label="Fees" name="feesPerConsultation" rules={[{ required: true }]}> 
              <Input placeholder="Fees per consultation" className="w-full" />
            </Form.Item>
            <Form.Item label="Timings" name="timings" rules={[{ required: true }]}> 
              <TimePicker.RangePicker format="HH:mm" className="w-full" />
            </Form.Item>
          </div>
          
          <div className="flex justify-center mt-4">
            <button className="bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600 transition cursor-pointer">
              Submit
            </button>
          </div>
        </Form>
      </div>
    </Layout>
  );
};

export default ApplyDoctor;
