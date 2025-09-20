import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FiSmile, FiTrash, FiSave, FiCalendar } from "react-icons/fi";

export default function JournalView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [content, setContent] = useState("");
  const [mood, setMood] = useState("");
  const [createdAt, setCreatedAt] = useState(null);

  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // 10 emojis
  const moodOptions = [
    { label: "happy", emoji: "😃" },
    { label: "sad", emoji: "😢" },
    { label: "angry", emoji: "😡" },
    { label: "calm", emoji: "😌" },
    { label: "sleepy", emoji: "😴" },
    { label: "excited", emoji: "🤩" },
    { label: "crying", emoji: "😭" },
    { label: "frustrated", emoji: "😤" },
    { label: "blessed", emoji: "😇" },
    { label: "thinking", emoji: "🤔" },
  ];

  useEffect(() => {
    const fetchJournal = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/journals/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setContent(res.data.content || "");
        setMood(res.data.mood || "");
        setCreatedAt(res.data.createdAt || null);
      } catch (err) {
        console.error("Error fetching journal", err);
      }
    };
    fetchJournal();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("content", content);
      formData.append("mood", mood);

      await axios.put(`http://localhost:5000/api/journals/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/dashboard");
    } catch (err) {
      console.error("Error updating journal", err);
    }
  };

  const handleDelete = () => setShowConfirm(true);

  const performDelete = useCallback(async () => {
    try {
      setDeleting(true);
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/journals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/dashboard");
    } catch (err) {
      console.error("Error deleting journal", err);
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  }, [id, navigate]);

  const formattedDate = createdAt
    ? new Date(createdAt)
        .toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
        .toUpperCase()
    : "…";

  return (
    <div className="h-screen bg-black text-white flex justify-center">
      <div className="relative w-full max-w-3xl px-4 pt-16 pb-36 sm:pb-40">
        {/* Close Button */}
        <Link to="/dashboard">
          <button
            className="absolute top-4 right-4 bg-gray-800 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-gray-700 text-3xl"
            title="Close"
          >
            &times;
          </button>
        </Link>

        {/* Text Area */}
        <textarea
          className="w-full bg-black text-white outline-none text-base sm:text-lg resize-none overflow-y-auto"
          style={{ height: "calc(100vh - 210px)" }}
          placeholder="Take a moment to reflect... what's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* Mood Picker Popup (10 emojis) */}
        {showMoodPicker && (
          <div className="absolute bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2 bg-white text-black px-3 sm:px-4 py-2 rounded-xl shadow-lg flex flex-wrap gap-2 justify-center z-50">
            {moodOptions.map((m) => (
              <button
                type="button"
                key={m.label}
                className="text-2xl leading-none hover:scale-125 transition"
                title={m.label}
                onClick={() => {
                  setMood(m.emoji);
                  setShowMoodPicker(false);
                }}
              >
                {m.emoji}
              </button>
            ))}
          </div>
        )}

        {/* Bottom Panel — date (left) • icons (center) • round Save (right) */}
        <div className="fixed bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 w-full max-w-3xl px-3 sm:px-4 z-40">
          <div className="bg-white text-black px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-xl">
            <div className="flex items-center">
              {/* LEFT — date (icon-only on mobile) */}
              <div className="flex items-center gap-2 pl-1 sm:pl-2 shrink-0">
                <FiCalendar className="text-xl sm:text-2xl" />
                <span className="hidden sm:inline text-sm font-medium tracking-wide">
                  {formattedDate}
                </span>
              </div>

              {/* CENTER — icons (responsive gaps/sizes) */}
              <div className="flex-1 flex justify-center items-center gap-10 sm:gap-20 md:gap-40">
                {/* Mood */}
                <button
                  onClick={() => setShowMoodPicker((v) => !v)}
                  className="text-xl sm:text-2xl hover:scale-110 transition"
                  title="Select Mood"
                >
                  {mood ? <span className="text-xl sm:text-2xl">{mood}</span> : <FiSmile />}
                </button>

                {/* Delete */}
                <button
                  onClick={handleDelete}
                  className="text-xl sm:text-2xl hover:scale-110 transition text-black"
                  title="Delete Entry"
                >
                  <FiTrash />
                </button>
              </div>

              {/* RIGHT — round Save */}
              <button
                onClick={handleUpdate}
                className="ml-3 sm:ml-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-900 transition shrink-0"
                title="Save Entry"
              >
                <FiSave className="text-lg sm:text-xl" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Delete Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowConfirm(false)} />
          <div className="relative z-10 w-11/12 max-w-md rounded-2xl bg-[#1c1b2a] text-white border border-white/10 shadow-xl p-6">
            <h3 className="text-lg font-semibold">Delete this entry?</h3>
            <p className="mt-2 text-white/80">
              This action can’t be undone. The journal entry will be permanently deleted.
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
    </div>
  );
}
