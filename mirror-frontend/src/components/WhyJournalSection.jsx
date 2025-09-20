import React from "react";

export default function WhyJournalSection() {
  return (
    <section className="py-24 px-6 md:px-12 bg-black text-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Section heading with animation */}
        <h2 
          className="text-3xl md:text-5xl font-bold mb-10 animate-fade-up"
          style={{
            animationDelay: "100ms",
            fontFamily: "'Sansation', sans-serif",
          }}
        >
          Why Journal with Mirror?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left side content */}
          <div className="space-y-8 animate-fade-up" style={{ animationDelay: "200ms" }}>
            <p className="text-lg md:text-xl leading-relaxed text-gray-300">
              Journaling is more than just recording events—it's about understanding yourself. 
              Mirror provides a digital safe space to reflect on your thoughts, explore your 
              feelings, and track your personal growth journey.
            </p>
            
            {/* Quote with styling */}
            <blockquote className="border-l-4 border-[#7a7ffb] pl-6 py-2 italic text-gray-300">
              "In the journal I do not just express myself more openly than I could do to any person; 
              I create myself."
              <footer className="text-[#7a7ffb] mt-2 font-semibold">— Susan Sontag</footer>
            </blockquote>
          </div>
          
          {/* Right side - Visual element with gradient */}
          <div className="rounded-2xl overflow-hidden shadow-xl h-80 relative animate-fade-up" 
               style={{ animationDelay: "300ms" }}>
            <div className="absolute inset-0 bg-gradient-to-r from-[#131225] to-[#2b212f] opacity-70"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full flex">
                <div className="w-1/2 flex items-center justify-center border-r border-white/10">
                  <div className="text-center p-6">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-black/30 
                                  flex items-center justify-center border border-white/20">
                      <span className="text-2xl">✍️</span>
                    </div>
                    <p className="text-sm md:text-base font-medium">Journaling</p>
                  </div>
                </div>
                <div className="w-1/2 flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#7a7ffb]/20 
                                  flex items-center justify-center border border-[#7a7ffb]/40">
                      <span className="text-2xl">✨</span>
                    </div>
                    <p className="text-sm md:text-base font-medium">Growth</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Benefits subsection */}
        <div className="mt-20">
          <h3 
            className="text-xl md:text-2xl font-bold mb-10 animate-fade-up"
            style={{ 
              animationDelay: "400ms",
              fontFamily: "'Sansation', sans-serif"
            }}
          >
            Benefits of Journaling
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Benefit 1 */}
            <div 
              className="bg-white/5 p-6 rounded-xl hover:bg-white/10 transition-all duration-300 
                        border border-white/10 animate-fade-up"
              style={{ animationDelay: "500ms" }}
            >
              <div className="text-2xl mb-4 text-[#7a7ffb]">🧠</div>
              <h4 className="font-bold text-lg mb-2">Mental Clarity</h4>
              <p className="text-gray-400">Transform scattered thoughts into organized reflections</p>
            </div>
            
            {/* Benefit 2 */}
            <div 
              className="bg-white/5 p-6 rounded-xl hover:bg-white/10 transition-all duration-300 
                        border border-white/10 animate-fade-up"
              style={{ animationDelay: "600ms" }}
            >
              <div className="text-2xl mb-4 text-[#7a7ffb]">❤️</div>
              <h4 className="font-bold text-lg mb-2">Emotional Processing</h4>
              <p className="text-gray-400">Understand and navigate complex emotions through written expression</p>
            </div>
            
            {/* Benefit 3 */}
            <div 
              className="bg-white/5 p-6 rounded-xl hover:bg-white/10 transition-all duration-300 
                        border border-white/10 animate-fade-up"
              style={{ animationDelay: "700ms" }}
            >
              <div className="text-2xl mb-4 text-[#7a7ffb]">🧘</div>
              <h4 className="font-bold text-lg mb-2">Stress Reduction</h4>
              <p className="text-gray-400">Release daily tensions and find calm through journaling practice</p>
            </div>
            
            {/* Benefit 4 */}
            <div 
              className="bg-white/5 p-6 rounded-xl hover:bg-white/10 transition-all duration-300 
                        border border-white/10 animate-fade-up"
              style={{ animationDelay: "800ms" }}
            >
              <div className="text-2xl mb-4 text-[#7a7ffb]">📈</div>
              <h4 className="font-bold text-lg mb-2">Personal Growth</h4>
              <p className="text-gray-400">Track your journey and witness your evolution over time</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
