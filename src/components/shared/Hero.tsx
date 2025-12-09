import { Info, Play } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative h-[56.25vw] min-h-[80vh] w-full">
      {/* BACKGROUND VIDEO (Or Image Fallback) */}
      <video 
        className="absolute top-0 left-0 h-full w-full object-cover brightness-[60%]"
        autoPlay 
        muted 
        loop 
        poster="https://wallpapers.com/images/hd/netflix-background-gs7hjuwvv2g0e9fj.jpg"
        src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" // Vídeo de teste open source
      />

      {/* GRADIENT OVERLAY (Fade to bottom) */}
      <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />

      {/* CONTENT CONTAINER */}
      <div className="absolute top-[30%] md:top-[40%] left-4 md:left-12 w-[90%] md:w-[40%] z-10">
        
        {/* Title */}
        <h1 className="text-white text-4xl md:text-6xl font-bold drop-shadow-xl mb-4 transition-transform duration-500">
          Big Buck Bunny
        </h1>

        {/* Description */}
        <p className="text-white text-[10px] md:text-lg drop-shadow-md mb-6 font-medium">
          A giant rabbit with a heart bigger than himself. Watch as he seeks revenge on the bullying rodents in this open-source classic.
        </p>

        {/* Buttons */}
        <div className="flex flex-row items-center gap-3">
          <button className="bg-white text-black text-sm md:text-xl font-bold px-4 py-2 md:px-8 md:py-3 rounded hover:bg-white/80 transition flex items-center gap-2 cursor-pointer">
            <Play className="w-4 h-4 md:w-6 md:h-6 fill-black" />
            Play
          </button>
          
          <button className="bg-gray-500/70 text-white text-sm md:text-xl font-bold px-4 py-2 md:px-8 md:py-3 rounded hover:bg-gray-500/50 transition flex items-center gap-2 cursor-pointer backdrop-blur-sm">
            <Info className="w-4 h-4 md:w-6 md:h-6" />
            More Info
          </button>
        </div>
      </div>
    </div>
  );
}