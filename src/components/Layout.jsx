import React from "react";
import { ADMIN_MENU } from "../Data/Data";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Badge, message } from "antd";

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    localStorage.clear();
    message.success("Logout Successfully");
    navigate("/login");
  };

  const handleSignup = () => {
    localStorage.clear();
    message.success("Registered Successfully");
    navigate("/register");
  };

  // doctor menu
  const USER_MENU = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Appointments",
      path: "/appointments",
    },
    {
      name: "Apply For Medical Certificate",
      path: "/medicalcert",
    },
    {
      name: "Doctor's Hub",
      path: "/doctorhub",
    },

    {
      name: "Apply Doctor",
      path: "/apply-doctor",
    },
    {
      name: "Certificate Status",
      path: "/certificatestatus",
    },

    {
      name: "Get Certificate",
      path: "/certificates",
    },
    {
      name: "Profile",
      path: `/user/profile/${user?._id}`,
    },
  ];

  const DOCTOR_MENU = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Appointments",
      path: "/doctor-appointments",
    },

    {
      name: "Certificate Requests",
      path: "/userhub",
    },

    {
      name: "List of Users applied for medical certificate",
      path: "/usersforcertificate",
    },
    {
      name: "Fetch Users Certificates",
      path: "/fetchcertificates",
    },
    {
      name: "Profile",
      path: `/doctor/profile/${user?._id}`,
    },
  ];
  // Determine Sidebar Menu based on Role
  const SIDEBAR_MENU = user?.isAdmin
    ? ADMIN_MENU
    : user?.isDoctor
    ? DOCTOR_MENU
    : USER_MENU;

  return (
    <div className="flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-72 bg-gradient-to-b from-teal-600 to-teal-800 text-white shadow-xl p-6 flex flex-col">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10">
          <h6 className="text-[14px] md:text-3xl font-extrabold tracking-widest text-center text-white">
            ＜MEDIDOC＞
          </h6>
          <hr className="w-full border-gray-300 my-6" />
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col  flex-grow space-y-0.5">
          {SIDEBAR_MENU.map((menu) => (
            <Link
              key={menu.name}
              to={menu.path}
              className={`flex items-center p-3 text-lg font-semibold rounded-lg transition-all duration-300 ${
                location.pathname === menu.path
                  ? "bg-teal-800 shadow-lg border-2 border-teal-600"
                  : "hover:bg-teal-700 hover:pl-6"
              }`}
            >
              <i className={`${menu.icon} mr-4 text-2xl`} />
              <span className="text-white">{menu.name}</span>
            </Link>
          ))}

          {/* Logout */}
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white p-6 shadow-lg flex items-center border-b-2 border-gray-200">
          {/* Left Section: User Profile & Name */}
          <div className="flex items-center space-x-4">
            <div
              className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 shadow-lg cursor-pointer"
              onClick={() => {
                navigate("/notification");
              }}
            >
              <Badge count={user?.notification.length}>
                <i className="fas fa-user text-lg text-gray-700 cursor-pointer"></i>
              </Badge>
            </div>
            <span className="text-lg text-gray-800 font-medium hover:text-teal-600 transition">
              <Link>
                Hello <b>{user?.name}</b>
              </Link>
            </span>
          </div>

          {/* Right Section: Logout & Signup - Pushed to Right */}
          <div className="flex items-center space-x-6 ml-auto">
            <div
              onClick={handleSignup}
              className="cursor-pointer text-lg text-teal-700 hover:text-teal-600 hover:underline transition-all rounded-lg flex items-center"
            >
              <i className="fas fa-user-plus mr-2 text-2xl" />
              Signup
            </div>

            <div
              onClick={handleLogout}
              className="cursor-pointer text-lg text-teal-700 hover:text-teal-600 hover:underline transition-all rounded-lg flex items-center"
            >
              <i className="fas fa-sign-out-alt mr-2 text-2xl" />
              Logout
            </div>
          </div>
        </header>

        {/* Main Body */}
        <main className="flex-1 p-8 bg-green-200 overflow-y-auto min-h-screen ">
          <div className="bg-white p-8 rounded-xl shadow-lg space-y-6 border border-gray-200">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
