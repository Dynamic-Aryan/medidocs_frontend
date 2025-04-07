import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import API_ENDPOINTS from "../api/endpoints";

const Usercertificate = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCertificates = async () => {
    try {
      const res = await axios.get(
        API_ENDPOINTS.userMedicalCertificateStatus,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
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
  
    // Background Color
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 210, 297, "F");
  
    // Border - Cyan & Gray Theme
    doc.setDrawColor(60, 180, 200); // Cyan
    doc.setLineWidth(2);
    doc.rect(10, 10, 190, 277);
  
    // Title - MEDICAL CERTIFICATE
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(30, 150, 170); // Cyan
    doc.text("MEDICAL CERTIFICATE", 105, 30, { align: "center" });
  
    // Subheading
    doc.setFontSize(12);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100, 100, 100); // Gray
    doc.text("Official Health Record", 105, 38, { align: "center" });
  
    // Divider Line
    doc.setDrawColor(150, 150, 150); // Light Gray
    doc.setLineWidth(0.5);
    doc.line(40, 45, 170, 45);
  
    // Certificate Details Table
    autoTable(doc, {
      startY: 55,
      theme: "plain",
      styles: { fontSize: 11, textColor: 50 },
      headStyles: { fillColor: [30, 150, 170], textColor: 255, fontStyle: "bold" }, // Cyan Header
      alternateRowStyles: { fillColor: [230, 230, 230] }, // Light Gray Rows
      margin: { left: 20, right: 20 },
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
        ["Duration Of Illness", certificate.durationOfIllness],
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
  
    // Issued Date
    const currentDate = new Date().toLocaleDateString();
    doc.setFontSize(11);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(80, 80, 80);
    doc.text(`Issued Date: ${currentDate}`, 20, doc.lastAutoTable.finalY + 15);
  
    // Watermark - MEDIDOCS
    doc.setTextColor(200, 200, 200);
    doc.setFontSize(35);
    doc.setFont("helvetica", "bold");
    doc.text("MEDIDOCS", 105, 250, { align: "center", angle: 20 });
  
    // Save PDF
    doc.save(`Medical_Certificate_${certificate.name}.pdf`);
  };
  
  


  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 bg-teal-50 shadow-xl rounded-lg mt-6 border border-teal-200">
        <h1 className="text-3xl font-bold text-teal-800 mb-6 text-center uppercase">
          Your Medical Certificates
        </h1>

        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : certificates.length > 0 ? (
          certificates.map((certificate) => (
            <div
              key={certificate._id}
              className="bg-white p-6 rounded-lg shadow-md border-l-8 border-teal-700 mb-6"
            >
              <h2 className="text-xl font-bold text-teal-800 flex items-center">
                <span className="mr-2">📜</span> {certificate.name}
              </h2>
              <p className="text-gray-700">
                <strong>Email:</strong> {certificate.email}
              </p>
              <p className="text-gray-700">
                <strong>Status:</strong>{" "}
                <span
                  className={`ml-2 px-3 py-1 text-white rounded-full ${
                    certificate.status === "Pending"
                      ? "bg-yellow-500"
                      : "bg-green-600"
                  }`}
                >
                  {certificate.status}
                </span>
              </p>
              {certificate.status === "Pending" ? (
                <p className="text-amber-800 font-medium">
                  {certificate.name}, your certificate approval is Pending!!!.
                </p>
              ) : (
                <p className="text-yellow-700">
                  {certificate.name}, your certificate is Approved .{" "}
                  <button
                    onClick={() => handleDownloadPDF(certificate)}
                    className="ml-2 bg-purple-300 px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-purple-200 transition-all cursor-pointer"
                  >
                    Download Here
                  </button>
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-red-500">No certificates found.</p>
        )}
      </div>
    </Layout>
  );
};

export default Usercertificate;
