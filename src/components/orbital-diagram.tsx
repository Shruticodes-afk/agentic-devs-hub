import React from "react";

export function OrbitalDiagram() {
  const innerAvatars = ["🧑‍💻", "👩‍🚀", "🤖"];
  const outerAvatars = ["👨‍🔬", "👩‍💻", "🧙‍♂️", "🕵️‍♀️", "🧑‍🎓"];

  const getPosition = (index: number, total: number) => {
    // subtract 90 degrees (PI/2) to start at top
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    const x = 50 + 50 * Math.cos(angle);
    const y = 50 + 50 * Math.sin(angle);
    return { x, y };
  };

  return (
    <div className="relative w-[450px] h-[450px] sm:w-[600px] sm:h-[600px] md:w-[750px] md:h-[750px] flex items-center justify-center mx-auto opacity-20 pointer-events-none">
      
      {/* Outer Ring */}
      <div className="absolute inset-0 border border-white/10 rounded-full animate-spin-slow">
        {outerAvatars.map((avatar, i) => {
          const { x, y } = getPosition(i, outerAvatars.length);
          return (
            <div
              key={i}
              className="absolute w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-[#0A0A0A] border border-white/20 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.05)]"
              style={{
                top: `${y}%`,
                left: `${x}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="animate-spin-slow-reverse flex items-center justify-center w-full h-full">
                <span className="text-lg md:text-xl">{avatar}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inner Ring */}
      {/* Give inner ring a slightly reversed or faster spin */}
      <div 
        className="absolute inset-[90px] sm:inset-[120px] md:inset-[150px] border border-white/10 rounded-full animate-spin-slow"
        style={{ animationDirection: "reverse", animationDuration: "30s" }}
      >
        {innerAvatars.map((avatar, i) => {
          const { x, y } = getPosition(i, innerAvatars.length);
          return (
            <div
              key={i}
              className="absolute w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-[#0A0A0A] border border-white/20 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.05)]"
              style={{
                top: `${y}%`,
                left: `${x}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="animate-spin-slow flex items-center justify-center w-full h-full" style={{ animationDuration: "30s" }}>
                <span className="text-lg md:text-xl">{avatar}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Center Hub */}
      <div className="absolute z-10 w-24 h-24 md:w-32 md:h-32 bg-[#0A0A0A] border border-white/20 rounded-full flex flex-col items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.05)]">
        {/* Simple glowing icon instead of text */}
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
           <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
        </div>
      </div>
    </div>
  );
}
