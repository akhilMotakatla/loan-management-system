import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';
import ProtectedRoute from './ProtectedRoute.jsx';
import AdminRoute from './AdminRoute.jsx';
import PublicLayout from '../components/layout/PublicLayout.jsx';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import Spinner from '../components/ui/Spinner.jsx';

const HomePage            = lazy(() => import('../pages/public/HomePage.jsx'));
const AboutPage           = lazy(() => import('../pages/public/AboutPage.jsx'));
const LoanProductsPage    = lazy(() => import('../pages/public/LoanProductsPage.jsx'));
const ContactPage         = lazy(() => import('../pages/public/ContactPage.jsx'));
const LoginPage           = lazy(() => import('../pages/public/LoginPage.jsx'));
const RegisterPage        = lazy(() => import('../pages/public/RegisterPage.jsx'));

const DashboardPage       = lazy(() => import('../pages/customer/DashboardPage.jsx'));
const ApplyLoanPage       = lazy(() => import('../pages/customer/ApplyLoanPage.jsx'));
const MyApplicationsPage  = lazy(() => import('../pages/customer/MyApplicationsPage.jsx'));
const ActiveLoansPage     = lazy(() => import('../pages/customer/ActiveLoansPage.jsx'));
const PaymentPage         = lazy(() => import('../pages/customer/PaymentPage.jsx'));
const DocumentsPage       = lazy(() => import('../pages/customer/DocumentsPage.jsx'));
const ProfilePage         = lazy(() => import('../pages/customer/ProfilePage.jsx'));
const NotificationsPage   = lazy(() => import('../pages/customer/NotificationsPage.jsx'));

const AdminDashboardPage     = lazy(() => import('../pages/admin/AdminDashboardPage.jsx'));
const AllApplicationsPage    = lazy(() => import('../pages/admin/AllApplicationsPage.jsx'));
const ApplicationDetailPage  = lazy(() => import('../pages/admin/ApplicationDetailPage.jsx'));
const ActiveLoansAdminPage   = lazy(() => import('../pages/admin/ActiveLoansAdminPage.jsx'));
const UserManagementPage     = lazy(() => import('../pages/admin/UserManagementPage.jsx'));
const ReportsPage            = lazy(() => import('../pages/admin/ReportsPage.jsx'));

const CalculatorSection = lazy(() => import('../components/sections/CalculatorSection.jsx'));

function AppInit() {
  const { fetchMe } = useAuthStore();
  useEffect(() => { fetchMe(); }, []);
  return null;
}

const Loading = () => (
  <div className="min-h-screen bg-navy-deep flex items-center justify-center">
    <Spinner size="lg" />
  </div>
);

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AppInit />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/"           element={<HomePage />} />
            <Route path="/about"      element={<AboutPage />} />
            <Route path="/loans"      element={<LoanProductsPage />} />
            <Route path="/contact"    element={<ContactPage />} />
            <Route path="/calculator" element={<div className="pt-20"><CalculatorSection /></div>} />
          </Route>

          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="/dashboard"    element={<DashboardPage />} />
            <Route path="/apply"        element={<ApplyLoanPage />} />
            <Route path="/applications" element={<MyApplicationsPage />} />
            <Route path="/loans/active" element={<ActiveLoansPage />} />
            <Route path="/payments/new" element={<PaymentPage />} />
            <Route path="/documents"    element={<DocumentsPage />} />
            <Route path="/profile"      element={<ProfilePage />} />
            <Route path="/notifications"element={<NotificationsPage />} />
          </Route>

          <Route element={<AdminRoute><DashboardLayout /></AdminRoute>}>
            <Route path="/admin"                       element={<AdminDashboardPage />} />
            <Route path="/admin/applications"          element={<AllApplicationsPage />} />
            <Route path="/admin/applications/:id"      element={<ApplicationDetailPage />} />
            <Route path="/admin/loans"                 element={<ActiveLoansAdminPage />} />
            <Route path="/admin/users"                 element={<UserManagementPage />} />
            <Route path="/admin/reports"               element={<ReportsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
