import React, { useState, useEffect } from "react";
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

  const [approvedDoctors, setApprovedDoctors] = useState([]);

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

  const genderOptions = ["Male", "Female", "Others", "Preferred Not to say"];
  const severityOptions = ["Mild", "Moderate", "Severe"];
  const consultationStatus = ["Online", "InPerson"];

  // Fetch approved doctors from backend
  const fetchApprovedDoctors = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.getApprovedDoctors, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setApprovedDoctors(res.data.data);
      } else {
        message.error("Failed to load approved doctors");
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      message.error("Error fetching doctors");
    }
  };

  useEffect(() => {
    fetchApprovedDoctors();
  }, []);

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
              <Input placeholder="Enter your name" />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please enter your email" }]}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>
            <Form.Item
              label="Age"
              name="age"
              rules={[{ required: true, message: "Please enter your age" }]}
            >
              <Input placeholder="Enter your age" />
            </Form.Item>
            <Form.Item
              label="Gender"
              name="gender"
              rules={[{ required: true, message: "Please select gender" }]}
            >
              <Select placeholder="Select gender">
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
              <Input placeholder="Enter your address" />
            </Form.Item>
          </div>

          {/* Certificate Details Section */}
          <h2 className="text-xl font-medium">Certificate Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Are you an employer"
              name="employer"
              rules={[
                {
                  required: true,
                  message: "Please enter your employment status",
                },
              ]}
            >
              <Input placeholder="Enter your employment status" />
            </Form.Item>
            <Form.Item
              label="Reason"
              name="reason"
              rules={[{ required: true, message: "Please select a reason" }]}
            >
              <Select placeholder="Choose a reason">
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
              <Select mode="multiple" placeholder="Choose symptoms">
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
              <Input type="number" placeholder="e.g., 3" />
            </Form.Item>
            <Form.Item
              label="Duration of illness"
              name="durationOfIllness"
              rules={[
                { required: true, message: "Please enter duration of illness" },
              ]}
            >
              <Input type="number" placeholder="e.g., 3" />
            </Form.Item>
            <Form.Item
              label="Medical history"
              name="medicalHistory"
              rules={[
                {
                  required: true,
                  message: "Please enter your medical history",
                },
              ]}
            >
              <Input placeholder="Enter your medical history" />
            </Form.Item>
            <Form.Item
              label="Medications"
              name="medications"
              rules={[{ required: true, message: "Please enter medications" }]}
            >
              <Input placeholder="Enter medications" />
            </Form.Item>
            <Form.Item
              label="Emergency Treatment"
              name="emergencyTreatment"
              rules={[
                {
                  required: true,
                  message: "Please enter emergency treatment details",
                },
              ]}
            >
              <Input placeholder="Emergency treatment info" />
            </Form.Item>
            <Form.Item
              label="Previous Surgeries"
              name="previousSurgeries"
              rules={[{ required: true, message: "Please enter surgery info" }]}
            >
              <Input placeholder="Previous surgeries" />
            </Form.Item>
            <Form.Item
              label="Family History"
              name="familyHistory"
              rules={[
                { required: true, message: "Please enter family history" },
              ]}
            >
              <Input placeholder="Family medical history" />
            </Form.Item>
            <Form.Item
              label="Environmental Cause"
              name="environmentalCause"
              rules={[
                { required: true, message: "Please enter environmental cause" },
              ]}
            >
              <Input placeholder="Environmental cause (if any)" />
            </Form.Item>
            <Form.Item
              label="Severity"
              name="severity"
              rules={[{ required: true, message: "Please select severity" }]}
            >
              <Select placeholder="Select severity">
                {severityOptions.map((severity, index) => (
                  <Option key={index} value={severity}>
                    {severity}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Consultation Status"
              name="consultationStatus"
              rules={[
                { required: true, message: "Please select consultation type" },
              ]}
            >
              <Select placeholder="Choose consultation type">
                {consultationStatus.map((status, index) => (
                  <Option key={index} value={status}>
                    {status}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Certificate Purpose"
              name="certificatePurpose"
              rules={[
                { required: true, message: "Please enter certificate purpose" },
              ]}
            >
              <Input placeholder="Purpose of the certificate" />
            </Form.Item>
            <Form.Item
              label="Select Doctor"
              name="doctorId"
              rules={[{ required: false, message: "Please select a doctor" }]}
            >
              <Select placeholder="Choose an approved doctor">
                {approvedDoctors.map((doc) => (
                  <Option key={doc._id} value={doc._id}>
                    Dr. {doc.firstName} {doc.lastName} ({doc.specialization})
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Status" name="pending">
              <Input disabled value="Pending" />
            </Form.Item>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600 transition"
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
