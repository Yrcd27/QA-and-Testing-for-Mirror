import React, { useEffect, useState, useCallback } from "react";
import { HiOutlineLogout, HiMenuAlt3, HiX } from "react-icons/hi";
import logo from "../assets/logo192.png";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Helper: detect mobile once and react to resizes
  const isMobileView = useCallback(
    () => window.matchMedia("(max-width: 767px)").matches,
    []
  );

  // Keep body scroll in sync with sidebar state on small screens
  useEffect(() => {
    const applyScrollLock = () => {
      if (isMobileView()) {
        document.body.style.overflow = isOpen ? "hidden" : "";
      } else {
        document.body.style.overflow = "";
      }
    };

    applyScrollLock();

    // Update on viewport changes
    const mq = window.matchMedia("(max-width: 767px)");
    const onChange = () => applyScrollLock();
    mq.addEventListener?.("change", onChange);
    window.addEventListener("resize", onChange);

    return () => {
      mq.removeEventListener?.("change", onChange);
      window.removeEventListener("resize", onChange);
      document.body.style.overflow = "";
    };
  }, [isOpen, isMobileView]);

  // Close modal with Escape
  useEffect(() => {
    if (!showConfirm) return;
    const onKey = (e) => {
      if (e.key === "Escape") setShowConfirm(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showConfirm]);

  const performLogout = () => {
    setLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      window.location.href = "/";
    }, 500); // small delay for UI feedback
  };

  return (
    <>
      <div
        className={`bg-black text-white flex flex-col justify-between h-screen fixed top-0 left-0 py-6 transition-all duration-300 z-10
        overflow-hidden
        ${isOpen ? "translate-x-0" : "-translate-x-full"}  /* mobile: slide off */
        md:translate-x-0  /* desktop never slides */
        w-60              /* mobile width stays 60 */
        md:${isOpen ? "w-60" : "w-16"}  /* desktop width behavior unchanged */`}
      >
        {/* Top Section */}
        <div>
          {/* Logo */}
          <div className="flex items-center justify-center py-10">
            <img src={logo} alt="Mirror Logo" className="w-10 h-10 mr-2" />
            {isOpen && <span className="text-3xl font-bold">Mirror</span>}
          </div>

          {/* Menu Items */}
          <nav className="mt-6 flex flex-col items-center py-10 gap-10 whitespace-nowrap">
            <Link to="/dashboard" className="hover:text-[#7a7ffb] text-m font-bold">
              Journal
            </Link>
            <Link to="/profile" className="hover:text-[#7a7ffb] text-m font-bold">
              Profile
            </Link>
            <Link
              to="/new-entry"
              className="bg-[#7a7ffb] text-white w-40 py-2 rounded-full hover:bg-[#7a8fff] hover:text-white text-center text-m font-bold"
            >
              + New Entry
            </Link>
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="py-6 text-center">
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center justify-center w-full hover:text-[#7a7ffb]"
          >
            <HiOutlineLogout size={20} />
            {isOpen && <span className="ml-2">Logout</span>}
          </button>
        </div>
      </div>

      {/* Toggle Button (mobile only) — positioned so it stays reachable when hidden */}
      <button
        className={`md:hidden fixed top-4 ${isOpen ? "left-[17rem]" : "left-4"} bg-black text-white p-2 rounded z-20`}
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        title={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <HiX size={18} /> : <HiMenuAlt3 size={18} />}
      </button>

      {/* Logout Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowConfirm(false)}
          />
          {/* Dialog */}
          <div className="relative z-10 w-11/12 max-w-md rounded-2xl bg-[#1c1b2a] text-white border border-white/10 shadow-xl p-6">
            <h3 className="text-lg font-semibold">Logout?</h3>
            <p className="mt-2 text-white/80">
              Are you sure you want to log out of your account?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded border border-white/20 bg-white/10 hover:bg-white/20"
              >
                Cancel
              </button>
              <button
                onClick={performLogout}
                disabled={loggingOut}
                className={`px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white ${
                  loggingOut ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
