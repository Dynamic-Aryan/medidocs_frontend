import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import API_ENDPOINTS from "../api/endpoints";
import { message } from "antd";

const BookingSuccess = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [bookingDone, setBookingDone] = useState(false);

  useEffect(() => {
    const bookAppointment = async () => {
      const doctorId = searchParams.get("doctorId");
      const date = searchParams.get("date");
      const time = searchParams.get("time");

      if (!doctorId || !date || !time || !user?._id) return;

      try {
        dispatch(showLoading());

        // 🔁 Fetch doctor info again to make sure it's fresh
        const doctorRes = await axios.post(
          API_ENDPOINTS.getDoctorById,
          { doctorId },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        const doctorInfo = doctorRes.data.data;

        // 📆 Book the appointment
        const res = await axios.post(
          API_ENDPOINTS.bookAppointment,
          {
            doctorId,
            userId: user._id,
            doctorInfo,
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
          setBookingDone(true);
        } else {
          message.error(res.data.message || "Booking failed.");
        }
      } catch (error) {
        dispatch(hideLoading());
        console.error(error);
        message.error("Something went wrong while booking.");
      }
    };

    bookAppointment();
  }, []);

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-screen bg-green-50">
        <div className="bg-white p-10 rounded-xl shadow text-center">
          <h1 className="text-3xl font-bold text-green-700 mb-4">🎉 Success!</h1>
          <p className="text-lg text-gray-700 mb-6">
            {bookingDone
              ? "Your payment was successful, and your appointment is now booked."
              : "Finalizing your appointment..."}
          </p>
          <a
            href="/"
            className="inline-block bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
          >
            Go to Home
          </a>
        </div>
      </div>
    </Layout>
  );
};

export default BookingSuccess;
