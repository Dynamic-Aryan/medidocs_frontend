import React, { useState } from "react";
import { ADMIN_MENU } from "../Data/Data";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Badge, message } from "antd";
import { FiLogOut, FiUserPlus, FiBell, FiHome, FiCalendar, FiUsers, FiUser, FiClipboard, FiFileText, FiDownloadCloud } from "react-icons/fi";
import Medidocs from "../assets/medidocs.webp";
import Logo from "../assets/aryanmd.webp";

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    message.success("Logged out successfully");
    navigate("/login");
  };

  const handleSignup = () => {
    localStorage.clear();
    message.success("Registered successfully");
    navigate("/register");
  };

  const USER_MENU = [
    { name: "Home", path: "/" , icon: <FiHome /> },
    { name: "Your Appointments", path: "/appointments" , icon: <FiCalendar />},
    { name: "Medical Certificate Apply Here", path: "/medicalcert", icon: <FiDownloadCloud />  },
    { name: "Find Doctors", path: "/doctorhub" , icon: <FiUsers />},
    { name: "Become a Doctor", path: "/apply-doctor" , icon: <FiUser />},
    { name: "Your Certificate Status", path: "/certificatestatus" , icon: <FiClipboard /> },
    { name: "Get Your Certificate", path: "/certificates", icon: <FiFileText /> },
    { name: "Profile", path: `/user/profile/${user?._id}`, icon: <FiUser /> },
  ];

  const DOCTOR_MENU = [
    { name: "Home", path: "/", icon: <FiHome />  },
    { name: "Appointments", path: "/doctor-appointments" , icon: <FiCalendar />},
    { name: "User List", path: "/usersforcertificate" , icon: <FiUsers />},
    { name: "Certificate Requests", path: "/userhub" , icon: <FiClipboard />},
    { name: "Issued Certificates", path: "/fetchcertificates", icon: <FiFileText /> },
    { name: "Profile", path: `/doctor/profile/${user?._id}` , icon: <FiUser />},
  ];

  const SIDEBAR_MENU = user?.isAdmin
    ? ADMIN_MENU
    : user?.isDoctor
    ? DOCTOR_MENU
    : USER_MENU;

  return (
    <div className="flex h-screen font-[Poppins] bg-[#f1f5f8] overflow-hidden">
      
      {/* Sidebar */}
      <aside
        className={`relative ${
          collapsed ? "w-20" : "w-72"
        } bg-gradient-to-b from-[#016b65] to-[#029c8f] text-white shadow-xl p-4 flex flex-col transition-all duration-300`}
      >
        {/* Toggle Button */}
        <button
          className="absolute top-4 right-6 text-white text-xl bg-gray-400 hover:bg-gray-300 cursor-pointer p-2 rounded-full shadow-md transition-all duration-200"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? "☰" : "←"}
        </button>

        {/* Logo Section */}
        <div className="flex items-center justify-center mt-14 mb-10">
          <img src={Logo} alt="Icon" className="h-10 w-10 rounded-full object-cover" />
          {!collapsed && (
            <img
              src={Medidocs}
              alt="MediDocs"
              className="h-12 ml-3 object-contain"
            />
          )}
        </div>

        {/* Menu Links */}
        <nav className="flex flex-col gap-2 flex-grow">
          {SIDEBAR_MENU.map((menu) => (
            <Link
              key={menu.name}
              to={menu.path}
              className={`flex items-center ${
                collapsed ? "justify-center" : "justify-start gap-4"
              } p-3 rounded-lg text-xl font-medium hover:bg-[#027e72] transition-all ${
                location.pathname === menu.path ? "bg-[#016f63]" : ""
              }`}
            >
              <div className="text-2xl">{menu.icon}</div>
              {!collapsed && menu.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        
        {/* Header */}
        <header className="flex justify-between items-center bg-white p-6 shadow-sm border-b border-gray-200">
          <div className="flex items-center gap-4">
            <Badge count={user?.notification.length}>
              <div
                onClick={() => navigate("/notification")}
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200"
              >
                <FiBell className="text-[#029c8f] text-xl" />
              </div>
            </Badge>
            <span className="text-lg text-gray-800 font-semibold">
              Hello, <b>{user?.name}</b>
            </span>
          </div>

          {/* Right buttons */}
          <div className="flex items-center gap-6">
            <div
              onClick={handleSignup}
              className="flex items-center cursor-pointer text-[#016b65] hover:text-[#014f56] font-medium"
            >
              <FiUserPlus className="mr-2" /> Signup
            </div>

            <div
              onClick={handleLogout}
              className="flex items-center cursor-pointer text-[#016b65] hover:text-[#014f56] font-medium"
            >
              <FiLogOut className="mr-2" /> Logout
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto bg-[#e6f2f8]">
          <div className="bg-white rounded-xl p-8 shadow-md border border-gray-100">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
