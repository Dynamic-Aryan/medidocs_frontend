import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { useParams } from "react-router-dom";
import { DatePicker, TimePicker, message } from "antd";
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
        message.success(res.data.message);
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
                <p className="text-gray-600">Fees: ${doctors.feesPerConsultation}</p>
                <p className="text-gray-600">Timings: {doctors.timings}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">Select Date:</label>
                  <DatePicker
                    className="w-full rounded-md border border-gray-300 p-2"
                    format="DD-MM-YYYY"
                    onChange={(value) =>
                      setDate(moment(value).format("DD-MM-YYYY"))
                    }
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-1 font-medium">Select Time:</label>
                  <TimePicker
                    className="w-full rounded-md border border-gray-300 p-2"
                    format="HH:mm"
                    onChange={(value) =>
                      setTime(moment(value).format("HH:mm"))
                    }
                  />
                </div>
              </div>

              {isAvailable !== null && (
                <div className={`mt-4 text-center text-lg font-semibold ${isAvailable ? "text-green-600" : "text-red-500"}`}>
                  {isAvailable ? "Time Slot is Available" : "Time Slot Unavailable"}
                </div>
              )}

              <div className="mt-6 flex flex-col md:flex-row gap-4">
                <button
                  onClick={handleAvailability}
                  className="w-full bg-teal-600 hover:bg-teal-700 transition-all text-white font-semibold py-2 px-4 rounded-md shadow"
                >
                  Check Availability
                </button>

                <button
                  onClick={handleBooking}
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-all text-white font-semibold py-2 px-4 rounded-md shadow"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BookingPage;
