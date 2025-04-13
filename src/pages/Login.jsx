import React, { useState } from "react";
import { Form, Input, message } from "antd";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API_ENDPOINTS from "../api/endpoints";
import MediDocs from "../assets/aryanmd.webp";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const onFinishHandler = async (values) => {
    try {
      dispatch(showLoading());
      setLoading(true);
      const res = await axios.post(API_ENDPOINTS.login, values);
      window.location.reload();
      dispatch(hideLoading());

      if (res.data.success) {
        message.success("Login successful!");
        localStorage.setItem("token", res.data.token);
        navigate("/");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error("Login Error:", error);
      message.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center z-10 px-4 md:px-12 bg-gradient-to-t from-gray-800 to-teal-800">
      {/* left side */}
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-8">
      
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-10 shadow-lg flex flex-col justify-center">
         
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 mx-auto shadow-md overflow-hidden">
            <img
              src={MediDocs}
              alt="App Icon"
              className="w-10 h-10 object-contain"
            />
          </div>

          <h2 className="text-3xl font-bold text-yellow-200 text-center mb-6">
            Login to MediDocs
          </h2>

          <Form
            layout="vertical"
            onFinish={onFinishHandler}
            className="space-y-4"
          >
            <Form.Item
              label={<span className="text-white font-semibold">Email</span>}
              name="email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Please enter a valid email",
                },
              ]}
            >
              <Input
                placeholder="Email Please..."
                className="p-3 rounded-lg border border-gray-300"
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-white font-semibold">Password</span>}
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
              ]}
            >
              <Input.Password
                placeholder="Enter correct password..."
                className="p-3 rounded-lg border border-gray-300"
              />
            </Form.Item>

            <Link to="/register" className="block text-center  hover:underline">
              <h1 className="text-yellow-300">New User? Register here!</h1>
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 text-white font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg hover:from-blue-500 hover:to-cyan-500 transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </Form>
        </div>

        
        {/* Right Side */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-10 shadow-2xl flex flex-col justify-center text-white">
          <div className="flex flex-col items-center text-center space-y-6">
          
            <div className="w-24 h-24 bg-white rounded-full shadow-lg overflow-hidden flex items-center justify-center">
              <img
                src={MediDocs}
                alt="Welcome Icon"
                className="w-14 h-14 object-contain"
              />
            </div>

            <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-200">
              Welcome to MediDocs
            </h1>

          
            <p className="text-gray-200 text-lg max-w-md">
              Your smart portal for managing medical appointments & receiving
              certified health documentation.
            </p>

            
            <div className="mt-6 w-full max-w-md space-y-6">
              <div className="border-l-4 border-cyan-400 pl-4">
                <h3 className="text-xl font-semibold text-white">
                  Book Appointments
                </h3>
                <p className="text-sm text-white/80">
                  Schedule your medical visits anytime with verified
                  professionals across specialties.
                </p>
              </div>
              <div className="border-l-4 border-blue-400 pl-4">
                <h3 className="text-xl font-semibold text-white">
                  Certified Health Records
                </h3>
                <p className="text-sm text-white/80">
                  Access digitally signed medical certificates and prescriptions
                  — instantly.
                </p>
              </div>
              <div className="border-l-4 border-green-400 pl-4">
                <h3 className="text-xl font-semibold text-white">
                  Privacy-First Platform
                </h3>
                <p className="text-sm text-white/80">
                  Your health data stays secure with end-to-end encryption and
                  strict access controls.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
