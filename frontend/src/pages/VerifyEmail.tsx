import { useSelector } from "react-redux";
import OTP from "../components/OTP";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import {
  useVerifyEmailMutation,
  useResendCodeMutation,
} from "../app/services/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";

type UI = {
  theme: string;
};

type State = {
  ui: UI;
};

const VerifyEmail = () => {
  const theme = useSelector((state: State) => state?.ui?.theme);
  const [emailSent, setEmailSent] = useState<boolean>(true);
  const [count, setCount] = useState(30);
  const [otp, setOtp] = useState<string>("");
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
  const [resendCode, { isLoading: resendLoading }] = useResendCodeMutation();

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const result = await verifyEmail({ OTP: otp }).unwrap();
      if (result.success) {
        toast.success(result.message);
        navigate("/signin");
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Unknown Error");
      }
    }
  };

  const handleResendCode = async () => {
    try {
      const result = await resendCode(null).unwrap();

      if (result.success) {
        toast.success(result.message);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Unknown Error");
      }
    }
  };

  useEffect(() => {
    if (emailSent) {
      const id = setInterval(() => {
        setCount((prev) => {
          if (prev === 0) {
            setEmailSent(false);
            clearInterval(id);
            return prev;
          } else {
            return prev - 1;
          }
        });
      }, 1000);
    }
  }, [emailSent]);

  return (
    <div className="min-h-screen min-w-screen bg-secondary dark:bg-gray-700 flex justify-center items-center">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="w-[90%] max-w-95 mx-auto bg-white dark:bg-gray-800 py-6 px-6 rounded-lg shadow-[0px_0px_20px_rgba(0,0,0,0.2)]"
      >
        <img
          src={theme === "dark" ? "/logo-white.png" : "/logo.png"}
          alt="logo"
          className="w-15 mx-auto"
        />
        <h1 className="text-center text-slate-800 dark:text-gray-200 text-2xl font-medium">
          Verify Your Email
        </h1>
        <p className="text-center text-sm text-slate-600 dark:text-gray-400 mt-2">
          We sent a 6 digits code to your email address. Use that code to
          validate your email address
        </p>

        <div className="flex justify-center mt-3">
          <OTP otp={otp} changeOtp={(value: string) => setOtp(value)} />
        </div>
        <button
          className={`${isLoading ? "bg-primary/80" : "bg-primary"} text-white py-2 rounded-lg my-2.5  w-full flex justify-center items-center`}
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? <Loader className="animate-spin" /> : "Verify Email"}
        </button>

        {emailSent ? (
          <p className="text-center text-slate-700 dark:text-gray-400">
            Wait <span className="text-primary">{count}</span> seconds before
            asking for a new code
          </p>
        ) : (
          <p className="text-center text-slate-700 dark:text-gray-400 flex items-center space-x-2">
            <span>Didn't receive the code ?</span>
            {resendLoading ? (
              <Loader className="text-primary animate-spin" />
            ) : (
              <button
                className="text-primary hover:underline"
                onClick={handleResendCode}
              >
                Resend the code
              </button>
            )}
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
