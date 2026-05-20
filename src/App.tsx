import { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AudioProvider } from "./contexts/AudioContext";
import { AuthProvider } from "./contexts/AuthContext";
import { DrawerProvider } from "./contexts/DrawerContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Loader from "./components/ui/Loader";
import "./i18n"; // Initialize i18next
import { DashboardProvider } from "./contexts/DashboardContext";
import { Toaster } from "sonner";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import { ContactUs } from "./pages/ContactUs";
import PageNotFound from "./pages/PageNotFound";
import ChildSafety from "./pages/ChildSafety";

// Lazy load pages to reduce initial bundle size
const Login = lazy(() => import("./pages/Login"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Member = lazy(() => import("./pages/Member"));
const BusinessDirectory = lazy(() => import("./pages/BusinessDirectory"));
const BhaktiGeet = lazy(() => import("./pages/BhaktiGeet"));
const MemberProfile = lazy(() => import("./pages/MemberProfile"));

export default function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <AudioProvider>
        <AuthProvider>
          <DashboardProvider>
            <DrawerProvider>
              <Router>
                <Routes>
                  <Route
                    path="/contact"
                    element={
                      <Suspense fallback={<Loader fullScreen />}>
                        <ContactUs />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/login"
                    element={
                      <Suspense fallback={<Loader fullScreen />}>
                        <Login />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/forgot-password"
                    element={
                      <Suspense fallback={<Loader fullScreen />}>
                        <ForgotPassword />
                      </Suspense>
                    }
                  />
                  <Route
                    // path="member-profile"
                    path="/privacy-policy"
                    element={
                      <Suspense fallback={<Loader fullScreen />}>
                        <PrivacyPolicy />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/child-safety"
                    element={
                      <Suspense fallback={<Loader fullScreen />}>
                        <ChildSafety />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <Layout />
                      </ProtectedRoute>
                    }
                  >
                    <Route
                      index
                      element={<Navigate to="/dashboard" replace />}
                    />
                    <Route
                      path="dashboard"
                      element={
                        <Suspense fallback={<Loader fullScreen />}>
                          <Dashboard />
                        </Suspense>
                      }
                    />
                    <Route
                      path="member"
                      element={
                        <Suspense fallback={<Loader fullScreen />}>
                          <Member />
                        </Suspense>
                      }
                    />
                    <Route
                      path="business-directory"
                      element={
                        <Suspense fallback={<Loader fullScreen />}>
                          <BusinessDirectory />
                        </Suspense>
                      }
                    />
                    <Route
                      path="bhakti-geet"
                      element={
                        <Suspense fallback={<Loader fullScreen />}>
                          <BhaktiGeet />
                        </Suspense>
                      }
                    />
                    <Route
                      path="contact"
                      element={
                        <Suspense fallback={<Loader fullScreen />}>
                          <ContactUs />
                        </Suspense>
                      }
                    />

                    <Route
                      // path="member-profile"
                      path="member-profile/:id"
                      element={
                        <Suspense fallback={<Loader fullScreen />}>
                          <MemberProfile />
                        </Suspense>
                      }
                    />

                    <Route
                      // path="member-profile"
                      path="*"
                      element={
                        <Suspense fallback={<Loader fullScreen />}>
                          <PageNotFound />
                        </Suspense>
                      }
                    />
                  </Route>
                </Routes>
              </Router>
            </DrawerProvider>
          </DashboardProvider>
        </AuthProvider>
      </AudioProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
          },
        }}
      />
    </ThemeProvider>
  );
}
