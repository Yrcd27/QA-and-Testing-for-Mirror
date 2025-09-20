import React from "react";

export default function PromptsSection() {
  // Array of prompts
  const prompts = [
    "What brought you joy today, no matter how small?",
    "Describe a challenge you faced and what you learned from it.",
    "What are you grateful for in this moment?",
    "How do you feel right now, and why might you be feeling this way?",
    "What's one thing you'd like your future self to remember about today?"
  ];
  
  return (
    <section className="py-24 px-6 md:px-12 bg-black text-white relative overflow-hidden">
      {/* Background abstract shape */}
      <div className="absolute -bottom-80 -left-80 w-[600px] h-[600px] rounded-full 
                    bg-gradient-to-r from-[#7a7ffb]/10 to-transparent blur-3xl"></div>
      <div className="absolute -top-80 -right-80 w-[600px] h-[600px] rounded-full 
                    bg-gradient-to-l from-[#7a7ffb]/10 to-transparent blur-3xl"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section heading */}
        <div className="text-center mb-16">
          <h2 
            className="text-3xl md:text-5xl font-bold mb-6 animate-fade-up"
            style={{
              animationDelay: "100ms",
              fontFamily: "'Sansation', sans-serif",
            }}
          >
            Not Sure Where to Start?
          </h2>
          <p 
            className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto animate-fade-up"
            style={{ animationDelay: "200ms" }}
          >
            Here are some thoughtful prompts to inspire your journaling journey:
          </p>
        </div>
        
        {/* Prompt cards with hover animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {prompts.map((prompt, index) => (
            <div 
              key={index}
              className="border border-white/10 bg-white/5 backdrop-blur-sm rounded-xl p-6 md:p-8
                        hover:border-[#7a7ffb]/30 transition-all duration-300 group
                        animate-fade-up"
              style={{ animationDelay: `${(index + 3) * 100}ms` }}
            >
              <div className="flex">
                {/* Quote icon with animated highlight */}
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 
                              group-hover:bg-[#7a7ffb]/20 transition-all duration-500 mr-4">
                  <span className="text-lg">💭</span>
                </div>
                
                {/* Prompt text with typewriter-like animation */}
                <p className="text-lg text-gray-300 group-hover:text-white transition-all duration-300">
                  {prompt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
