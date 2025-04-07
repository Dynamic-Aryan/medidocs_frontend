import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { showLoading, hideLoading } from "../../redux/features/alertSlice";
import axios from "axios";
import { Form, Input, message } from "antd";
import API_ENDPOINTS from '../../api/endpoints';

const Profileuser = () => {
    const { user } = useSelector((state) => state.user);
    const [puser, setPuser] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
       
    const handleFinish = async (values) => {
        try {
          dispatch(showLoading());
          const res = await axios.post(
            API_ENDPOINTS.updateUserProfile,
            {
              ...values,
              userId: user._id,
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
            navigate("/");
          } else {
            message.error(res.data.success);
          }
        } catch (error) {
          dispatch(hideLoading());
          console.log(error);
          message.error("Something Went Wrong");
        }
    };

    const getUserInfo = async () => {
        try {
            const res = await axios.post(
              API_ENDPOINTS.getUserInfo,
              { userId: params.id },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            if (res.data.success) {
                setPuser(res.data.data);
            }
        } catch (error) {
            console.log(error);
        } 
    };

    useEffect(() => {
        getUserInfo();
    }, []);

    return (
        <Layout>
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg mt-6">
                <h1 className="text-2xl font-bold text-center mb-6">Manage Profile</h1>
                {puser && (
                    <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                        <p><strong>Name:</strong> {puser.name}</p>
                        <p><strong>Email:</strong> {puser.email}</p>
                    </div>
                )}
                {puser && (
                    <Form
                        layout="vertical"
                        onFinish={handleFinish}
                        className="space-y-6"
                        initialValues={{ name: puser.name, email: puser.email }}
                    >
                        <h4 className="text-lg font-semibold mb-4">Personal Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Form.Item label="Name" name="name" rules={[{ required: true }]}> 
                                <Input className="w-full p-2 border rounded" placeholder="Your first name" />
                            </Form.Item>
                            <Form.Item label="Email" name="email" rules={[{ required: true }]}> 
                                <Input className="w-full p-2 border rounded" placeholder="Your email address" />
                            </Form.Item>
                        </div>
                        <div className="flex justify-center mt-4">
                            <button className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition duration-300">Update</button>
                        </div>
                    </Form>
                )}
            </div>
        </Layout>
    );
};

export default Profileuser;
