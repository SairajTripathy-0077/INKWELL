'use client'

interface PowerButtonProps{
    onPowerOn: () => void;
}

export default function PowerButton({onPowerOn}: PowerButtonProps){
    return (
        <div className='flex flex-col items-center justify-center space-y-4 z-50'>
            <button
                onClick={onPowerOn}
                className="bg-zinc-800 text-green-500 border-4 border-zinc-600 px-8 py-4 text-4xl tracking-widest uppercase cursor-pointer rounded-xl shadow-[0_0_15px_#0f0] transition-all hover:bg-green-500 hover:text-black hover:shadow-[0_0_30px_#0f0] active:scale-95"
            >
                Power On
            </button>
            <p className="text-zinc-500 text-xl tracking-widest">
                INKWELL OS // SYSTEM OFFLINE
            </p>
        </div>
    )
}