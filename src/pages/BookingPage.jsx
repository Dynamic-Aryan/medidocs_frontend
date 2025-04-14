import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { useParams } from "react-router-dom";
import { DatePicker, TimePicker, message, Modal, Input, QRCode } from "antd";
import moment from "moment";

import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import API_ENDPOINTS from "../api/endpoints";

const BookingPage = () => {
  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const [doctors, setDoctors] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [upiInput, setUpiInput] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch = useDispatch();

  const getDoctorData = async () => {
    try {
      const res = await axios.post(
        API_ENDPOINTS.getDoctorById,
        { doctorId: params.doctorId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching doctor data:", error);
    }
  };

  const handleBooking = async () => {
    if (!date || !time) {
      return message.error("Please select both date and time.");
    }

    try {
      dispatch(showLoading());
      const res = await axios.post(
        API_ENDPOINTS.bookAppointment,
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctors,
          userInfo: user,
          date,
          time,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success("Appointment booked successfully!");
        setIsModalVisible(false);
        setUpiInput("");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  const handleAvailability = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        API_ENDPOINTS.bookingAvailability,
        {
          doctorId: params.doctorId,
          date,
          time,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());

      if (res.data.success) {
        setIsAvailable(true);
        message.success(res.data.message);
      } else {
        setIsAvailable(false);
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  const validateUPI = (upi) => {
    return /^[0-9]{10}@(ybl|ibl|axl|okaxis|okpaytm)$/.test(upi);
  };

  const openPaymentModal = () => {
    if (!date || !time) {
      return message.error("Please select date & time before payment.");
    }
    // if (!isAvailable) {
    //   return message.warning("Check availability before confirming.");
    // }
    setIsModalVisible(true);
  };

  const confirmDummyPayment = () => {
    if (!validateUPI(upiInput)) {
      return message.error("Invalid UPI ID. Use format like 9876543210@okaxis");
    }
    handleBooking(); // trigger appointment booking
  };

  useEffect(() => {
    getDoctorData();
  }, []);

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl w-full bg-white shadow-xl rounded-3xl p-8 space-y-6">
          <h2 className="text-3xl font-bold text-gray-800 text-center">
            Book Your Appointment
          </h2>

          {doctors && (
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-6 shadow-inner">
              <div className="text-center mb-4">
                <h3 className="text-2xl font-semibold text-teal-800">
                  Dr. {doctors.firstName} {doctors.lastName}
                </h3>
                <p className="text-gray-600">Fees: ₹200</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">
                    Select Date:
                  </label>
                  <DatePicker
                    className="w-full rounded-md border border-gray-300 p-2"
                    format="DD-MM-YYYY"
                    onChange={(value) =>
                      setDate(moment(value).format("DD-MM-YYYY"))
                    }
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-1 font-medium">
                    Select Time:
                  </label>
                  <TimePicker
                    className="w-full rounded-md border border-gray-300 p-2"
                    format="HH:mm"
                    onChange={(value) => setTime(moment(value).format("HH:mm"))}
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col md:flex-row gap-4">
                <button
                  onClick={handleAvailability}
                  className="w-full bg-teal-600 hover:bg-teal-700 transition-all text-white font-semibold py-2 px-4 rounded-md shadow"
                >
                  Check Availability
                </button>

                <button
                  onClick={openPaymentModal}
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-all text-white font-semibold py-2 px-4 rounded-md shadow"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        title="🔐 Payment Gateway"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <div className="flex justify-center my-3">
          <QRCode value="9876543210@okaxis" size={160} />
        </div>

        <p className="text-center text-gray-600 font-medium text-lg mb-1">
          💳 Amount to Pay:{" "}
          <span className="text-black font-semibold">
            ₹{doctors?.feesPerConsultation || 200}
          </span>
        </p>
        <p className="text-center text-gray-600 mb-3 text-sm">
          Scan the QR or enter the UPI ID to simulate payment
        </p>

        <Input
          placeholder="Enter UPI ID (e.g., 9876543210@okaxis)"
          value={upiInput}
          onChange={(e) => setUpiInput(e.target.value)}
          className="mt-2"
        />

        <button
          onClick={confirmDummyPayment}
          className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold transition-all"
        >
          ✅ Pay & Book Appointment
        </button>
      </Modal>
    </Layout>
  );
};

export default BookingPage;
