import React from "react";

export function OrbitalDiagram({ statsLabel }: { statsLabel: string }) {
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
    <div className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] flex items-center justify-center mx-auto mt-16 mb-24 opacity-90 hover:opacity-100 transition-opacity duration-700">
      
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
        className="absolute inset-[60px] sm:inset-[80px] md:inset-[100px] border border-white/10 rounded-full animate-spin-slow"
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
      <div className="absolute z-10 w-32 h-32 md:w-40 md:h-40 bg-[#0A0A0A] border border-white/20 rounded-full flex flex-col items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.05)]">
        <div className="text-3xl md:text-4xl font-bold text-white tracking-tight">{statsLabel.split(' ')[0]}</div>
        <div className="text-xs md:text-sm text-white/50 font-mono uppercase tracking-widest mt-1 text-center px-4">
          {statsLabel.split(' ').slice(1).join(' ')}
        </div>
      </div>
    </div>
  );
}
