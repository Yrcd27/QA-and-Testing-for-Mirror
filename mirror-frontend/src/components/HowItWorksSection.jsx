import React from "react";

export default function HowItWorksSection() {
  return (
    <section className="py-24 px-6 md:px-12 bg-black text-white">
      <div className="max-w-6xl mx-auto">
        {/* Section heading */}
        <div className="text-center mb-16">
          <h2
            className="text-3xl md:text-5xl font-bold mb-6 animate-fade-up"
            style={{
              animationDelay: "100ms",
              fontFamily: "'Sansation', sans-serif",
            }}
          >
            Your Journaling Journey
          </h2>
        </div>

        {/* Steps timeline */}
        <div className="relative">
          {/* Vertical line for desktop */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-[#7a7ffb] to-white/20" />

          <div className="space-y-24">
            {/* Step 1 (left) */}
            <div className="relative md:flex md:items-center">
              {/* Center dot */}
              <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#7a7ffb] z-10 shadow-lg shadow-[#7a7ffb]/30" />
              {/* Connector (left -> center) */}
              <div
                className="hidden md:block absolute top-1/2 -translate-y-1/2 h-[3px] rounded-full 
                bg-gradient-to-r from-[#7a7ffb] to-white/20"
                style={{ width: 56, left: "calc(50% - 56px)" }}
              />

              {/* Content */}
              <div
                className="md:w-1/2 md:pr-16 text-right animate-fade-up"
                style={{ animationDelay: "200ms" }}
              >
                <div className="bg-white/5 p-8 rounded-xl inline-block mb-4 md:mb-0 w-full md:w-auto shadow-lg transition-all duration-300 hover:bg-[#7a7ffb]/10 hover:shadow-[#7a7ffb]/40 hover:scale-[1.02]">
                  <h3 className="text-xl font-bold mb-2 flex md:justify-end items-center gap-3">
                    <span className="md:order-2">Create Your Account</span>
                    <span className="md:order-1 w-8 h-8 rounded-full bg-[#7a7ffb]/20 flex items-center justify-center text-sm border border-[#7a7ffb]/30 md:hidden">
                      1
                    </span>
                  </h3>
                  <p className="text-gray-300">
                    Sign up to create your private journaling space. All you need
                    is an email address to get started on your reflective journey.
                  </p>
                </div>
              </div>
              <div className="md:w-1/2 md:pl-16" />
            </div>

            {/* Step 2 (right) */}
            <div className="relative md:flex md:items-center">
              <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#7a7ffb] z-10 shadow-lg shadow-[#7a7ffb]/30" />
              {/* Connector (center -> right) */}
              <div
                className="hidden md:block absolute top-1/2 -translate-y-1/2 h-[3px] rounded-full 
                bg-gradient-to-r from-[#7a7ffb] to-white/20"
                style={{ width: 56, left: "50%" }}
              />

              <div className="md:w-1/2 md:pr-16" />
              <div
                className="md:w-1/2 md:pl-16 text-left animate-fade-up"
                style={{ animationDelay: "300ms" }}
              >
                <div className="bg-white/5 p-8 rounded-xl inline-block mb-4 md:mb-0 w-full md:w-auto shadow-lg transition-all duration-300 hover:bg-[#7a7ffb]/10 hover:shadow-[#7a7ffb]/40 hover:scale-[1.02]">
                  <h3 className="text-xl font-bold mb-2 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#7a7ffb]/20 flex items-center justify-center text-sm border border-[#7a7ffb]/30 md:hidden">
                      2
                    </span>
                    <span>Set Up Your Profile</span>
                  </h3>
                  <p className="text-gray-300">
                    Personalize your experience by adding your information and
                    preferences. This is your space—make it feel like home.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 (left) */}
            <div className="relative md:flex md:items-center">
              <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#7a7ffb] z-10 shadow-lg shadow-[#7a7ffb]/30" />
              {/* Connector */}
              <div
                className="hidden md:block absolute top-1/2 -translate-y-1/2 h-[3px] rounded-full 
                bg-gradient-to-r from-[#7a7ffb] to-white/20"
                style={{ width: 56, left: "calc(50% - 56px)" }}
              />

              <div
                className="md:w-1/2 md:pr-16 text-right animate-fade-up"
                style={{ animationDelay: "400ms" }}
              >
                <div className="bg-white/5 p-8 rounded-xl inline-block mb-4 md:mb-0 w-full md:w-auto shadow-lg transition-all duration-300 hover:bg-[#7a7ffb]/10 hover:shadow-[#7a7ffb]/40 hover:scale-[1.02]">
                  <h3 className="text-xl font-bold mb-2 flex md:justify-end items-center gap-3">
                    <span className="md:order-2">Start Journaling</span>
                    <span className="md:order-1 w-8 h-8 rounded-full bg-[#7a7ffb]/20 flex items-center justify-center text-sm border border-[#7a7ffb]/30 md:hidden">
                      3
                    </span>
                  </h3>
                  <p className="text-gray-300">
                    Click '+ New Entry' to begin writing. Our distraction-free
                    editor lets you focus exclusively on your thoughts.
                  </p>
                </div>
              </div>
              <div className="md:w-1/2 md:pl-16" />
            </div>

            {/* Step 4 (right) */}
            <div className="relative md:flex md:items-center">
              <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#7a7ffb] z-10 shadow-lg shadow-[#7a7ffb]/30" />
              {/* Connector */}
              <div
                className="hidden md:block absolute top-1/2 -translate-y-1/2 h-[3px] rounded-full 
                bg-gradient-to-r from-[#7a7ffb] to-white/20"
                style={{ width: 56, left: "50%" }}
              />

              <div className="md:w-1/2 md:pr-16" />
              <div
                className="md:w-1/2 md:pl-16 text-left animate-fade-up"
                style={{ animationDelay: "500ms" }}
              >
                <div className="bg-white/5 p-8 rounded-xl inline-block mb-4 md:mb-0 w-full md:w-auto shadow-lg transition-all duration-300 hover:bg-[#7a7ffb]/10 hover:shadow-[#7a7ffb]/40 hover:scale-[1.02]">
                  <h3 className="text-xl font-bold mb-2 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#7a7ffb]/20 flex items-center justify-center text-sm border border-[#7a7ffb]/30 md:hidden">
                      4
                    </span>
                    <span>Express Your Mood</span>
                  </h3>
                  <p className="text-gray-300">
                    Select from 10 different mood emojis to capture how you're
                    feeling alongside your written reflections.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 5 (left) */}
            <div className="relative md:flex md:items-center">
              <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#7a7ffb] z-10 shadow-lg shadow-[#7a7ffb]/30" />
              {/* Connector */}
              <div
                className="hidden md:block absolute top-1/2 -translate-y-1/2 h-[3px] rounded-full 
                bg-gradient-to-r from-[#7a7ffb] to-white/20"
                style={{ width: 56, left: "calc(50% - 56px)" }}
              />

              <div
                className="md:w-1/2 md:pr-16 text-right animate-fade-up"
                style={{ animationDelay: "600ms" }}
              >
                <div className="bg-white/5 p-8 rounded-xl inline-block mb-4 md:mb-0 w-full md:w-auto shadow-lg transition-all duration-300 hover:bg-[#7a7ffb]/10 hover:shadow-[#7a7ffb]/40 hover:scale-[1.02]">
                  <h3 className="text-xl font-bold mb-2 flex md:justify-end items-center gap-3">
                    <span className="md:order-2">Review Your Journey</span>
                    <span className="md:order-1 w-8 h-8 rounded-full bg-[#7a7ffb]/20 flex items-center justify-center text-sm border border-[#7a7ffb]/30 md:hidden">
                      5
                    </span>
                  </h3>
                  <p className="text-gray-300">
                    Visit your dashboard to see all your entries organized by
                    date. Watch your collection of reflections grow over time.
                  </p>
                </div>
              </div>
              <div className="md:w-1/2 md:pl-16" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
