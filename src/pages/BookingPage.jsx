import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { useParams } from "react-router-dom";
import { DatePicker, message, TimePicker } from "antd";
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

  // Fetch single doctor data
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

  //bookingfunction
  const handleBooking = async () => {
    try {
      setIsAvailable(true);
      if (!date && !time) {
        return alert("Date & Time Required");
      }

      dispatch(showLoading());
      const res = await axios.post(
        API_ENDPOINTS.bookAppointment,
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctors,
          date: date,
          userInfo: user,
          time: time,
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
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };


  //handleavailability
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
      if(res.data.success){
        setIsAvailable(true)
        console.log(isAvailable);
        message.success(res.data.message)
      }
      else{
        message.error(res.data.message)
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
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10 border border-teal-200">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Booking Page
        </h3>
        {doctors && (
          <div className="p-4 bg-gray-100 rounded-lg">
            <h4 className="text-xl font-bold text-gray-700">
              Dr. {doctors.firstName} {doctors.lastName}
            </h4>
            <p className="text-lg text-gray-600">
              Fees:{" "}
              <span className="font-semibold">
                ${doctors.feesPerConsultation}
              </span>
            </p>
            <p className="text-lg text-gray-600">
              Timings: <span className="font-semibold">{doctors.timings}</span>
            </p>

            <div className="mt-4 space-y-4">
              <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-1">
                  Select Date:
                </label>
                <DatePicker
                  className="w-full p-2 border rounded-md shadow-sm"
                  format="DD-MM-YYYY"
                  onChange={(value) =>

                   {
                 
                    setDate(moment(value).format("DD-MM-YYYY"))
                   }
                  }
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-1">
                  Select Time Range:
                </label>
                <TimePicker
                  className="w-full p-2 border rounded-md shadow-sm"
                  format="HH:mm"
                  onChange={(value) => 
                  {
                    
                    setTime(moment(value).format("HH:mm"))
                  }
                  }
                />
              </div>

              <button onClick={handleAvailability} className="w-full cursor-pointer bg-teal-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-300">
                Check Availability
              </button>
              <button
                onClick={handleBooking}
                className="w-full bg-gray-600 cursor-pointer text-white font-semibold py-2 rounded-md hover:bg-teal-700 transition duration-300"
              >
                Book Now
              </button>
              
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BookingPage;
