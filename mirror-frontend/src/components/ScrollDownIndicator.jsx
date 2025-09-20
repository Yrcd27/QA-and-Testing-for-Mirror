import React from "react";

export default function ScrollDownIndicator() {
  return (
    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce">
      <div className="w-6 h-10 border-2 border-[#7a7ffb] rounded-full flex items-start justify-center p-1">
        <div className="w-1.5 h-3 bg-[#7a7ffb] rounded-full animate-scroll"></div>
      </div>
      <span className="mt-2 text-sm text-[#7a7ffb]">Scroll Down</span>
      
      
      <style>{`
        @keyframes scroll {
          0% { transform: translateY(0); opacity: 1; }
          30% { opacity: 1; }
          60% { transform: translateY(6px); opacity: 0; }
          100% { transform: translateY(0); opacity: 0; }
        }
        .animate-scroll {
          animation: scroll 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
