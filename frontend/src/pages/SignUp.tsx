import { User, Mail, Lock, Loader } from "lucide-react";
import { useSelector } from "react-redux";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { toast } from "react-toastify";
import { useSignUpMutation } from "../app/services/auth";

type Inputs = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
};

type UI = {
  theme: string;
};

type State = {
  ui: UI;
};

const SignUp = () => {
  const theme = useSelector((state: State) => state?.ui?.theme);
  const [signUp] = useSignUpMutation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const result = await signUp(data).unwrap();
      console.log(result);

      if (result.success) {
        toast.success(result.message);
        navigate("/verify-email");
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        console.log(error);
        toast.error("Unknown Error");
      }
    }
  };

  return (
    <div className="bg-secondary dark:bg-gray-700 min-h-screen flex justify-center items-center">
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="w-[90%] max-w-100 mx-auto bg-white dark:bg-gray-800 py-2 pb-4 px-6 rounded-xl shadow-[0px_0px_20px_rgba(0,0,0,0.2)] dark:shadow-none"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        <img
          src={theme === "dark" ? "/logo-white.png" : "/logo.png"}
          alt="logo"
          className="w-15 mx-auto"
        />
        <h1 className="text-center text-slate-800 dark:text-slate-200 text-2xl font-medium">
          Create an account
        </h1>
        <p className="text-slate-700 dark:text-slate-300 text-center text-sm">
          Join the technological experience
        </p>

        <div className="mt-3 flex flex-col space-y-2.5">
          <div className="flex flex-col gap-y-1 text-slate-800 dark:text-slate-200">
            <label htmlFor="firstname" className=" font-medium">
              Firstname:
            </label>
            <div className="relative text-slate-700 dark:text-slate-200">
              <input
                type="text"
                className={`w-full bg-[#F2F3FE] dark:bg-slate-700 border border-slate-400 pl-11 py-2 rounded-md ${errors.firstname ? "ring-1 ring-red-500 dark:ring-red-300" : "focus:ring-1 focus:ring-primary"}  transition-all duration-300`}
                placeholder="John"
                {...register("firstname", {
                  required: "The firstname is required",
                  setValueAs: (value: string) => value.trim(),
                })}
              />
              <User className="absolute top-1/2 -translate-y-1/2 left-3" />
            </div>
            {errors.firstname && (
              <span className="text-sm text-red-500 dark:text-red-300">
                {errors.firstname.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-y-1 text-slate-800 dark:text-slate-200">
            <label htmlFor="lastname" className=" font-medium">
              Lastname:
            </label>
            <div className="relative text-slate-700 dark:text-slate-200">
              <input
                type="text"
                className={`w-full bg-[#F2F3FE] dark:bg-slate-700 border border-slate-400 pl-11 py-2 rounded-md ${errors.lastname ? "ring-1 ring-red-500 dark:ring-red-300" : "focus:ring-1 focus:ring-primary"}  transition-all duration-300`}
                placeholder="Doe"
                {...register("lastname", {
                  required: "The lastname is required",
                  setValueAs: (value: string) => value.trim(),
                })}
              />
              <User className="absolute top-1/2 -translate-y-1/2 left-3" />
            </div>
            {errors.lastname && (
              <span className="text-red-500 dark:text-red-300 text-sm">
                {errors.lastname.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-y-1 text-slate-800 dark:text-slate-200">
            <label htmlFor="firstname" className=" font-medium">
              Email:
            </label>
            <div className="relative text-slate-700 dark:text-slate-200">
              <input
                type="email"
                className={`w-full bg-[#F2F3FE] dark:bg-slate-700 border border-slate-400 pl-11 py-2 rounded-md ${errors.email ? "ring-1 ring-red-500 dark:ring-red-300" : "focus:ring-1 focus:ring-primary"}  transition-all duration-300`}
                placeholder="example@abc.com"
                {...register("email", {
                  required: "The email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email format",
                  },
                  setValueAs: (value: string) => value.trim(),
                })}
              />
              <Mail className="absolute top-1/2 -translate-y-1/2 left-3" />
            </div>
            {errors.email && (
              <span className="text-red-500 text-sm dark:text-red-300">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-y-1 text-slate-800 dark:text-slate-200">
            <label htmlFor="password" className=" font-medium">
              Password:
            </label>
            <div className="relative text-slate-700 dark:text-slate-200">
              <input
                type="password"
                className={`w-full bg-[#F2F3FE] dark:bg-slate-700 border border-slate-400 pl-11 py-2 rounded-md ${errors.password ? "ring-1 ring-red-500 dark:ring-red-300" : "focus:ring-1 focus:ring-primary"}  transition-all duration-300`}
                placeholder="••••••••"
                {...register("password", {
                  required: "The password is required",
                  minLength: {
                    value: 6,
                    message: "The password must contain at least 6 caracters",
                  },
                })}
              />
              <Lock className="absolute top-1/2 -translate-y-1/2 left-3" />
            </div>
            {errors.password && (
              <span className="text-red-500 dark:text-red-300 text-sm">
                {errors.password.message}
              </span>
            )}
          </div>

          <button
            className={`${isSubmitting ? "bg-primary/80" : "bg-primary"} text-white py-2 rounded-lg flex justify-center items-center`}
          >
            {isSubmitting ? <Loader className="animate-spin" /> : "Sign Up"}
          </button>
        </div>
        <p className="mt-2 text-end text-slate-700 dark:text-gray-300">
          Already has an account ?{" "}
          <Link to={"/signin"} className="text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </motion.form>
    </div>
  );
};

export default SignUp;
