import React from "react";
import { Link } from "react-router-dom";

export default function CtaSection() {
  return (
    <section className="py-24 px-6 md:px-12 bg-[#0c0b18] text-white relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute top-0 left-0 right-0 h-40 
                    bg-gradient-to-b from-black to-transparent z-0"></div>
      
      {/* Background purple glow */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                    w-[600px] h-[600px] bg-[#7a7ffb]/10 rounded-full blur-[120px] z-0"></div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="bg-gradient-to-br from-[#131225] to-[#2b212f] rounded-3xl p-8 md:p-16 
                      border border-white/10 shadow-xl animate-fade-up"
             style={{ animationDelay: "100ms" }}>
          <div className="text-center space-y-8">
            {/* Heading */}
            <h2 
              className="text-3xl md:text-5xl font-bold animate-fade-up"
              style={{
                animationDelay: "200ms",
                fontFamily: "'Sansation', sans-serif",
              }}
            >
              Begin Your Reflection Journey Today
            </h2>
            
            {/* Description */}
            <p 
              className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto animate-fade-up"
              style={{ animationDelay: "300ms" }}
            >
              Your personal growth story is waiting to unfold. Start journaling with Mirror and 
              watch as your reflections create a clearer picture of who you are.
            </p>
            
            {/* CTA Button */}
            <div className="animate-fade-up" style={{ animationDelay: "400ms" }}>
              <Link to="/signup">
                <button className="bg-[#7a7ffb] hover:bg-[#676cff] text-white px-8 py-4 
                                rounded-full text-lg font-bold transition-all duration-300
                                shadow-lg hover:shadow-[#7a7ffb]/50 transform hover:translate-y-[-2px]">
                  Get Started
                </button>
              </Link>
            </div>
            
            {/* Subtle note */}
            <p 
              className="text-sm text-gray-400 animate-fade-up"
              style={{ animationDelay: "500ms" }}
            >
              Free to use. No credit card required.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
