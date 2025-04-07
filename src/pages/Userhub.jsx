import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import UsersCertData from '../Data/UsersCertData';
import API_ENDPOINTS from '../api/endpoints';

const Userhub = () => {
  const [users, setUsers] = useState([]);

  // Fetch all users
  const getUsersData = async () => {
    try {
      const res = await axios.get(
        API_ENDPOINTS.getAllUsersCert,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsersData();
  }, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Users Applied for Certificate</h1>
        {users.length === 0 ? (
          <p className="text-gray-600 text-center">No users have applied.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {users.map((user) => (
              <UsersCertData key={user._id} user={user} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Userhub;
