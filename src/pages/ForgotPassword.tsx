import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import ForgotPasswordForm from "../components/Login/ForgotPasswordForm";
import { IoCall } from "react-icons/io5";

export default function ForgotPassword() {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
      <div className="absolute top-0 right-0 flex justify-end mt-8 mr-8">
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
