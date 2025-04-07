import React, { useState } from "react";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { Form, Input, Select, message } from "antd";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import API_ENDPOINTS from "../api/endpoints";

const { Option } = Select;

const MedicalCertificateForm = () => {
  const { user } = useSelector((state) => state.user) || {};
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const initialValues = {
    name: user?.name || "",
    email: user?.email || "",
  };

  const reasonOptions = [
    "Fever or Cold",
    "Headache or Migraine",
    "Stomach Issues",
    "Body Pain or Weakness",
    "Minor Injuries",
    "Doctor’s Appointment",
    "Dental Issues",
    "Allergies or Skin Reactions",
    "Eye Infection or Irritation",
  ];

  const symptomOptions = [
    "Fever and chills",
    "Cough and sore throat",
    "Runny or stuffy nose",
    "Body aches and fatigue",
    "Headache",
    "Stomach pain or cramps",
    "Nausea or vomiting",
    "Diarrhea",
    "Swelling and bruising",
    "Itchy skin or rashes",
    "Redness and irritation",
  ];

  const genderOptions=[
    "Male",
    "Female",
    "Others",
    "Preferred Not to say"
  ]
  const severityoptions=[
    "Mild", "Moderate", "Severe"
  ]

  const consultationStatus=[
    "Online", "InPerson"
  ]



  const handleSubmit = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        API_ENDPOINTS.applyCertificate,
        { ...values, userId: user?._id },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success("Medical certificate request submitted!");
        navigate("/");
      } else {
        message.error("Submission failed. Try again!");
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error(error);
      message.error("An error occurred while submitting.");
    }
  };

  return (
    <Layout>
      <div>
        <h1 className="text-center text-2xl font-semibold mb-6">
          Apply for Medical Certificate
        </h1>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={initialValues}
          className="space-y-4"
        >
          {/* Personal Details Section */}
          <h2 className="text-xl font-medium">Personal Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please enter your name" }]}
            >
              <Input placeholder="Enter your name" className="w-full" />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please enter your email" }]}
            >
              <Input placeholder="Enter your email" className="w-full" />
            </Form.Item>
            <Form.Item
              label="Age"
              name="age"
              rules={[{ required: true, message: "Please enter your age" }]}
            >
              <Input placeholder="Enter your age" className="w-full" />
            </Form.Item>
            <Form.Item
              label="Gender"
              name="gender"
              rules={[{ required: true, message: "Please enter your gender" }]}
            >
              <Select placeholder="Choose " className="w-full">
                {genderOptions.map((gender, index) => (
                  <Option key={index} value={gender}>
                    {gender}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: "Please enter your address" }]}
            >
              <Input placeholder="Enter your address" className="w-full" />
            </Form.Item>
          </div>

          {/* Certificate Details Section */}
          <h2 className="text-xl font-medium">Certificate Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please enter your name" }]}
            >
              <Input placeholder="Enter your name" className="w-full" />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please enter your email" }]}
            >
              <Input placeholder="Enter your email" className="w-full" />
            </Form.Item>
            <Form.Item
              label="Are you a employer"
              name="employer"
              rules={[{ required: true, message: "Please enter your employment status" }]}
            >
              <Input placeholder="Enter your employment status" className="w-full" />
            </Form.Item>
            <Form.Item
              label="Reason"
              name="reason"
              rules={[{ required: true, message: "Please select a reason" }]}
            >
              <Select placeholder="Choose a reason" className="w-full">
                {reasonOptions.map((reason, index) => (
                  <Option key={index} value={reason}>
                    {reason}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Symptoms"
              name="symptoms"
              rules={[{ required: true, message: "Please select symptoms" }]}
            >
              <Select
                mode="multiple"
                placeholder="Choose symptoms"
                className="w-full"
              >
                {symptomOptions.map((symptom, index) => (
                  <Option key={index} value={symptom}>
                    {symptom}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Duration (in days)"
              name="duration"
              rules={[{ required: true, message: "Please enter duration" }]}
            >
              <Input type="number" placeholder="e.g., 3" className="w-full" />
            </Form.Item>
            <Form.Item
              label="Duration of illness (in days)"
              name="durationOfIllness"
              rules={[{ required: true, message: "Please enter duration of illness" }]}
            >
              <Input type="number" placeholder="e.g., 3" className="w-full" />
            </Form.Item>
            <Form.Item
              label="Medical history"
              name="medicalHistory"
              rules={[{ required: true, message: "Please enter your medical history" }]}
            >
              <Input placeholder="Enter your medical history" className="w-full" />
            </Form.Item>
            <Form.Item
              label="Medications"
              name="medications"
              rules={[{ required: true, message: "Please enter medications" }]}
            >
              <Input placeholder="Enter medications" className="w-full" />
            </Form.Item>
            <Form.Item
              label="Emergency Treatment"
              name="emergencyTreatment"
              rules={[{ required: true, message: "Please enter Emergency Treatment status" }]}
            >
              <Input placeholder="Please enter Emergency Treatment status" className="w-full" />
            </Form.Item>
            <Form.Item
              label="Previous Surgeries"
              name="previousSurgeries"
              rules={[{ required: true, message: "Please enter Previous Surgeries status" }]}
            >
              <Input placeholder="Please enter Previous Surgeries status" className="w-full" />
            </Form.Item>
            <Form.Item
              label="Family History"
              name="familyHistory"
              rules={[{ required: true, message: "Please enter Family History status" }]}
            >
              <Input placeholder="Please enter Family History status" className="w-full" />
            </Form.Item>
            <Form.Item
              label="Environmental Cause"
              name="environmentalCause"
              rules={[{ required: true, message: "Please enter Environmental Cause status" }]}
            >
              <Input placeholder="Please enter Environmental Cause status" className="w-full" />
            </Form.Item>
            <Form.Item
              label="Severity"
              name="severity"
              rules={[{ required: true, message: "Please select severity" }]}
            >
              <Select placeholder="Choose severity" className="w-full">
                {severityoptions.map((severity, index) => (
                  <Option key={index} value={severity}>
                    {severity}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Consultation Status"
              name="consultationStatus"
              rules={[{ required: true, message: "Please select Consultation Status" }]}
            >
              <Select
                
                placeholder="Choose consultationStatus"
                className="w-full"
              >
                {consultationStatus.map((consultationStatus, index) => (
                  <Option key={index} value={consultationStatus}>
                    {consultationStatus}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Certificate Purpose"
              name="certificatePurpose"
              rules={[{ required: true, message: "Please enter Certificate Purpose" }]}
            >
              <Input placeholder="Please enter Certificate Purpose" className="w-full" />
            </Form.Item>

            <Form.Item label="Status" name="pending">
              <Input disabled value="Pending" className="w-full" />
            </Form.Item>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-4 text-white">
            <button
              type="submit"
              className="bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600 transition cursor-pointer"
            >
              Submit Request
            </button>
          </div>
        </Form>
      </div>
    </Layout>
  );
};

export default MedicalCertificateForm;
