import React from "react";
import Layout from "../components/Layout";
import { message, Tabs } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_ENDPOINTS from "../api/endpoints";

const NotificationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const handleMarkAllRead = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        API_ENDPOINTS.getAllNotifications,
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());

      if (res.data.success) {
        message.success(res.data.message);
        dispatch({
          type: "UPDATE_NOTIFICATIONS",
          payload: {
            notification: res.data.data.notification,
            seennotification: res.data.data.seennotification,
          },
        });
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something went wrong");
    }
  };

  const handleDeleteAllRead = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        API_ENDPOINTS.deleteAllNotifications,
        { userId: user._id },
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
      message.error("Something went wrong in notifications");
    }
  };

  return (
    <Layout>
      <div >
        <h1 className="text-2xl font-bold text-center mb-4">Notifications</h1>
        <Tabs defaultActiveKey="0" centered>
          <Tabs.TabPane tab="Unread" key="0">
            <div className="flex justify-center mb-4 text-white">
              <button
                className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition cursor-pointer"
                onClick={handleMarkAllRead}
              >
                Mark all as read
              </button>
            </div>
            <div className="space-y-3">
              {user?.notification.map((notificationMsg, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition"
                  onClick={() => navigate(notificationMsg.onClickPath)}
                >
                  {notificationMsg.message}
                </div>
              ))}
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Read" key="1">
            <div className="flex justify-center mb-4 text-white">
              <button
                className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition cursor-pointer"
                onClick={handleDeleteAllRead}
              >
                Delete all read
              </button>
            </div>
            <div className="space-y-3">
              {user?.seennotification.map((notificationMsg, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition"
                  onClick={() => navigate(notificationMsg.onClickPath)}
                >
                  {notificationMsg.message}
                </div>
              ))}
            </div>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </Layout>
  );
};

export default NotificationPage;
