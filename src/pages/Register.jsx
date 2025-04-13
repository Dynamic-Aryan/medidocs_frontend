import React, { useState } from "react";
import { Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import axios from "axios";
import API_ENDPOINTS from "../api/endpoints";
import MediDocs from "../assets/aryanmd.webp";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // Form handler
  const onFinishHandler = async (values) => {
    try {
      dispatch(showLoading());
     
      const res = await axios.post(
        API_ENDPOINTS.register,
        values
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success("Registered successfully!");
        navigate("/login");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error("Registration Error:", error);
      message.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center z-10 px-4 md:px-12 bg-gradient-to-t from-teal-800 to-gray-800 p-6 md:p-0">
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
            Register to MediDocs
          </h2>
        <Form
          layout="vertical"
          onFinish={onFinishHandler}
          className="space-y-4"
        >
          <Form.Item
            label={<span className="text-white font-semibold">Full Name Please</span>}
            name="name"
            className="font-semibold"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input placeholder="Name Please..." className="w-full p-3 border border-gray-300 rounded-lg" />
          </Form.Item>
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
          <Link
            to="/login"
            className="block text-center  hover:underline"
          >
            <h1 className="text-yellow-300">Already have an account? Login here.</h1>
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-lg font-semibold cursor-pointer bg-cyan-400 rounded-lg transition duration-300 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-blue-500 hover:to-cyan-400"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </Form>
      </div>
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

export default Register;