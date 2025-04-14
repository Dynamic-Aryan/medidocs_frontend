import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import API_ENDPOINTS from "../api/endpoints";
import MediDocs from "../assets/aryanmd.webp";

import {
  LoadingOutlined,
  CheckCircleOutlined,
  DownloadOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import {
  Modal,
  Input,
  message,
  Card,
  Typography,
  Tag,
  Button,
  Divider,
  Empty,
  Spin,
  QRCode,
} from "antd";

const { Title, Text, Paragraph } = Typography;

const Usercertificate = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upiModalVisible, setUpiModalVisible] = useState(false);
  const [upiInput, setUpiInput] = useState("");
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showPdfStyleModal, setShowPdfStyleModal] = useState(false);

  const fetchCertificates = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.userMedicalCertificateStatus, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setCertificates(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching certificate data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const isValidUpi = (upi) => {
    return /^[0-9]{10}@(ybl|ibl|axl|okaxis|okpaytm)$/.test(upi);
  };

  const handlePayAndDownload = () => {
    if (!isValidUpi(upiInput)) {
      message.error("❌ Invalid UPI ID. Use format like 9876543210@okaxis");
      return;
    }
    message.success("✅ Payment successful!");
    setUpiModalVisible(false);
    setShowPdfStyleModal(true);
    setUpiInput("");
  };

  const triggerDownload = (certificate) => {
    setSelectedCertificate(certificate);
    setUpiModalVisible(true);
  };

  const handlePdfDownload = (style) => {
    setShowPdfStyleModal(false);
    switch (style) {
      case 1:
        handleDownloadPDFStyle1(selectedCertificate);
        break;
      case 2:
        handleDownloadPDFStyle2(selectedCertificate);
        break;
      case 3:
        handleDownloadPDFStyle3(selectedCertificate);
        break;
      default:
        break;
    }
  };

  const handleDownloadPDFStyle1 = (certificate) => {
    generatePDFStyle1(certificate, "Certificate 1");
  };

  const handleDownloadPDFStyle2 = (certificate) => {
    generatePDFStyle2(certificate, "Certificate 2");
  };

  const handleDownloadPDFStyle3 = (certificate) => {
    generatePDFStyle3(certificate, "Certificate 3");
  };

  const generatePDFStyle1 = (certificate, title) => {
    const doc = new jsPDF("p", "mm", "a4");

    const primary = [34, 58, 94];
    const accent = [218, 165, 32];
    const lightGray = [240, 240, 240];
    const textDark = [40, 40, 40];

    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 210, 297, "F");

    doc.setDrawColor(...accent);
    doc.setLineWidth(1.5);
    doc.rect(10, 10, 190, 277);

    doc.setFillColor(...primary);
    doc.rect(10, 10, 190, 30, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);

    doc.text(" Medical Certificate", 105, 25, {
      align: "center",
    });
    doc.setFontSize(10);
    doc.text("Issued by Medidocs Health Records", 105, 33, { align: "center" });

    doc.setDrawColor(...accent);
    doc.setLineWidth(0.3);
    doc.line(30, 45, 180, 45);

    doc.setDrawColor(...accent);
    doc.setLineWidth(1);
    doc.addImage(MediDocs, "WEBP", 15, 15, 20, 20);

    autoTable(doc, {
      startY: 50,
      theme: "plain",
      margin: { left: 20, right: 20 },
      styles: { fontSize: 11, textColor: textDark[0], cellPadding: 2 },
      headStyles: { fontStyle: "bold", textColor: primary },
      alternateRowStyles: { fillColor: lightGray },
      head: [["Field", "Details"]],
      body: [
        ["Name", certificate.name],
        ["Email", certificate.email],
        ["Age", certificate.age],
        ["Gender", certificate.gender],
        ["Address", certificate.address],
        ["Employer", certificate.employer],
        ["Duration", `${certificate.duration} days`],
        ["Reason", certificate.reason],
        ["Symptoms", certificate.symptoms?.join(", ") || "N/A"],
        ["Duration of Illness", certificate.durationOfIllness],
        ["Medical History", certificate.medicalHistory],
        ["Medications", certificate.medications],
        ["Emergency Treatment", certificate.emergencyTreatment],
        ["Previous Surgeries", certificate.previousSurgeries],
        ["Family History", certificate.familyHistory],
        ["Environmental Cause", certificate.environmentalCause],
        ["Severity", certificate.severity],
        ["Consultation Status", certificate.consultationStatus],
        ["Certificate Purpose", certificate.certificatePurpose],
        ["Status", certificate.status],
      ],
    });

    const finalY = doc.lastAutoTable.finalY;

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primary);
    doc.text("Authorized Signatures", 20, finalY + 15);

    doc.setFillColor(248, 248, 248);
    doc.rect(18, finalY + 18, 174, 30, "F");

    doc.setFontSize(11.5);
    doc.setTextColor(...textDark);
    doc.setFont("helvetica", "bold");
    doc.text("Typed Signature:", 20, finalY + 25);
    doc.setFont("helvetica", "normal");
    doc.text(`${certificate.signature || "N/A"}`, 65, finalY + 25);

    doc.setFont("helvetica", "bold");
    doc.text("Digital Signature:", 20, finalY + 32);
    doc.setFont("helvetica", "normal");
    doc.text(`${certificate.digitalSignature || "N/A"}`, 65, finalY + 32);

    doc.setFont("helvetica", "bold");
    doc.text("Issued Date:", 20, finalY + 39);
    doc.setFont("helvetica", "normal");
    doc.text(`${new Date().toLocaleDateString()}`, 65, finalY + 39);

    doc.setDrawColor(...accent);
    doc.setLineWidth(0.2);
    doc.line(20, 285, 190, 285);

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "italic");
    doc.text(
      "This document is digitally generated by Medidocs — Your Trusted Medical Partner",
      105,
      290,
      { align: "center" }
    );

    doc.save(`Medical_Certificate_${certificate.name}_${title}.pdf`);
  };

  const generatePDFStyle2 = (certificate, title) => {
    const doc = new jsPDF("p", "mm", "a4");

    const primary = [0, 102, 204]; // Soft blue
    const accent = [192, 192, 192]; // Gray
    const textDark = [33, 33, 33];

    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 210, 297, "F");

    doc.setFillColor(...accent);
    doc.rect(15, 15, 180, 20, "F");

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont("times", "bold");
    doc.text("Medical Record", 105, 28, { align: "center" });

    doc.setDrawColor(...primary);
    doc.setLineWidth(0.8);
    doc.line(20, 40, 190, 40);

    doc.addImage(MediDocs, "WEBP", 15, 15, 20, 20);

    autoTable(doc, {
      startY: 45,
      theme: "grid",
      headStyles: {
        fillColor: primary,
        textColor: 255,
        fontStyle: "bold",
      },
      styles: {
        font: "times",
        fontSize: 11,
        textColor: textDark[0],
      },
      head: [["Field", "Details"]],
      body: [
        ["Name", certificate.name],
        ["Email", certificate.email],
        ["Age", certificate.age],
        ["Gender", certificate.gender],
        ["Address", certificate.address],
        ["Employer", certificate.employer],
        ["Duration", `${certificate.duration} days`],
        ["Reason", certificate.reason],
        ["Symptoms", certificate.symptoms?.join(", ") || "N/A"],
        ["Duration of Illness", certificate.durationOfIllness],
        ["Medical History", certificate.medicalHistory],
        ["Medications", certificate.medications],
        ["Emergency Treatment", certificate.emergencyTreatment],
        ["Previous Surgeries", certificate.previousSurgeries],
        ["Family History", certificate.familyHistory],
        ["Environmental Cause", certificate.environmentalCause],
        ["Severity", certificate.severity],
        ["Consultation Status", certificate.consultationStatus],
        ["Certificate Purpose", certificate.certificatePurpose],
        ["Status", certificate.status],
      ],
    });

    const y = doc.lastAutoTable.finalY + 10;

    doc.setFont("times", "bold");
    doc.setFontSize(12);
    doc.text("Authorized Signature", 20, y);

    doc.setFont("times", "normal");
    doc.text(`Signed by: ${certificate.signature || "N/A"}`, 20, y + 7);
    doc.text(
      `Digital Signature: ${certificate.digitalSignature || "N/A"}`,
      20,
      y + 14
    );
    doc.text(`Issued On: ${new Date().toLocaleDateString()}`, 20, y + 21);

    doc.save(`Medical_Certificate_${certificate.name}_${title}.pdf`);
  };

  const generatePDFStyle3 = (certificate, title) => {
    const doc = new jsPDF("p", "mm", "a4");
    const accent = [31, 195, 62];

    doc.setFillColor(245, 245, 245);
    doc.rect(0, 0, 210, 297, "F");

    doc.setTextColor(50, 50, 50);
    doc.setFont("courier", "bold");
    doc.setFontSize(20);
    doc.text(" Medical Certificate", 105, 25, {
      align: "center",
    });

    doc.setFontSize(10);
    doc.setFont("courier", "italic");
    doc.text("Verified by Medidocs", 105, 32, { align: "center" });

    doc.addImage(MediDocs, "WEBP", 15, 15, 20, 20);

    autoTable(doc, {
      startY: 40,
      theme: "striped",
      styles: {
        font: "courier",
        fontSize: 10,
        cellPadding: 1.5,
        textColor: 20,
      },
      headStyles: {
        fillColor: [80, 80, 80],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [235, 235, 235] },
      head: [["Field", "Details"]],
      body: [
        ["Name", certificate.name],
        ["Email", certificate.email],
        ["Age", certificate.age],
        ["Gender", certificate.gender],
        ["Address", certificate.address],
        ["Employer", certificate.employer],
        ["Duration", `${certificate.duration} days`],
        ["Reason", certificate.reason],
        ["Symptoms", certificate.symptoms?.join(", ") || "N/A"],
        ["Duration of Illness", certificate.durationOfIllness],
        ["Medical History", certificate.medicalHistory],
        ["Medications", certificate.medications],
        ["Emergency Treatment", certificate.emergencyTreatment],
        ["Previous Surgeries", certificate.previousSurgeries],
        ["Family History", certificate.familyHistory],
        ["Environmental Cause", certificate.environmentalCause],
        ["Severity", certificate.severity],
        ["Consultation Status", certificate.consultationStatus],
        ["Certificate Purpose", certificate.certificatePurpose],
        ["Status", certificate.status],
      ],
    });

    const y = doc.lastAutoTable.finalY + 10;

    doc.setFont("courier", "bold");
    doc.text("Authorized Signature", 20, y);

    doc.setFont("courier", "normal");
    doc.text(`Typed: ${certificate.signature || "N/A"}`, 20, y + 7);
    doc.text(`Digital: ${certificate.digitalSignature || "N/A"}`, 20, y + 14);
    doc.text(`Issued: ${new Date().toLocaleDateString()}`, 20, y + 21);

    doc.setFont("courier", "italic");
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text("Generated via Medidocs - Trusted Health Platform", 105, 290, {
      align: "center",
    });

    doc.save(`Medical_Certificate_${certificate.name}_${title}.pdf`);
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Title level={2} className="text-center text-teal-600">
          📄 Your Medical Certificates
        </Title>

        {loading ? (
          <div className="text-center mt-10">
            <Spin tip="Fetching your certificates..." size="large" />
          </div>
        ) : certificates.length === 0 ? (
          <Empty description="No certificates found." />
        ) : (
          certificates.map((certificate) => (
            <Card
              key={certificate._id}
              title={
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-teal-800">
                    {certificate.name}
                  </span>
                  <Tag
                    icon={
                      certificate.status === "Pending" ? (
                        <LoadingOutlined />
                      ) : (
                        <CheckCircleOutlined />
                      )
                    }
                    color={
                      certificate.status === "Pending" ? "warning" : "success"
                    }
                  >
                    {certificate.status}
                  </Tag>
                </div>
              }
              bordered
              className="mb-6 shadow-md rounded-xl"
            >
              <Paragraph>
                <Text strong>Email:</Text> {certificate.email}
              </Paragraph>

              {certificate.status === "Approved" && (
                <>
                  <Paragraph>
                    <Text strong>Typed Signature:</Text>{" "}
                    <Text italic>{certificate.signature || "N/A"}</Text>
                  </Paragraph>
                  <Paragraph>
                    <Text strong>Digital Signature:</Text>{" "}
                    <Text italic>{certificate.digitalSignature || "N/A"}</Text>
                  </Paragraph>

                  <Divider />

                  <Button
                    type="primary"
                    icon={<CreditCardOutlined />}
                    onClick={() => triggerDownload(certificate)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Pay & Download Certificate
                  </Button>
                </>
              )}

              {certificate.status === "Pending" && (
                <Paragraph type="secondary" italic>
                  ⏳ This certificate is still pending approval.
                </Paragraph>
              )}
            </Card>
          ))
        )}
      </div>

      {/* UPI Modal */}
      <Modal
        title="💳 UPI Payment"
        open={upiModalVisible}
        onCancel={() => setUpiModalVisible(false)}
        onOk={handlePayAndDownload}
        okText="Pay & Download"
        okButtonProps={{ icon: <DownloadOutlined /> }}
      >
        <div className="flex justify-center my-3">
          <QRCode value="9876543210@okaxis" size={160} />
        </div>

        <p className="text-center text-gray-600 font-medium text-lg mb-1">
          💳 Amount to Pay:{" "}
          <span className="text-black font-semibold">₹200</span>
        </p>

        <p className="text-center text-gray-600 mb-2 text-sm">
          Scan the QR or enter the UPI ID manually to simulate payment.
        </p>

        <Input
          placeholder="Enter UPI ID (e.g., 9876543210@okaxis)"
          value={upiInput}
          onChange={(e) => setUpiInput(e.target.value)}
          className="mt-2"
        />
      </Modal>

      {/* PDF Style Selection Modal */}
      <Modal
        title="📄 Choose Certificate Style"
        open={showPdfStyleModal}
        onCancel={() => setShowPdfStyleModal(false)}
        footer={null}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <Button
            type="default"
            onClick={() => handlePdfDownload(1)}
            className="bg-white border-teal-600 text-teal-600 hover:bg-teal-50"
          >
            Certificate 1
          </Button>
          <Button
            type="default"
            onClick={() => handlePdfDownload(2)}
            className="bg-white border-green-600 text-green-600 hover:bg-green-50"
          >
            Certificate 2
          </Button>
          <Button
            type="default"
            onClick={() => handlePdfDownload(3)}
            className="bg-white border-purple-600 text-purple-600 hover:bg-purple-50"
          >
            Certificate 3
          </Button>
        </div>
      </Modal>
    </Layout>
  );
};

export default Usercertificate;
