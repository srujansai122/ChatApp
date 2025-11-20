import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { MessageSquare, User, Mail, Lock } from "lucide-react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    const { name, email, password } = formData;

    if (!name || !email || !password) {
      return toast.error("Please fill in all fields");
    }

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      return toast.error("Enter a valid email address");
    }

    return true;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      signup(formData);
      setFormData({ name: "", email: "", password: "" });
    }
  };

  return (
    <div className="min-h-screen bg-neutral text-base-100 flex items-center justify-center">
      <div className="card w-full max-w-md shadow-2xl bg-base-100 text-base-content">
        <div className="card-body">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="text-primary w-6 h-6" />
            <h1 className="text-2xl font-bold text-primary">ChatUp</h1>
          </div>
          <h2 className="card-title text-accent mb-4">Create an Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">
                <span className="flex items-center gap-2 text-base font-medium">
                  <User className="w-4 h-4 text-base" />
                  Name
                </span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div>
              <label className="label">
                <span className="flex items-center gap-2 text-base font-medium">
                  <Mail className="w-4 h-4 text-base" />
                  Email
                </span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div>
              <label className="label">
                <span className="flex items-center gap-2 text-base font-medium">
                  <Lock className="w-4 h-4 text-base" />
                  Password
                </span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input input-bordered w-full pr-12"
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-2 text-sm btn btn-sm btn-ghost"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div className="card-actions mt-6">
              <button
                type="submit"
                className={`btn btn-primary w-full ${
                  isSigningUp ? "loading" : ""
                }`}
              >
                {isSigningUp ? "Signing Up..." : "Sign Up"}
              </button>
            </div>
          </form>

          <div className="mt-4 text-center text-sm">
            <span className="text-base">Already have an account?</span>{" "}
            <Link to="/login" className="link link-primary font-medium">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
