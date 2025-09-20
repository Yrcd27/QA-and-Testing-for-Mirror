import React from "react";
import { Link } from "react-router-dom";
import ScrollDownIndicator from "./ScrollDownIndicator";

export default function HeroSection() {
  return (
    <section className="px-6 md:px-12 pt-10 pb-0 min-h-[50vh] bg-black text-white">
      <div className="w-full text-center space-y-6 max-w-6xl mx-auto">
        
        <h1
          className="text-4xl md:text-7xl leading-snug tracking-tight animate-fade-up text-white"
          style={{
            animationDelay: "0ms",
            fontFamily: "'Sansation', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
            fontWeight: 700, 
          }}
        >
          Mirror your journey, <br /> not just your reflection.
        </h1>

        
        <p
          className="font-sans font-normal text-lg md:text-xl text-gray-300 leading-relaxed mx-auto max-w-4xl animate-fade-up"
          style={{ animationDelay: "120ms" }}
        >
          A calm space to write your thoughts and feelings. Reflect on your day,
          add images if you like, and keep your entries private. Your mind. Your
          words. Your space.
        </p>
        
        
        <div className="relative h-16 mt-30">
          <ScrollDownIndicator />
        </div>
      </div>

      {/* Animation */}
      <style>{`
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(16px) scale(0.98); }
          60% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-up { animation: fadeUp 700ms ease-out both; }
      `}</style>
    </section>
  );
}
