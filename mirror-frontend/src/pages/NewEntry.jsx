import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FiSmile, FiTrash, FiSave, FiCalendar } from "react-icons/fi";

export default function NewEntry() {
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("");
  const [showMoodPicker, setShowMoodPicker] = useState(false);

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

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("content", content);
      formData.append("mood", mood);

      await axios.post("http://localhost:5000/api/journals", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Error saving journal:", err);
    }
  };

  const handleReset = () => {
    setContent("");
    setMood("");
    setShowMoodPicker(false);
  };

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

        {/* Textarea */}
        <textarea
          className="w-full bg-black text-white outline-none text-base sm:text-lg resize-none overflow-y-auto"
          style={{ height: "calc(100vh - 210px)" }}
          placeholder="Take a moment to reflect... what's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* Mood Picker Popup */}
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

        {/* Bottom Panel — responsive */}
        <div className="fixed bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 w-full max-w-3xl px-3 sm:px-4 z-40">
          <div className="bg-white text-black px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-xl">
            <div className="flex items-center">
              {/* LEFT — date (icon-only on mobile) */}
              <div className="flex items-center gap-2 pl-1 sm:pl-2 shrink-0">
                <FiCalendar className="text-xl sm:text-2xl" />
                <span className="hidden sm:inline text-sm font-medium tracking-wide">
                  {today.toUpperCase()}
                </span>
              </div>

              {/* CENTER — icons */}
              <div className="flex-1 flex justify-center items-center gap-10 sm:gap-20 md:gap-40">
                {/* Mood */}
                <button
                  onClick={() => setShowMoodPicker((v) => !v)}
                  className="text-xl sm:text-2xl hover:scale-110 transition"
                  title="Select Mood"
                >
                  {mood ? <span className="text-xl sm:text-2xl">{mood}</span> : <FiSmile />}
                </button>

                {/* Clear */}
                <button
                  onClick={handleReset}
                  className="text-xl sm:text-2xl hover:scale-110 transition"
                  title="Clear Entry"
                >
                  <FiTrash />
                </button>
              </div>

              {/* RIGHT — Save (slightly larger on sm+) */}
              <button
                onClick={handleSubmit}
                className="ml-3 sm:ml-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-900 transition shrink-0"
                title="Save Entry"
              >
                <FiSave className="text-lg sm:text-xl" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
