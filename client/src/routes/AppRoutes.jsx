import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import HomePage from '../pages/Home/HomePage';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import ForgotPasswordPage from '../pages/Auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/Auth/ResetPasswordPage';
import HotelsPage from '../pages/Hotels/HotelsPage';
import HotelDetailPage from '../pages/Hotels/HotelDetailPage';
import NearbyHotelsPage from '../pages/Hotels/NearbyHotelsPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';

import AboutPage from '../pages/Misc/AboutPage';
import ContactPage from '../pages/Misc/ContactPage';
import FAQPage from '../pages/Misc/FAQPage';
import NotFoundPage from '../pages/Misc/NotFoundPage';
import useAuth from '../hooks/useAuth';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="hotels" element={<HotelsPage />} />
        <Route path="hotels-nearby" element={<NearbyHotelsPage />} />
        <Route path="hotels/:slug" element={<HotelDetailPage />} />

        <Route path="about" element={<AboutPage />} />
        <Route path="faq" element={<FAQPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute isAuthenticated={Boolean(user)}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
