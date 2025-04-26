import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { useParams } from "react-router-dom";
import { DatePicker, TimePicker, message, Modal, Input, Checkbox, Button } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import API_ENDPOINTS from "../api/endpoints";
import { loadStripe } from "@stripe/stripe-js";

const BookingPage = () => {
  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const [doctors, setDoctors] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvc: "",
    cardholderName: "",
    isReadyToPay: false,
  });
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

  const confirmStripePayment = async () => {
    if (!date || !time) {
      return message.error("Please select date & time before payment.");
    }

    try {
      dispatch(showLoading());

      const res = await axios.post(
        "http://localhost:5000/api/stripe/create-checkout-session", // This part remains as is
        {
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

      // Redirect to Stripe's checkout page
      const stripe = await loadStripe("pk_test_51PbeidK3tWKjvi0A05VrsEHh5amXR5evAH56Q2y1mkzoYupqqZMxYxIMbuGiqrIJpI6OOGcQaeFCMJkPpU4QwjF900B45pnI49"); // replace with your actual public key
      const result = await stripe.redirectToCheckout({
        sessionId: res.data.id,
      });

      // Handle if payment was successful
      if (result.error) {
        return message.error("Payment failed. Try again.");
      }

      // Payment successful, proceed to book the appointment
      await handleBooking();

      // Save necessary info for the success page to use
      localStorage.setItem("doctorDetails", JSON.stringify(doctors));
      localStorage.setItem("appointmentDetails", JSON.stringify({ date, time }));
    } catch (err) {
      dispatch(hideLoading());
      message.error("Payment failed. Try again.");
    }
  };

  const handleOtherPayment = () => {
    if (!cardInfo.cardNumber || !cardInfo.expiryDate || !cardInfo.cvc || !cardInfo.cardholderName) {
      return message.error("Please fill in all the card details.");
    }
    if (!cardInfo.isReadyToPay) {
      return message.error("Please agree to the payment terms.");
    }

    // Simulate payment success
    setShowPaymentModal(false);
    handleBooking();
  };

  useEffect(() => {
    getDoctorData();
  }, []);

  return (
    <Layout>
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full bg-white shadow-xl rounded-3xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-gray-800 text-center">Book Your Appointment</h2>
  
        {doctors && (
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-6 shadow-inner">
            <div className="text-center mb-4">
              <h3 className="text-2xl font-semibold text-teal-800">
                Dr. {doctors.firstName} {doctors.lastName}
              </h3>
              <p className="text-gray-600">Fees: ₹{doctors.feesPerConsultation || 200}</p>
            </div>
  
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div>
                <label className="block text-gray-700 mb-1 font-medium">Select Date:</label>
                <DatePicker
                  className="w-full rounded-md border border-gray-300 p-2"
                  format="DD-MM-YYYY"
                  onChange={(value) => setDate(moment(value).format("DD-MM-YYYY"))}
                />
              </div>
  
              <div>
                <label className="block text-gray-700 mb-1 font-medium">Select Time:</label>
                <TimePicker
                  className="w-full rounded-md border border-gray-300 p-2"
                  format="HH:mm"
                  onChange={(value) => setTime(moment(value).format("HH:mm"))}
                />
              </div>
            </div>
  
            <div className="mt-6 flex flex-col md:flex-row gap-4">
              <Button
              type="primary"
                onClick={handleAvailability}
                className="w-full bg-teal-600 hover:bg-teal-700 transition-all text-white font-semibold py-2 px-4 rounded-md shadow"
              >
                Check Availability
              </Button>
  
              <Button
              type="link"
                onClick={confirmStripePayment}
                className="w-full bg-cyan-600 hover:bg-cyan-700 transition-all text-white font-semibold py-2 px-4 rounded-md shadow"
              >
                Confirm Booking with Stripe
              </Button>
  
              <Button
              type="dashed"
                onClick={() => setShowPaymentModal(true)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 transition-all text-white font-semibold py-2 px-4 rounded-md shadow"
              >
                Other Payment Options
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  
    {/* Tailwind Payment Modal */}
    {showPaymentModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-800">Enter Card Details</h2>

      <div className="space-y-5">
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Card Number</label>
          <input
            type="text"
            placeholder="1234 5678 9012 3456"
            value={cardInfo.cardNumber}
            onChange={(e) =>
              setCardInfo({ ...cardInfo, cardNumber: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700 font-medium">Expiry Date</label>
          <input
            type="text"
            placeholder="MM/YY"
            value={cardInfo.expiryDate}
            onChange={(e) =>
              setCardInfo({ ...cardInfo, expiryDate: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700 font-medium">CVC</label>
          <input
            type="text"
            placeholder="CVC"
            value={cardInfo.cvc}
            onChange={(e) =>
              setCardInfo({ ...cardInfo, cvc: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700 font-medium">Cardholder Name</label>
          <input
            type="text"
            placeholder="John Doe"
            value={cardInfo.cardholderName}
            onChange={(e) =>
              setCardInfo({ ...cardInfo, cardholderName: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={cardInfo.isReadyToPay}
            onChange={(e) =>
              setCardInfo({ ...cardInfo, isReadyToPay: e.target.checked })
            }
            className="h-5 w-5 text-blue-600"
          />
          <span className="ml-2 text-gray-700">I am ready to pay</span>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          onClick={() => setShowPaymentModal(false)}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={handleOtherPayment}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          disabled={!cardInfo.isReadyToPay}
        >
          Complete Payment
        </button>
      </div>
    </div>
  </div>
)}

  </Layout>
  
  );
};

export default BookingPage;
