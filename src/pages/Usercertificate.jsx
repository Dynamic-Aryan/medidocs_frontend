import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import jsPDF from "jspdf";
import API_ENDPOINTS from "../api/endpoints";
import MediDocs from "../assets/aryanmd.webp";

import {
  LoadingOutlined,
  CheckCircleOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import {
 
  Card,
  Typography,
  Tag,
  Button,
  Divider,
  Empty,
  Spin,
  message,
} from "antd";

const { Title, Text, Paragraph } = Typography;

const Usercertificate = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
    const [approvedDoctors, setApprovedDoctors] = useState([]);


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


  useEffect(() => {
    // Fetch the certificates
    fetchCertificates();
  }, []);



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

  const triggerDownload = (certificate) => {
    setSelectedCertificate(certificate);
    generateMedidocsCertificate(certificate);  
  };

  

  const getBase64FromUrl = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const generateMedidocsCertificate = async (certificate) => {
    try {
      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();
  
      const primaryColor = [33, 103, 168];
      const darkColor = [30, 30, 30];
      const lightBlue = [173, 216, 230];
      const lightCyan = [224, 255, 255];
  
      const headerHeight = 40;
      const footerHeight = 30;
      const footerY = 265;
  
      // HEADER
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, pageWidth, headerHeight, "F");
  
      if (typeof MediDocs !== "undefined") {
        doc.addImage(MediDocs, "WEBP", 10, 8, 20, 20);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.setTextColor(255, 255, 255);
        doc.text("Medidocs Organization", 35, 20);
      }
  
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
  
      const doctor = approvedDoctors.find(
        (doc) => doc._id === certificate.doctorId
      );
  
      // prepare doctor name
      const doctorName = doctor
        ? `Dr. ${doctor.firstName} ${doctor.lastName}`
        : `Dr. ${certificate.signature || "Unknown"}`;
  
      const doctorSpecialization = doctor
        ? doctor.specialization
        : "General Medicine";
  
      // Add doctor info at top right
      doc.text(doctorName, pageWidth - 10, 20, { align: "right" });
      doc.text(doctorSpecialization, pageWidth - 10, 26, { align: "right" });
  
      // Draw light cyan background
      const contentAreaHeight = footerY - headerHeight;
      doc.setFillColor(...lightCyan);
      doc.rect(0, headerHeight, pageWidth, contentAreaHeight, "F");
  
      // SICK LEAVE TITLE
      const titleY = headerHeight + 10;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(...darkColor);
      doc.text("SICK LEAVE CERTIFICATE", pageWidth / 2, titleY, { align: "center" });
  
      // Blue line under title
      doc.setDrawColor(...lightBlue);
      doc.line(20, titleY + 2, pageWidth - 20, titleY + 2);
  
      // Issue Date and Doc No
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...darkColor);
      const issueDate = new Date(certificate.createdAt).toLocaleDateString();
      doc.text(`Issue Date: ${issueDate}`, 20, headerHeight + 25);
      doc.text(`Document No.: ${certificate.userId}`, pageWidth - 20, headerHeight + 25, { align: "right" });
  
      // Employer Info
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("To,", 20, headerHeight + 37);
      doc.text(`${certificate.employer} Pvt Ltd`, 20, headerHeight + 44);
  
      // Paragraph
      const paragraphY = headerHeight + 55;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(...darkColor);
  
      const paragraph = `This is to certify that I, ${doctorName}, after a detailed online consultation, have examined Mr. ${certificate.name}, a ${certificate.age}-year-old ${certificate.gender}, residing at ${certificate.address}.
  
  Upon assessment, the patient reported symptoms of ${certificate.symptoms.join(
        ", "
      )}, leading to a clinical diagnosis of ${certificate.reason}. The illness has persisted for approximately ${certificate.durationOfIllness} day(s) and is currently assessed as ${certificate.severity} in nature. The patient’s past medical history, surgical history, family history, and environmental factors were reviewed and found to be unremarkable. No emergency treatments have been undertaken to date.
  
  Current medications and clinical findings were evaluated, and based on the symptoms and severity, it is advised that Mr. ${certificate.name} be granted a rest period of ${certificate.duration} day(s) to facilitate complete recovery.
  
  This certificate is issued upon the patient's request to support leave of absence from duties at ${certificate.employer} for ${certificate.certificatePurpose} purposes. It is emphasized that this certificate is based solely on the symptoms and history provided during the online consultation.`;
  
      const lines = doc.splitTextToSize(paragraph, 170);
      doc.text(lines, 20, paragraphY);
  
      // Links
      let linkY = paragraphY + lines.length * 7 - 18;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(0, 102, 204);
  
      doc.textWithLink("View Identity Proof", 20, linkY, {
        url: certificate.identityProofUrl || "#",
      });
      doc.textWithLink("View Medical Report", 60, linkY, {
        url: certificate.reportFileUrl || "#",
      });
  
      // Signature
      let signY = linkY + 20;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(...darkColor);
      doc.text("Patient's Name :", 20, signY);
  
      doc.setFont("helvetica", "normal");
      doc.text(`${certificate.name}`, 50, signY);
  
      if (certificate.signatureImageUrl) {
        try {
          const signatureBase64 = await getBase64FromUrl(certificate.signatureImageUrl);
          doc.addImage(signatureBase64, "PNG", 130, signY - 5, 50, 20);
        } catch (error) {
          console.error("Error loading signature image", error);
        }
      }
  
      doc.setFont("helvetica", "bold");
      doc.text(doctorName, 135, signY + 20);
      
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.text(`Digitally Signed on ${new Date().toLocaleString()}`, 135, signY + 26);
      

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(...darkColor);
      doc.text(`Dr. ${certificate.signature}`, pageWidth - 20, footerY - 15,{
        align:"right",
      });
      // FOOTER
      doc.setFillColor(...primaryColor);
      doc.rect(0, footerY, pageWidth, footerHeight, "F");
  
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
  
      const footerText =
        "This certificate is digitally issued by Medidocs — your trusted health partner. " +
        "This medical certificate is not valid without the document number, doctor's signature, identity proof URL, and report URL. " +
        "The details mentioned in this medical document are as per the symptoms shared by the patient during the online consultation. " +
        "Neither the doctor nor Medidocs Organization holds responsibility if false information was provided.";
  
      const footerLines = doc.splitTextToSize(footerText, pageWidth - 40);
      doc.text(footerLines, 20, footerY + 7);
  
      // Save PDF
      doc.save(`Medical_Certificate_${certificate.name}.pdf`);
    } catch (error) {
      console.error("Error generating certificate:", error);
    }
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
                   Download Certificate
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

    </Layout>
  );
};

export default Usercertificate;
