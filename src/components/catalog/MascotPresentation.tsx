import React, { useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Flame, MessageCircle, Sparkles, ShoppingCart } from 'lucide-react';
import { StoreSettings } from '../../types/settings';

interface MascotPresentationProps {
  settings: StoreSettings;
  onScrollToCatalog: () => void;
}

export const MascotPresentation: React.FC<MascotPresentationProps> = ({
  settings,
  onScrollToCatalog,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const openWhatsAppDirect = () => {
    const cleanNum = settings.whatsappNumber.replace(/\D/g, '');
    const num = cleanNum.startsWith('55') ? cleanNum : `55${cleanNum}`;
    window.open(`https://api.whatsapp.com/send?phone=${num}&text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20as%20carnes%20da%20Butique%20da%20Carne!`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="relative mt-12 mb-6 rounded-3xl bg-gradient-to-b from-brand-dark via-brand-card to-brand-black border border-brand-red/30 shadow-2xl overflow-hidden p-5 sm:p-8">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-brand-red/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Tagline */}
      <div className="text-center sm:text-left mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-red/15 border border-brand-red/40 text-brand-red text-xs font-black uppercase tracking-wider mb-2">
          <Flame className="w-3.5 h-3.5 fill-brand-red" />
          <span>Experiência Butique da Carne</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
          Carnes na Brasa com Qualidade de Verdade
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-xl">
          Do corte nobre ao espetinho do churrasco, cada pedaço é selecionado com o padrão que você e sua família merecem.
        </p>
      </div>

      {/* Presentation Content Grid: Video on one side, Mascot on the other */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left Column: Video Player Showcase (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border-2 border-brand-border/80 shadow-2xl group">
            {/* Native Video */}
            <video
              ref={videoRef}
              src="/videos/butique_video.mp4"
              poster="https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover cursor-pointer"
              onClick={togglePlay}
            >
              <source src="/videos/butique_video.mp4" type="video/mp4" />
              <source src="/videos/churrasco.webm" type="video/webm" />
            </video>

            {/* Video overlay badge */}
            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20 text-white text-[11px] font-bold flex items-center gap-1.5 shadow">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span>CHURRASCO NOBRE</span>
            </div>

            {/* Floating Player Controls */}
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-xl bg-black/75 hover:bg-brand-red text-white flex items-center justify-center backdrop-blur-md transition-colors border border-white/20 shadow-lg min-w-[40px] min-h-[40px]"
                aria-label={isPlaying ? 'Pausar vídeo' : 'Reproduzir vídeo'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
              </button>

              <button
                onClick={toggleMute}
                className="w-10 h-10 rounded-xl bg-black/75 hover:bg-brand-red text-white flex items-center justify-center backdrop-blur-md transition-colors border border-white/20 shadow-lg min-w-[40px] min-h-[40px]"
                aria-label={isMuted ? 'Ativar som' : 'Desativar som'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-gray-400 px-1">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Carnes limpas, padronizadas e fatiadas ao seu gosto
            </span>
            <span className="text-gray-500">Vídeo demonstrativo</span>
          </div>
        </div>

        {/* Right Column: Mascot Presenting (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
          
          {/* Speech Bubble */}
          <div className="relative bg-brand-dark border-2 border-amber-500/40 rounded-2xl p-4 shadow-xl max-w-sm">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-base">🥩</span>
              <h4 className="font-black text-sm text-white uppercase tracking-wider">
                Mascote Butique da Carne
              </h4>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              "Aqui a maciez e o sabor são garantidos! Escolha seus cortes favoritos no catálogo acima, monte seu pedido e eu cuido do resto no balcão!"
            </p>
            <div className="text-[11px] text-amber-400 font-bold mt-2">
              WhatsApp: (79) 99908-8400
            </div>

            {/* Bubble arrow pointing down towards mascot on mobile, left on desktop */}
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 lg:left-8 w-4 h-4 bg-brand-dark border-b-2 border-r-2 border-amber-500/40 rotate-45" />
          </div>

          {/* Mascot Image with Presentation Gesture */}
          <div className="relative flex items-center justify-center">
            <img
              src="/images/mascot.png"
              alt="Mascote Butique da Carne apresentando os cortes"
              loading="lazy"
              className="w-56 sm:w-64 lg:w-72 h-auto object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)] filter hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 w-full pt-1">
            <button
              onClick={onScrollToCatalog}
              className="px-5 py-3 bg-brand-red hover:bg-brand-redDark text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-brand-red/30 transition-all flex items-center gap-2 min-h-[44px]"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Escolher Minhas Carnes</span>
            </button>

            <button
              onClick={openWhatsAppDirect}
              className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-900/30 transition-all flex items-center gap-1.5 min-h-[44px]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chamar no Zap</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
