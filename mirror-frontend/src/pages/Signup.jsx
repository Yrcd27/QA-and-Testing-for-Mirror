import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

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

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Confirm your password";

    if (formData.password && formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/;
    if (formData.password && !passwordPattern.test(formData.password)) {
      newErrors.password =
        "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*).";
    }
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/signup", {
        Name: formData.name,
        email: formData.email,
        password: formData.password
      });
      navigate("/login");
    } catch (err) {
      setErrors({ api: err.response?.data?.message || "Signup failed" });
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
        <motion.h1 variants={item} className="text-4xl font-bold mb-4">
          Sign up
        </motion.h1>
        <motion.p variants={item} className="text-gray-300 mb-8">
          Let’s get you all set up so you can access your personal account.
        </motion.p>

        {errors.api && (
          <motion.p variants={item} className="text-red-400 mb-4">
            {errors.api}
          </motion.p>
        )}

        <motion.form variants={item} onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <motion.div variants={item}>
            <input
              name="name"
              placeholder="Name"
              className="w-full rounded bg-white/5 border border-white/10 text-white placeholder-gray-400 px-4 py-2 transition focus:outline-none focus:ring-2 focus:ring-[#7a7ffb]/60 focus:border-[#7a7ffb]"
              onChange={handleChange}
            />
            {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}
          </motion.div>

          {/* Email */}
          <motion.div variants={item}>
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="w-full rounded bg-white/5 border border-white/10 text-white placeholder-gray-400 px-4 py-2 transition focus:outline-none focus:ring-2 focus:ring-[#7a7ffb]/60 focus:border-[#7a7ffb]"
              onChange={handleChange}
            />
            {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
          </motion.div>

          {/* Password */}
          <motion.div variants={item}>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full rounded bg-white/5 border border-white/10 text-white placeholder-gray-400 px-4 py-2 pr-2 transition focus:outline-none focus:ring-2 focus:ring-[#7a7ffb]/60 focus:border-[#7a7ffb] [color-scheme:dark]"
              onChange={handleChange}
            />
            {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
          </motion.div>

          {/* Confirm Password */}
          <motion.div variants={item}>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="w-full rounded bg-white/5 border border-white/10 text-white placeholder-gray-400 px-4 py-2 pr-2 transition focus:outline-none focus:ring-2 focus:ring-[#7a7ffb]/60 focus:border-[#7a7ffb] [color-scheme:dark]"
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm">{errors.confirmPassword}</p>
            )}
          </motion.div>

          {/* Submit */}
          <motion.button
            variants={item}
            type="submit"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-[#7a7ffb] text-white py-2 rounded transition shadow-sm hover:shadow-md hover:bg-[#6d72ff]"
          >
            Create account
          </motion.button>
        </motion.form>

        <motion.p variants={item} className="mt-4 text-sm text-gray-300">
          Already have an account?{" "}
          <Link to="/login" className="text-[#7a7ffb] hover:underline">
            Login
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
