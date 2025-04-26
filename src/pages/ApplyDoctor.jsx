import React, { useState } from "react";
import Layout from "../components/Layout";
import { Form, Input, message, TimePicker } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import axios from "axios";
import moment from "moment";
import API_ENDPOINTS from "../api/endpoints";

const ApplyDoctor = () => {
  const { user } = useSelector((state) => state.user) || {};
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [signatureFile, setSignatureFile] = useState(null);
  const [degreeFile, setDegreeFile] = useState(null);

  const initialValues = {
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ")[1] || "",
    email: user?.email || "",
  };

  const handleFinish = async (values) => {
    try {
      dispatch(showLoading());

      const formData = new FormData();
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("website", values.website);
      formData.append("address", values.address);
      formData.append("specialization", values.specialization);
      formData.append("experience", values.experience);
      formData.append("feesPerConsultation", values.feesPerConsultation);
      formData.append("userId", user._id);
      formData.append(
        "timings",
        JSON.stringify([
          moment(values.timings[0]).format("HH:mm"),
          moment(values.timings[1]).format("HH:mm"),
        ])
      );

      if (signatureFile) formData.append("signature", signatureFile);
      if (degreeFile) formData.append("degree", degreeFile);

      const res = await axios.post(API_ENDPOINTS.applyDoctor, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
        navigate("/");
      } else {
        message.error(res.data.message || "Application failed");
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error(error);
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
              <Input placeholder="Your first name" />
            </Form.Item>
            <Form.Item label="Last Name" name="lastName" rules={[{ required: true }]}>
              <Input placeholder="Your last name" />
            </Form.Item>
            <Form.Item label="Phone No" name="phone" rules={[{ required: true }]}>
              <Input placeholder="Phone number" />
            </Form.Item>
            <Form.Item label="Email" name="email" rules={[{ required: true }]}>
              <Input placeholder="Email address" />
            </Form.Item>
            <Form.Item label="Website" name="website">
              <Input placeholder="Website (optional)" />
            </Form.Item>
            <Form.Item label="Address" name="address" rules={[{ required: true }]}>
              <Input placeholder="Your address" />
            </Form.Item>
          </div>

          <h6 className="text-xl font-medium mt-4">Professional Details</h6>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item label="Specialization" name="specialization" rules={[{ required: true }]}>
              <Input placeholder="Specialization" />
            </Form.Item>
            <Form.Item label="Experience" name="experience" rules={[{ required: true }]}>
              <Input placeholder="Years of experience" />
            </Form.Item>
            <Form.Item label="Fees" name="feesPerConsultation" rules={[{ required: true }]}>
              <Input placeholder="Fees per consultation" />
            </Form.Item>
            <Form.Item label="Timings" name="timings" rules={[{ required: true }]}>
              <TimePicker.RangePicker format="HH:mm" />
            </Form.Item>
          </div>

          <h6 className="text-xl font-medium mt-4">Upload Documents</h6>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item label="Signature (Image or PDF) jpg jpeg png pdf">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setSignatureFile(e.target.files[0])}
              />
            </Form.Item>
            <Form.Item label="Degree (Image or PDF) jpg jpeg png pdf">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setDegreeFile(e.target.files[0])}
              />
            </Form.Item>
          </div>

          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600 transition cursor-pointer"
            >
              Submit
            </button>
          </div>
        </Form>
      </div>
    </Layout>
  );
};

export default ApplyDoctor;
