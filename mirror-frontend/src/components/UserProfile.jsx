import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import defaultProfile from "../assets/default-profile.png";

const getProfileCacheKey = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return `mirror_profile_cache_${payload.id}`;
  } catch {
    return null;
  }
};

// cache helpers
function loadCachedProfile() {
  try {
    const key = getProfileCacheKey();
    return key ? JSON.parse(localStorage.getItem(key) || "null") : null;
  } catch {
    return null;
  }
}
function saveCachedProfile(p) {
  try {
    const key = getProfileCacheKey();
    if (key) localStorage.setItem(key, JSON.stringify(p));
  } catch {}
}

// base64 -> blob URL (jpeg fallback)
function base64ToObjectURL(base64, mime = "image/jpeg") {
  try {
    const byteString = atob(base64);
    const len = byteString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = byteString.charCodeAt(i);
    const blob = new Blob([bytes], { type: mime });
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
}

export default function UserProfile() {
  const [profile, setProfile] = useState({});
  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [animateIn, setAnimateIn] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  // memoized/revocable avatar URL from base64
  const avatarUrlRef = useRef(null);
  const currentAvatarUrl = useMemo(() => {
    if (!profile?.profile_picture) return null;
    // revoke old
    if (avatarUrlRef.current) URL.revokeObjectURL(avatarUrlRef.current);
    const url = base64ToObjectURL(profile.profile_picture);
    avatarUrlRef.current = url;
    return url;
  }, [profile?.profile_picture]);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    // 1) hydrate immediately from cache (no skeleton if present)
    const cached = loadCachedProfile();
    if (cached) {
      setProfile(cached);
      setLoading(false);
      requestAnimationFrame(() => mounted && setAnimateIn(true));
    }

    // 2) fetch in background
    (async () => {
      try {
        if (!cached) setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        if (!mounted) return;
        const data = res.data || {};
        // only update if changed vs cache
        const same = JSON.stringify(data) === JSON.stringify(loadCachedProfile());
        if (!same) {
          setProfile(data);
          saveCachedProfile(data);
        } else if (!cached) {
          setProfile(data);
        }
      } catch (err) {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          console.error(err);
          // Handle 401 errors by clearing cache and redirecting to login
          if (err.response?.status === 401) {
            localStorage.removeItem("token");
            const key = getProfileCacheKey();
            if (key) localStorage.removeItem(key);
            navigate("/login");
            return;
          }
        }
      } finally {
        if (!mounted) return;
        setLoading(false);
        requestAnimationFrame(() => setAnimateIn(true));
      }
    })();

    return () => {
      mounted = false;
      controller.abort();
      // revoke avatar URL on unmount
      if (avatarUrlRef.current) {
        URL.revokeObjectURL(avatarUrlRef.current);
        avatarUrlRef.current = null;
      }
      // revoke preview URL on unmount
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();

      Object.keys(profile).forEach((key) => {
        if (key !== "profile_picture") {
          formData.append(key, profile[key] ?? "");
        }
      });
      if (profilePic) formData.append("profile_picture", profilePic);

      const res = await axios.post("http://localhost:5000/api/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // If API returns updated profile, use it; else persist our current state
      const updated = res?.data && typeof res.data === "object" ? res.data : profile;
      setProfile(updated);
      saveCachedProfile(updated);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => setShowConfirm(true);

  const performDelete = useCallback(async () => {
    try {
      setDeleting(true);
      const token = localStorage.getItem("token");
      await axios.delete("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem("token");
      const key = getProfileCacheKey();
      if (key) localStorage.removeItem(key);
      navigate("/");
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  }, [navigate]);

  return (
    <div
      className="
        md:ml-60 ml-0
        flex-1 max-h-screen
        px-4 sm:px-6 md:px-10 lg:px-24 xl:px-32
        pt-8 sm:pt-10
        text-white
      "
      style={{
        background:
          "radial-gradient(1200px 800px at 20% 0%, #2b212f 0%, #131225 60%, #0c0b18 100%)",
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .profile-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: ${animateIn ? 1 : 0};
          transform: translateY(${animateIn ? '0' : '10px'});
          transition: opacity 0.5s ease-out, transform 0.5s ease-out;
        }
        .profile-skeleton {
          background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
          background-size: 200% 100%;
          animation: pulse 1.5s ease-in-out infinite;
        }
        @keyframes pulse {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .modal-animation {
          animation: modalFadeIn 0.3s ease-out forwards;
        }
      `}</style>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-8 w-full">
          <div className="flex items-center space-x-4 sm:space-x-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full profile-skeleton"></div>
            <div className="space-y-2">
              <div className="h-6 sm:h-7 w-32 sm:w-40 rounded profile-skeleton"></div>
              <div className="h-4 sm:h-5 w-28 sm:w-32 rounded profile-skeleton"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-1">
                <div className="h-4 sm:h-5 w-20 rounded profile-skeleton"></div>
                <div className="h-9 sm:h-10 w-full rounded profile-skeleton"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Profile Header */}
      {!loading && (
        <div className="flex flex-col sm:flex-row sm:items-center items-start sm:space-x-6 space-y-4 sm:space-y-0 mb-8 sm:mb-10 profile-fade-in">
          <div className="relative group">
            <label className="cursor-pointer transition-transform duration-300 hover:scale-105 block">
              <input
                type="file"
                hidden
                accept="image/png,image/jpeg"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setProfilePic(file);
                  if (file) {
                    const url = URL.createObjectURL(file);
                    setPreviewUrl(url);
                  }
                }}
              />
              <img
                src={previewUrl || currentAvatarUrl || defaultProfile}
                alt="Profile"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border border-white/20 shadow-lg"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute bottom-0 right-0 bg-[#7a7ffb] rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </div>
            </label>
          </div>

          <div className="text-left sm:text-left w-full sm:w-auto">
            <h2 className="text-xl sm:text-2xl font-semibold break-words">
              {profile.Name || "Loading..."}
            </h2>
            <p className="text-white/70 break-words">
              {profile.email || "Loading..."}
            </p>
          </div>
        </div>
      )}

      {/* Profile Form */}
      {!loading && (
        <>
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 profile-fade-in"
            style={{ animationDelay: "50ms" }}
          >
            <div>
              <label className="block text-white/80 mb-1">Full Name</label>
              <input
                placeholder="Full Name"
                value={profile.full_name || ""}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                className="w-full rounded px-3 sm:px-4 py-2
                           bg-white/5 border border-white/10 text-white
                           placeholder-white/60
                           focus:outline-none focus:ring-2 focus:ring-white/30
                           transition-all duration-300 hover:border-white/20"
              />
            </div>

            <div>
              <label className="block text-white/80 mb-1">Gender</label>
              <select
                value={profile.gender || ""}
                onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                className="w-full rounded px-3 sm:px-4 py-2 
                           bg-white/5 border border-white/10 text-white
                           focus:outline-none focus:ring-2 focus:ring-white/30
                           transition-all duration-300 hover:border-white/20"
              >
                <option value="">Select Gender</option>
                <option className="text-black" value="Male">Male</option>
                <option className="text-black" value="Female">Female</option>
                <option className="text-black" value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-white/80 mb-1">Date of Birth</label>
              <input
                type="date"
                value={profile.date_of_birth?.slice(0, 10) || ""}
                onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })}
                className="w-full rounded px-3 sm:px-4 py-2
                           bg-white/5 border border-white/10 text-white
                           focus:outline-none focus:ring-2 focus:ring-white/30
                           transition-all duration-300 hover:border-white/20
                           [color-scheme:dark]"
              />
            </div>

            <div>
              <label className="block text-white/80 mb-1">Phone Number</label>
              <input
                placeholder="Phone Number"
                value={profile.phone_number || ""}
                onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                className="w-full rounded px-3 sm:px-4 py-2
                           bg-white/5 border border-white/10 text-white
                           placeholder-white/60
                           focus:outline-none focus:ring-2 focus:ring-white/30
                           transition-all duration-300 hover:border-white/20"
              />
            </div>
          </div>

          <div className="mt-5 sm:mt-6 profile-fade-in" style={{ animationDelay: "100ms" }}>
            <label className="block text-white/80 mb-1">Bio</label>
            <textarea
              placeholder="Bio"
              value={profile.bio || ""}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full h-28 sm:h-32 resize-none rounded px-3 sm:px-4 py-2
                         bg-white/5 border border-white/10 text-white
                         placeholder-white/60
                         focus:outline-none focus:ring-2 focus:ring-white/30
                         transition-all duration-300 hover:border-white/20"
            />
          </div>
        </>
      )}

      {/* Action Buttons */}
      {!loading && (
        <div
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 profile-fade-in"
          style={{ animationDelay: "150ms" }}
        >
          <button
            onClick={handleSave}
            disabled={saving}
            className={`w-full sm:w-24 px-4 py-2 rounded shadow
                        bg-white/10 hover:bg-white/20
                        border border-white/20 text-white
                        transition-all duration-300 transform hover:scale-105
                        ${saving ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {saving ? "Saving..." : "Save"}
          </button>

          <button
            onClick={handleDelete}
            className="w-full sm:w-24 bg-[#7a7ffb] hover:bg-[#676cff] text-white px-4 py-2 rounded shadow
                       transition-all duration-300 transform hover:scale-105"
          >
            Delete
          </button>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" aria-modal="true" role="dialog">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowConfirm(false)} />
          <div className="relative z-10 w-11/12 max-w-md rounded-2xl bg-[#1c1b2a] text-white border border-white/10 shadow-xl p-6">
            <h3 className="text-lg font-semibold">Delete account?</h3>
            <p className="mt-2 text-white/80">
              This action can’t be undone. Your profile and data will be removed.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded border border-white/20 bg-white/10 hover:bg-white/20"
              >
                Cancel
              </button>
              <button
                onClick={performDelete}
                disabled={deleting}
                className={`px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white ${
                  deleting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" aria-modal="true" role="dialog">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowSuccessModal(false)} />
          <div className="relative z-10 w-11/12 max-w-md rounded-2xl bg-[#1c1b2a] text-white border border-white/10 shadow-xl p-6 modal-animation">
            <h3 className="text-lg font-semibold">Profile updated</h3>
            <p className="mt-2 text-white/80">Your profile has been updated successfully.</p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
