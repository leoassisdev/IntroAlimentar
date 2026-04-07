import { useState, useEffect } from "react";

const DICAS = [
  { emoji: "💡", texto: "Pode levar até 15 tentativas para o bebê aceitar um alimento novo. Não desista!" },
  { emoji: "🥕", texto: "O alimento deve ser macio o suficiente para amassar entre dois dedos." },
  { emoji: "💧", texto: "Água não substitui o leite materno — ofereça em pequenas quantidades." },
  { emoji: "🍌", texto: "Banana é ótima para começar: macia, doce e fácil de segurar!" },
  { emoji: "⏰", texto: "Ofereça alimentos novos sempre pela manhã — assim dá tempo de observar reações." },
  { emoji: "🥩", texto: "Ferro é essencial a partir dos 6 meses. Carnes e feijão são ótimas fontes!" },
  { emoji: "🍎", texto: "Frutas da safra são mais baratas, gostosas e nutritivas!" },
  { emoji: "👀", texto: "Sempre supervise o bebê enquanto ele come. Nunca deixe sozinho." },
  { emoji: "✂️", texto: "Para bebês de 6 meses, o alimento deve ter o tamanho do seu dedo indicador." },
  { emoji: "🤢", texto: "GAG (ânsia) é normal e diferente de engasgo. Observe e não entre em pânico!" },
  { emoji: "🥦", texto: "Varie as cores no prato: cada cor traz nutrientes diferentes." },
  { emoji: "🍯", texto: "Mel é PROIBIDO antes de 1 ano — risco de botulismo infantil." },
  { emoji: "😊", texto: "A refeição deve ser um momento tranquilo e sem pressão." },
  { emoji: "🪑", texto: "O bebê deve estar sentado a 90° com os pés apoiados para comer com segurança." },
  { emoji: "🥛", texto: "Vitamina C junto com ferro ajuda na absorção. Ofereça fruta cítrica nas refeições!" },
];

export const TipsTicker = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % DICAS.length);
        setIsAnimating(false);
      }, 400);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const dica = DICAS[currentIdx];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none flex justify-center pb-24">
      <div className={`pointer-events-auto max-w-md mx-4 transition-all duration-400 ${isAnimating ? "opacity-0 translate-y-2 scale-95" : "opacity-100 translate-y-0 scale-100"}`}>
        <div className="relative flex items-center gap-3 bg-card/95 backdrop-blur-md rounded-2xl border-2 border-primary/15 shadow-xl px-4 py-3 overflow-hidden">
          {/* Animated gradient bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent animate-gradient-x" />
          
          {/* Wavy left edge */}
          <svg width="12" height="48" viewBox="0 0 12 48" className="shrink-0 -ml-4">
            <path d="M6 0 Q2 4.8,6 9.6 T6 19.2 Q2 24,6 28.8 T6 38.4 Q2 43.2,6 48 L0 48 L0 0 Z" fill="hsl(var(--secondary))" />
          </svg>

          <span className="text-2xl shrink-0">{dica.emoji}</span>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-extrabold text-secondary uppercase tracking-wider">Dica da Nutricionista</p>
            <p className="text-xs font-semibold text-foreground leading-snug">{dica.texto}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
