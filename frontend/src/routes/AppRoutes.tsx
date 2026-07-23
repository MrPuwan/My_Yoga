import React from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import NotFoundPage from '../pages/NotFoundPage';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import GuestRoute from './GuestRoute';
import YogaPoseListPage from '../pages/admin/yoga-poses/YogaPoseListPage';
import CreateYogaPosePage from '../pages/admin/yoga-poses/CreateYogaPosePage';
import EditYogaPosePage from '../pages/admin/yoga-poses/EditYogaPosePage';
import HealthProfilePage from '../pages/health-profile/HealthProfilePage';
import RecommendationsPage from '../pages/recommendations/RecommendationsPage';
import YogaPoseLibraryPage from '../pages/yoga-poses/YogaPoseLibraryPage';

export const AppRoutes: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/health-profile" element={<HealthProfilePage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/yoga-poses" element={<YogaPoseLibraryPage />} />
        </Route>
        <Route element={<AdminRoute />}>
          <Route
            path="/admin"
            element={<Navigate to="/admin/yoga-poses" replace />}
          />
          <Route path="/admin/yoga-poses" element={<YogaPoseListPage />} />
          <Route path="/admin/yoga-poses/new" element={<CreateYogaPosePage />} />
          <Route
            path="/admin/yoga-poses/:id/edit"
            element={<EditYogaPosePage />}
          />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
};

export default AppRoutes;
