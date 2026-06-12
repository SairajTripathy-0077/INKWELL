'use client';

interface PowerButtonProps {
  onPowerOn: () => void;
}

export default function PowerButton({ onPowerOn }: PowerButtonProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-[#282725] border-4 border-t-[#4c4a47] border-l-[#4c4a47] border-b-[#0e0e0d] border-r-[#0e0e0d] rounded-xl shadow-2xl select-none max-w-sm w-full mx-auto z-50">

        <div className="flex flex-col items-center gap-2">
          <button
            onClick={onPowerOn}
            className="w-16 h-16 cursor-pointer bg-gradient-to-b from-[#e11d48] to-[#9f1239] active:from-[#9f1239] active:to-[#881337] border-4 border-t-[#fb7185] border-l-[#fb7185] border-b-[#4c0519] border-r-[#4c0519] active:border-t-[#4c0519] active:border-l-[#4c0519] active:border-b-[#fb7185] active:border-r-[#fb7185] rounded-lg active:translate-y-0.5 shadow-[0_6px_10px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.15)] active:shadow-[0_2px_4px_rgba(0,0,0,0.6)] transition-all flex items-center justify-center"
            title="Press to Power On"
          >
            <span className="text-white text-3xl font-bold font-sans opacity-95 active:opacity-100 select-none">⏻</span>
          </button>
          <span className="text-[9px] text-zinc-400 font-sans tracking-widest font-bold mt-1">POWER</span>
        </div>
      </div>
  );
}