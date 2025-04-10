import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import API_ENDPOINTS from "../api/endpoints";
import { LoadingOutlined, CheckCircleOutlined } from "@ant-design/icons";

const Usercertificate = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleDownloadPDF = (certificate) => {
    const doc = new jsPDF("p", "mm", "a4");

    // Colors
    const primary = [34, 58, 94]; // Navy Blue
    const accent = [218, 165, 32]; // Golden
    const lightGray = [240, 240, 240];
    const textDark = [40, 40, 40];

    // Full Page Background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 210, 297, "F");

    // Border
    doc.setDrawColor(...accent);
    doc.setLineWidth(1.5);
    doc.rect(10, 10, 190, 277);

    // Header Block
    doc.setFillColor(...primary);
    doc.rect(10, 10, 190, 30, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("MEDICAL CERTIFICATE", 105, 25, { align: "center" });

    doc.setFontSize(10);
    doc.text("Issued by Medidocs Health Records", 105, 33, { align: "center" });

    // Divider
    doc.setDrawColor(...accent);
    doc.setLineWidth(0.3);
    doc.line(30, 45, 180, 45);

    // Certificate Info
    autoTable(doc, {
      startY: 50,
      theme: "plain",
      margin: { left: 20, right: 20 },
      styles: { fontSize: 11, textColor: textDark[0], cellPadding: 2 },
      headStyles: {
        fontStyle: "bold",
        textColor: primary,
      },
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

    // Signature Section
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primary);
    doc.text("Authorized Signatures", 20, finalY + 15);

    // Highlight Box (optional, adds emphasis)
    doc.setFillColor(248, 248, 248); // Light gray background
    doc.rect(18, finalY + 18, 174, 30, "F");

    // Labels + Values
    doc.setFontSize(11.5);
    doc.setTextColor(...textDark);

    // Typed Signature
    doc.setFont("helvetica", "bold");
    doc.text("Typed Signature:", 20, finalY + 25);
    doc.setFont("helvetica", "normal");
    doc.text(`${certificate.signature || "N/A"}`, 65, finalY + 25);

    // Digital Signature
    doc.setFont("helvetica", "bold");
    doc.text("Digital Signature:", 20, finalY + 32);
    doc.setFont("helvetica", "normal");
    doc.text(`${certificate.digitalSignature || "N/A"}`, 65, finalY + 32);

    // Issued Date
    doc.setFont("helvetica", "bold");
    doc.text("Issued Date:", 20, finalY + 39);
    doc.setFont("helvetica", "normal");
    doc.text(`${new Date().toLocaleDateString()}`, 65, finalY + 39);

    // Footer Branding
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

    doc.save(`Medical_Certificate_${certificate.name}.pdf`);
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-6 mt-10">
        <h1 className="text-4xl font-extrabold text-center text-teal-700 mb-10 tracking-wide">
          📄 Your Medical Certificates
        </h1>

        {loading ? (
          <p className="text-center text-gray-600 text-lg animate-pulse">
            Loading certificates...
          </p>
        ) : certificates.length > 0 ? (
          certificates.map((certificate) => (
            <div
              key={certificate._id}
              className="bg-white/70 backdrop-blur-lg border border-teal-200 shadow-xl p-6 rounded-2xl mb-8 transition-all duration-300 hover:shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-teal-800">
                  {certificate.name}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold shadow-sm inline-flex items-center gap-2 ${
                    certificate.status === "Pending"
                      ? "bg-yellow-400 text-yellow-900 animate-pulse"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {certificate.status === "Pending" && <LoadingOutlined />}
                  {certificate.status === "Approved" && <CheckCircleOutlined />}
                  {certificate.status}
                </span>
              </div>

              <p className="text-gray-700 mt-2">
                <strong>Email:</strong> {certificate.email}
              </p>

              {certificate.status === "Pending" ? (
                <p className="text-amber-700 font-medium mt-3 italic">
                  ⏳ {certificate.name}, your certificate is still pending
                  approval.
                </p>
              ) : (
                <>
                  <p className="text-green-700 font-medium mt-3">
                    ✅ {certificate.name}, your certificate has been approved.
                  </p>
                  <div className="mt-2 text-sm text-gray-700 space-y-1">
                    <p>
                      <strong>Typed Signature:</strong>{" "}
                      <span className="italic">
                        {certificate.signature || "N/A"}
                      </span>
                    </p>
                    <p>
                      <strong>Digital Signature:</strong>{" "}
                      <span className="italic">
                        {certificate.digitalSignature || "N/A"}
                      </span>
                    </p>
                  </div>

                  <button
                    onClick={() => handleDownloadPDF(certificate)}
                    className="mt-4 bg-gradient-to-r from-purple-400 to-purple-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:from-purple-500 hover:to-purple-700 transition-all"
                  >
                    📥 Download Certificate
                  </button>
                </>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-red-500 text-lg font-medium">
            No certificates found.
          </p>
        )}
      </div>
    </Layout>
  );
};

export default Usercertificate;
