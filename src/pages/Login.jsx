import React, { useState } from "react";
import { Form, Input, message } from "antd";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API_ENDPOINTS from "../api/endpoints";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  // Form handler
  const onFinishHandler = async (values) => {
    try {
      dispatch(showLoading());
      setLoading(true);
      const res = await axios.post(
        API_ENDPOINTS.login,
        values
      );
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-t from-gray-800 to-teal-400 p-6 md:p-0 ">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg relative z-10 bg-opacity-90">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Login here !!
        </h1>
        <Form
          layout="vertical"
          onFinish={onFinishHandler}
          className="space-y-4"
        >
          <Form.Item
            label="Email"
            name="email"
            className="font-semibold"
            rules={[
              {
                required: true,
                type: "email",
                message: "Please enter a valid email",
              },
            ]}
          >
            <Input className="w-full p-3 border border-gray-300 rounded-lg" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            className="font-semibold"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password className="w-full p-3 border border-gray-300 rounded-lg" />
          </Form.Item>
          <Link
            to="/register"
            className="block text-center text-blue-600 hover:underline"
          >
            New User? Register here!
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-lg font-semibold cursor-pointer bg-cyan-400 rounded-lg transition duration-300 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-blue-500 hover:to-cyan-400"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </Form>
      </div>
    </div>
  );
};

export default Login;