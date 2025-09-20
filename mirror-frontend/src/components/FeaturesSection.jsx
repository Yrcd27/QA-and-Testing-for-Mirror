import React from "react";

export default function FeaturesSection() {
  return (
    <section className="py-24 px-6 md:px-12 bg-[#0c0b18] text-white">
      <div className="max-w-6xl mx-auto">
        {/* Section heading with animation */}
        <div className="text-center mb-16">
          <h2 
            className="text-3xl md:text-5xl font-bold mb-6 animate-fade-up"
            style={{
              animationDelay: "100ms",
              fontFamily: "'Sansation', sans-serif",
            }}
          >
            Your Personal Mirror
          </h2>
          <p 
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto animate-fade-up"
            style={{ animationDelay: "200ms" }}
          >
            Mirror offers a suite of features designed to enhance your journaling experience:
          </p>
        </div>
        
        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div 
            className="bg-gradient-to-br from-black to-[#131225] p-8 rounded-xl shadow-lg 
                      hover:shadow-[#7a7ffb]/20 hover:translate-y-[-8px] transition-all duration-500 animate-fade-up"
            style={{ animationDelay: "300ms" }}
          >
            <div className="w-16 h-16 rounded-full bg-[#7a7ffb]/10 flex items-center justify-center mb-6 border border-[#7a7ffb]/30">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Private Journaling Space</h3>
            <p className="text-gray-400">Your thoughts stay private with secure authentication and protected entries.</p>
          </div>
          
          {/* Feature 2 */}
          <div 
            className="bg-gradient-to-br from-black to-[#131225] p-8 rounded-xl shadow-lg 
                      hover:shadow-[#7a7ffb]/20 hover:translate-y-[-8px] transition-all duration-500 animate-fade-up"
            style={{ animationDelay: "400ms" }}
          >
            <div className="w-16 h-16 rounded-full bg-[#7a7ffb]/10 flex items-center justify-center mb-6 border border-[#7a7ffb]/30">
              <span className="text-2xl">😊</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Mood Tracking</h3>
            <p className="text-gray-400">Capture your emotional state with our intuitive mood selector featuring 10 different emotions.</p>
          </div>
          
          {/* Feature 3 */}
          <div 
            className="bg-gradient-to-br from-black to-[#131225] p-8 rounded-xl shadow-lg 
                      hover:shadow-[#7a7ffb]/20 hover:translate-y-[-8px] transition-all duration-500 animate-fade-up"
            style={{ animationDelay: "500ms" }}
          >
            <div className="w-16 h-16 rounded-full bg-[#7a7ffb]/10 flex items-center justify-center mb-6 border border-[#7a7ffb]/30">
              <span className="text-2xl">📅</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Daily Reflections</h3>
            <p className="text-gray-400">Easily organize and access your entries by date with our clean, minimalist interface.</p>
          </div>
          
          {/* Feature 4 */}
          <div 
            className="bg-gradient-to-br from-black to-[#131225] p-8 rounded-xl shadow-lg 
                      hover:shadow-[#7a7ffb]/20 hover:translate-y-[-8px] transition-all duration-500 animate-fade-up"
            style={{ animationDelay: "600ms" }}
          >
            <div className="w-16 h-16 rounded-full bg-[#7a7ffb]/10 flex items-center justify-center mb-6 border border-[#7a7ffb]/30">
              <span className="text-2xl">👤</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Customizable Profile</h3>
            <p className="text-gray-400">Make Mirror your own by personalizing your profile with your information and preferences.</p>
          </div>
          
          {/* Feature 5 */}
          <div 
            className="bg-gradient-to-br from-black to-[#131225] p-8 rounded-xl shadow-lg 
                      hover:shadow-[#7a7ffb]/20 hover:translate-y-[-8px] transition-all duration-500 animate-fade-up"
            style={{ animationDelay: "700ms" }}
          >
            <div className="w-16 h-16 rounded-full bg-[#7a7ffb]/10 flex items-center justify-center mb-6 border border-[#7a7ffb]/30">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Distraction-Free Writing</h3>
            <p className="text-gray-400">Our clean, dark-themed interface eliminates distractions, allowing you to focus solely on your thoughts.</p>
          </div>
          
          {/* Feature 6 - Extra feature to complete the grid */}
          <div 
            className="bg-gradient-to-br from-black to-[#131225] p-8 rounded-xl shadow-lg 
                      hover:shadow-[#7a7ffb]/20 hover:translate-y-[-8px] transition-all duration-500 animate-fade-up"
            style={{ animationDelay: "800ms" }}
          >
            <div className="w-16 h-16 rounded-full bg-[#7a7ffb]/10 flex items-center justify-center mb-6 border border-[#7a7ffb]/30">
              <span className="text-2xl">🌙</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Dark Mode Interface</h3>
            <p className="text-gray-400">Easy on the eyes with a beautiful dark theme perfect for morning or night journaling sessions.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
