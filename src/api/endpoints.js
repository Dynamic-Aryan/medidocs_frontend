// const BASE_URL = "http://localhost:5000/api/v1";

const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api/v1"
    : "https://medidocs-backend.onrender.com/api/v1";

const API_ENDPOINTS = {
  //user
  getUserData: `${BASE_URL}/user/getUserData`,
  getUserInfo: `${BASE_URL}/user/getuserinfo`,
  applyDoctor: `${BASE_URL}/user/apply-doctor`,
  userAppointments: `${BASE_URL}/user/userappointments`,
  bookAppointment: `${BASE_URL}/user/book-appointment`,
  bookingAvailability: `${BASE_URL}/user/booking-availability`,
  getAllDoctors: `${BASE_URL}/user/getalldoctors`,
  register: `${BASE_URL}/user/register`,
  login: `${BASE_URL}/user/login`,
  applyCertificate: `${BASE_URL}/user/applycertificate`,
  getAllNotifications: `${BASE_URL}/user/getallnotifications`,
  deleteAllNotifications: `${BASE_URL}/user/deleteallnotifications`,
  userMedicalCertificateStatus: `${BASE_URL}/user/usermedicalcertificatestatus`,
  userMedicalCertNoOfSubmissions: `${BASE_URL}/user/usermedicalcertificatenoofsubmissions`,
  updateUserProfile: `${BASE_URL}/user/updateprofileuser`,
  getApprovedDoctors: `${BASE_URL}/user/approved-doctors`,

  //   doctor
  getDoctorById: `${BASE_URL}/doctor/getDoctorById`,
  getDoctorInfo: `${BASE_URL}/doctor/getdoctorinfo`,
  getAllUsersCert: `${BASE_URL}/doctor/getalluserscert`,
  doctorAppointments: `${BASE_URL}/doctor/doctorappointments`,
  updateAppointmentStatus: `${BASE_URL}/doctor/updateappointmentstatus`,
  deleteAppointment: (appointmentId) =>
    `${BASE_URL}/doctor/deleteappointments/${appointmentId}`,
  approveRejectCertificate: `${BASE_URL}/doctor/approve-reject-certificate`,
  deleteCertificate: (certificateId) =>
    `${BASE_URL}/doctor/deleteCertificateController/${certificateId}`,
  updateProfile: `${BASE_URL}/doctor/updateprofile`,

  // admin
  adminGetAllDoctors: `${BASE_URL}/admin/getalldoctors`,
  changeAccountStatus: `${BASE_URL}/admin/changeaccountstatus`,
  deleteDoctor: `${BASE_URL}/admin/deletedoctor`,
  adminGetAllUsers: `${BASE_URL}/admin/getallusers`,
  deleteUser: (userId) => `${BASE_URL}/admin/deleteuser/${userId}`,
  allAppointments:`${BASE_URL}/admin/adminappointments`,
  deleteAppointmentByAdmin:(appointmentId)=>`${BASE_URL}/admin/delete-appointment/${appointmentId}`,
  changeUserRole: `${BASE_URL}/admin/changeuserrole`,
};

export default API_ENDPOINTS;
