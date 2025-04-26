import { FiHome, FiCalendar, FiUser, FiUsers, FiFileText, FiClipboard, FiEdit } from "react-icons/fi";
import { MdOutlineMedicalServices } from "react-icons/md"; 

export const ADMIN_MENU = [
  {
    name: "Home",
    path: "/",
    icon: <FiHome />
  },
  {
    name: "All Appointments",
    path: "/admin/allappointments",
    icon: <FiCalendar />
  },
  {
    name: "All Doctors",
    path: "/doctorhub",
    icon: <FiUser />
  },
  {
    name: "Certificate Requests",
    path: "/userhub",
    icon: <FiClipboard />
  },
  {
    name: "List Of Doctors",
    path: "/admin/doctors",
    icon: <FiUsers />
  },
  {
    name: "List Of Users",
    path: "/admin/users",
    icon: <FiUsers />
  },
  {
    name: "Change User Status",
    path: "/admin/changestatus",
    icon: <FiEdit />
  },
  {
    name: "Users Applied For Medical Certificate",
    path: "/usersforcertificate",
    icon: <MdOutlineMedicalServices />
  },
  {
    name: "Issued Certificates",
    path: "/fetchcertificates",
    icon: <FiFileText />
  },
];
