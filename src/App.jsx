import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ParticlesComponent from "./components/particles";
import { useSelector } from "react-redux";
import Spinner from "./components/spinner";
import ProtectedRoute from "./components/ProtectedRoutes";
import PublicRoute from "./components/PublicRoute";
import ApplyDoctor from "./pages/ApplyDoctor";
import NotificationPage from "./pages/NotificationPage";
import Doctors from "./pages/admin/Doctors";
import Users from "./pages/admin/Users";
import Profile from "./pages/doctor/Profile";
import Doctorhub from "./pages/Doctorhub";
import BookingPage from "./pages/BookingPage";
import Appointments from "./pages/Appointments";
import Medicalcertificateform from "./pages/Medicalcertificateform";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import Profileuser from "./pages/user/Profileuser";
import Medicalcertusers from "./pages/admin/Medicalcertusers";
import Userhub from "./pages/Userhub";
import Usercertificate from "./pages/Usercertificate";
import Usercertificateinfo from "./pages/user/Usercertificateinfo";
import Fetchcertificates from "./pages/doctor/Fetchcertificates";
import Allappointments from "./pages/admin/Allappointments";
import Userstatus from "./pages/admin/Userstatus";
import BookingSuccess from "./pages/BookingSuccess";

function App() {
  const { loading } = useSelector((state) => state.alerts);

  return (
    <BrowserRouter>
      {loading ? (
        <Spinner />
      ) : (
        <>
          
          <ConditionalParticles />

          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
              <Route
              path="/apply-doctor"
              element={
                <ProtectedRoute>
                  <ApplyDoctor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medicalcert"
              element={
                <ProtectedRoute>
                  <Medicalcertificateform />
                </ProtectedRoute>
              }
            />
              <Route
              path="/doctorhub"
              element={
                <ProtectedRoute>
                  <Doctorhub />
                </ProtectedRoute>
              }
            />
            <Route
              path="/userhub"
              element={
                <ProtectedRoute>
                  <Userhub />
                </ProtectedRoute>
              }
            />
             <Route
              path="/admin/doctors"
              element={
                <ProtectedRoute>
                  <Doctors />
                </ProtectedRoute>
              }
            />
             <Route
              path="/admin/users"
              element={
                <ProtectedRoute>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route 
             path="/admin/allappointments"
             element={
              <ProtectedRoute>
                <Allappointments/>
              </ProtectedRoute>
             }


            />
            <Route 
             path="/admin/changestatus"
             element={
              <ProtectedRoute>
                <Userstatus/>
              </ProtectedRoute>
             }


            />
             <Route
              path="/doctor/profile/:id"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/profile/:id"
              element={
                <ProtectedRoute>
                  <Profileuser />
                </ProtectedRoute>
              }
            />
          <Route
           path="/certificates"
           element={
            <ProtectedRoute>
              <Usercertificate/>
            </ProtectedRoute>
           }
          >

          </Route>

            <Route
              path="/doctor/book-appointment/:doctorId"
              element={
                <ProtectedRoute>
                  <BookingPage />
                </ProtectedRoute>
              }
            />
             <Route
              path="/appointments"
              element={
                <ProtectedRoute>
                  <Appointments />
                </ProtectedRoute>
              }
            />
            <Route
             path="/booking-success" element={<BookingSuccess />}

            />
             <Route
              path="/fetchcertificates"
              element={
                <ProtectedRoute>
                  <Fetchcertificates />
                </ProtectedRoute>
              }
            />
             <Route
              path="/certificatestatus"
              element={
                <ProtectedRoute>
                  <Usercertificateinfo />
                </ProtectedRoute>
              }
            />
             <Route
              path="/doctor-appointments"
              element={
                <ProtectedRoute>
                  <DoctorAppointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/usersforcertificate"
              element={
                <ProtectedRoute>
                  <Medicalcertusers />
                </ProtectedRoute>
              }
            />
             <Route
              path="/notification"
              element={
                <ProtectedRoute>
                  <NotificationPage />
                </ProtectedRoute>
              }
            />
             
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            
          </Routes>
        </>
      )}
    </BrowserRouter>
  );
}

function ConditionalParticles() {
  const location = useLocation();

  // Only render particles on Login and Register pages
  return location.pathname === "/login" || location.pathname === "/register" ? (
    <ParticlesComponent id="particles" />
  ) : null;
}

export default App;
