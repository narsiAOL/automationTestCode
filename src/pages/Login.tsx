import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import LoginForm from "../components/Login/LoginForm";
import Verification from "../components/Login/Verification";
import { useAuth } from "../contexts/AuthContext";
import { IoCall } from "react-icons/io5";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const [showVerification, setShowVerification] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const from = (location.state as any)?.from;
      const shouldRedirectToMemberProfile =
        from &&
        ((typeof from === "string" && from.includes("/member-profile")) ||
          (from.pathname && from.pathname.includes("/member-profile")));
      navigate(shouldRedirectToMemberProfile ? from : "/dashboard", {
        replace: true,
      });
    }
  }, [isAuthenticated, isLoading, navigate, location.state]);

  const handleLoginSubmit = (email: string) => {
    // setShowVerification(true);
    setUserEmail(email);
  };

  const handleVerificationComplete = (code: string) => {
    console.log("Verification code entered:", code);
    // Handle verification logic here
    alert(`Verification successful with code: ${code}`);
  };

  const handleForgotPassword = () => {
    setShowVerification(false);
    // Navigate to forgot password page
  };

  if (showVerification) {
    return (
      <AuthLayout>
        <Verification
          email={userEmail}
          onVerifyComplete={handleVerificationComplete}
          onForgotPassword={handleForgotPassword}
        />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <LoginForm onSubmit={handleLoginSubmit} />
      <div className="absolute top-0 right-0 flex justify-end mt-8 mr-8 ">
        <Link to="/contact">
          <p className="text-end flex text-xs text-gray-500 items-center gap-1">
            <IoCall />
            Contact Us
          </p>
        </Link>
      </div>
      <div className="absolute bottom-0 right-0 flex justify-end mb-8 mr-8 gap-2">
        <Link to="/privacy-policy">
          <p className="text-end text-xs text-gray-500 ">Privacy Policy</p>
        </Link>
        <div className="h-4 border-r border-slate-400"></div>
        <Link to="/child-safety">
          <p className="text-end flex text-xs text-gray-500 items-center gap-1">
            Child Safety
          </p>
        </Link>
      </div>
    </AuthLayout>
  );
}
