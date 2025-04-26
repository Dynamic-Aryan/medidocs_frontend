import React, { useState, useEffect, useRef } from "react";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { Button, Checkbox, Form, Input, Modal, Select, message } from "antd";
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

  const identityRef = useRef();
  const reportRef = useRef();

  const [approvedDoctors, setApprovedDoctors] = useState([]);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);

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

      const identityProof = identityRef.current?.input?.files[0];
      const reportFile = reportRef.current?.input?.files[0];

      if (!identityProof || !reportFile) {
        message.error("Please upload both identity proof and medical report.");
        dispatch(hideLoading());
        return;
      }

      const formData = new FormData();
      Object.entries(values).forEach(([key, val]) => {
        if (Array.isArray(val)) {
          val.forEach((item) => formData.append(`${key}[]`, item));
        } else {
          formData.append(key, val);
        }
      });

      formData.append("identityProof", identityProof);
      formData.append("reportFile", reportFile);
      formData.append("userId", user?._id);

      const res = await axios.post(API_ENDPOINTS.applyCertificate, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

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

  // Handle checkbox toggle for terms acceptance
  const handleTermsCheckbox = (e) => {
    setTermsAccepted(e.target.checked);
  };

  // Handle WhatsApp video link
  const handleWhatsAppLink = () => {
    // Replace 'whatsappNumber' with the actual number or mechanism to open WhatsApp
    window.open("https://wa.me/9657113311", "_blank");
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
              label="Enter your company name"
              name="employer"
              rules={[
                {
                  required: true,
                  message: "Please enter your employment status",
                },
              ]}
            >
              <Input placeholder="Enter your company name" />
            </Form.Item>
            <Form.Item
              label="Reason"
              name="reason"
              rules={[{ required: false, message: "Please select a reason" }]}
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
                {
                  required: false,
                  message: "Please enter duration of illness",
                },
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
              rules={[{ required: false, message: "Please select severity" }]}
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
                { required: false, message: "Please select consultation type" },
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
              <Select placeholder="Choose an approved doctor" allowClear>
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

          <Form.Item
            label="Upload Identity Proof"
            name="identityProof"
            rules={[
              { required: true, message: "Please upload your identity proof" },
            ]}
          >
            <Input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              ref={identityRef}
            />
          </Form.Item>

          <Form.Item
            label="Upload Medical Report"
            name="reportFile"
            rules={[
              { required: true, message: "Please upload your medical report" },
            ]}
          >
            <Input type="file" accept=".jpg,.jpeg,.png,.pdf" ref={reportRef} />
          </Form.Item>

          <div className="my-6">
            <p className="text-gray-600 mb-4">
              For a faster process, you can also send us a short video
              explaining your symptoms through WhatsApp.
            </p>
            <Button type="primary" onClick={handleWhatsAppLink}>
              Send Video on WhatsApp
            </Button>
            <div className="mt-6">
              <Checkbox checked={termsAccepted} onChange={handleTermsCheckbox}>
                I confirm that all the information provided is accurate. I
                accept the{" "}
                <span className="text-blue-600 underline cursor-pointer">
                  terms and conditions
                </span>
                .
              </Checkbox>
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <Button
              type="primary"
              size="large"
              onClick={() => {
                if (!termsAccepted) {
                  message.error("Please accept the terms and conditions.");
                  return;
                }
                setPaymentModalVisible(true);
              }}
            >
              Submit Application
            </Button>
          </div>
        </Form>
        {paymentModalVisible && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 space-y-6">
              {/* Close Button Top Right */}
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
                onClick={() => setPaymentModalVisible(false)}
              >
                &times;
              </button>

              {/* Modal Content */}
              <h2 className="text-2xl font-bold text-center text-gray-800">
                Payment Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-gray-700 font-medium">
                    Card Number
                  </label>

                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-gray-700 font-medium">
                    Cardholder Name
                  </label>

                  <input
                    type="text"
                    placeholder="Cardholder Name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-gray-700 font-medium">
                    Expiry Date
                  </label>

                  <input
                    type="text"
                    placeholder="Expiry MM/YY"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-gray-700 font-medium">
                    CVC
                  </label>

                  <input
                    type="text"
                    placeholder="CVV"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-3 pt-4">
                <button
                  className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 rounded-lg transition-all duration-300"
                  onClick={() => {
                    setPaymentModalVisible(false);
                    form.submit(); // Pay and Submit form
                  }}
                >
                  Pay ₹199 & Submit
                </button>
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg transition-all duration-300"
                  onClick={() => setPaymentModalVisible(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MedicalCertificateForm;
