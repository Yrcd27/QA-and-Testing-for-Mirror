import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff } from "react-icons/fi";

const container = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut", when: "beforeChildren", staggerChildren: 0.06 }
  }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" } }
};

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "", rememberMe: false });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (Object.keys(newErrors).length) return setErrors(newErrors);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      setSuccess("Login successful!");
      localStorage.setItem("token", res.data.token);
      formData.rememberMe
        ? localStorage.setItem("rememberedEmail", formData.email)
        : localStorage.removeItem("rememberedEmail");
      setTimeout(() => navigate("/dashboard"), 500);
    } catch (err) {
      setErrors({ api: err.response?.data?.message || "Login failed" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-black text-white">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-md rounded-2xl p-8 border border-white/10 bg-white/5 backdrop-blur-sm shadow-[0_10px_30px_-10px_rgba(122,127,251,0.35)]"
      >
        <motion.h1 variants={item} className="text-4xl font-bold mb-4 text-center">
          Login
        </motion.h1>
        <motion.p variants={item} className="text-gray-300 mb-8 text-center">
          Login to access your Mirror account.
        </motion.p>

        {errors.api && (
          <motion.p variants={item} className="text-red-400 mb-4 text-center">
            {errors.api}
          </motion.p>
        )}
        {success && (
          <motion.p variants={item} className="text-green-400 mb-4 text-center">
            {success}
          </motion.p>
        )}

        <motion.form variants={item} onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <motion.div variants={item}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full rounded bg-white/5 border border-white/10 text-white placeholder-gray-400 px-4 py-2 transition focus:outline-none focus:ring-2 focus:ring-[#7a7ffb]/60 focus:border-[#7a7ffb]"
              onChange={handleChange}
              value={formData.email}
            />
            {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
          </motion.div>

          {/* Password with toggle button */}
          <motion.div variants={item} className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="w-full rounded bg-white/5 border border-white/10 text-white placeholder-gray-400 px-4 py-2 pr-10 transition focus:outline-none focus:ring-2 focus:ring-[#7a7ffb]/60 focus:border-[#7a7ffb]"
              onChange={handleChange}
              value={formData.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-300 hover:text-[#7a7ffb]"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
            {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
          </motion.div>

          {/* Remember me */}
          <motion.div variants={item} className="flex items-center">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="mr-2 accent-[#7a7ffb]"
            />
            <label className="text-sm text-gray-200">Remember me</label>
          </motion.div>

          {/* Button */}
          <motion.button
            variants={item}
            type="submit"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-[#7a7ffb] text-white py-2 rounded transition shadow-sm hover:shadow-md hover:bg-[#6d72ff]"
          >
            Login
          </motion.button>
        </motion.form>

        <motion.p variants={item} className="mt-4 text-sm text-gray-300 text-center">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-[#7a7ffb] hover:underline">
            Sign up
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
