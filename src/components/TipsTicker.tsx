import { useState, useEffect } from "react";

const DICAS = [
  // Primeiros passos
  { emoji: "💡", texto: "Pode levar até 15 tentativas para o bebê aceitar um alimento novo." },
  { emoji: "🥕", texto: "O alimento deve ser macio o suficiente para amassar entre dois dedos." },
  { emoji: "💧", texto: "Água não substitui o leite materno — ofereça em pequenas quantidades." },
  { emoji: "🍌", texto: "Banana é ótima para começar: macia, doce e fácil de segurar!" },
  { emoji: "⏰", texto: "Ofereça novos alimentos pela manhã para observar reações." },
  { emoji: "🥩", texto: "Ferro é essencial a partir dos 6 meses. Carnes e feijão ajudam!" },
  { emoji: "🍎", texto: "Frutas da safra são mais baratas, gostosas e nutritivas!" },
  { emoji: "👀", texto: "Sempre supervise o bebê enquanto ele come." },
  { emoji: "✂️", texto: "Para 6 meses, alimento do tamanho do seu dedo indicador." },
  { emoji: "🤢", texto: "GAG (ânsia) é normal e diferente de engasgo. Não entre em pânico!" },
  { emoji: "🥦", texto: "Varie as cores no prato: cada cor traz nutrientes diferentes." },
  { emoji: "🍯", texto: "Mel é PROIBIDO antes de 1 ano — risco de botulismo." },
  { emoji: "😊", texto: "A refeição deve ser um momento tranquilo e sem pressão." },
  { emoji: "🪑", texto: "Bebê sentado a 90° com pés apoiados para comer com segurança." },
  { emoji: "🥛", texto: "Vitamina C + ferro = melhor absorção. Ofereça fruta cítrica!" },
  // Nutrição e alimentos
  { emoji: "🥚", texto: "Ovo cozido é uma das melhores fontes de proteína para bebês. Pode oferecer desde os 6 meses!" },
  { emoji: "🫘", texto: "Feijão, lentilha e grão-de-bico são ricos em ferro vegetal. Combine com vitamina C!" },
  { emoji: "🥑", texto: "Abacate é rico em gorduras boas e ótimo para o desenvolvimento cerebral do bebê." },
  { emoji: "🍠", texto: "Batata-doce é rica em vitamina A e tem sabor adocicado que os bebês adoram." },
  { emoji: "🫒", texto: "Use azeite de oliva extra virgem no preparo dos alimentos — gordura boa para o cérebro!" },
  { emoji: "🌽", texto: "Milho verde pode ser oferecido amassado ou na espiga a partir dos 9 meses." },
  { emoji: "🥬", texto: "Folhas verdes escuras (espinafre, couve) são ricas em ferro e cálcio." },
  { emoji: "🐟", texto: "Peixes como sardinha e salmão têm ômega-3, essencial para o cérebro em formação." },
  { emoji: "🫐", texto: "Frutas vermelhas e roxas são ricas em antioxidantes. Amasse ou corte ao meio." },
  { emoji: "🍗", texto: "Carne desfiada ou em tiras é a melhor fonte de ferro heme — absorção superior ao vegetal." },
  // Segurança alimentar
  { emoji: "🧊", texto: "Alimentos congelados mantêm os nutrientes! Prepare em lote e congele por até 3 meses." },
  { emoji: "🦠", texto: "Lave bem frutas e verduras. Use solução de hipoclorito para higienizar folhas cruas." },
  { emoji: "🌡️", texto: "Sempre teste a temperatura da comida no dorso da mão antes de oferecer ao bebê." },
  { emoji: "⚠️", texto: "Uva, tomate-cereja e salsicha devem ser cortados ao meio no comprido — risco de engasgo!" },
  { emoji: "🚫", texto: "Evite suco de frutas antes de 1 ano. Prefira sempre a fruta in natura." },
  { emoji: "🧂", texto: "Não adicione sal antes de 1 ano. O bebê precisa conhecer o sabor real dos alimentos." },
  { emoji: "🍬", texto: "Açúcar antes dos 2 anos altera o paladar e aumenta risco de cáries e obesidade." },
  { emoji: "🥜", texto: "Amendoim pode ser oferecido como pasta fina desde os 6 meses — nunca inteiro!" },
  { emoji: "🫧", texto: "Não ofereça refrigerante, café, chá-preto ou achocolatado para bebês e crianças pequenas." },
  { emoji: "🧈", texto: "Leite de vaca integral só depois de 1 ano. Antes, apenas materno ou fórmula." },
  // Comportamento e rotina
  { emoji: "📱", texto: "Telas durante a refeição distraem e atrapalham os sinais de fome e saciedade." },
  { emoji: "🤲", texto: "Deixe o bebê tocar, apertar e explorar a comida. Isso faz parte do aprendizado!" },
  { emoji: "🎭", texto: "Faça caras e sons enquanto come junto — o bebê aprende por imitação!" },
  { emoji: "⏳", texto: "Uma refeição não precisa durar mais que 20-30 minutos. Se perdeu interesse, tudo bem." },
  { emoji: "🙅", texto: "Nunca force o bebê a comer. Respeitar os sinais de saciedade previne problemas futuros." },
  { emoji: "👨‍👩‍👧", texto: "Comer em família é o melhor estímulo! O bebê aprende observando vocês." },
  { emoji: "🔄", texto: "Se o bebê cuspiu, não desista! Ofereça o mesmo alimento de formas diferentes." },
  { emoji: "🎵", texto: "Cantar e conversar durante a refeição torna o momento mais leve e prazeroso." },
  { emoji: "😤", texto: "Fase de recusa é normal entre 1 e 2 anos. Continue oferecendo sem pressionar." },
  { emoji: "🍽️", texto: "Pratos coloridos e divertidos podem estimular o interesse do bebê pela comida." },
  // BLW e métodos
  { emoji: "✋", texto: "No BLW o bebê come sozinho desde o início. Ofereça alimentos que ele consiga segurar." },
  { emoji: "🥄", texto: "Método participativo: você oferece na colher E deixa o bebê explorar com as mãos." },
  { emoji: "🍝", texto: "Macarrão cozido tipo penne ou fusilli é ótimo para treinar a coordenação motora." },
  { emoji: "🧆", texto: "Bolinhos e hambúrgueres caseiros são uma forma fácil de incluir vegetais escondidos." },
  // Saúde e desenvolvimento
  { emoji: "🦷", texto: "Alimentos em pedaços estimulam a musculatura da boca e ajudam na fala." },
  { emoji: "🧠", texto: "Gorduras boas (abacate, azeite, peixe) são essenciais para o desenvolvimento cerebral." },
  { emoji: "💩", texto: "Fezes podem mudar de cor e textura com novos alimentos — é normal!" },
  { emoji: "🤧", texto: "Manchas ao redor da boca após comer não são necessariamente alergia. Pode ser irritação de contato." },
  { emoji: "📋", texto: "Anote tudo no app! O registro ajuda o pediatra a entender a evolução alimentar." },
  { emoji: "🏥", texto: "Sinais de alergia: inchaço nos lábios, urticária, vômitos. Procure o pronto-socorro!" },
  { emoji: "😴", texto: "Bebês que comem bem durante o dia tendem a dormir melhor à noite." },
  { emoji: "💪", texto: "O intestino do bebê está amadurecendo. Prisão de ventre leve é comum no início." },
  { emoji: "🌙", texto: "A última refeição sólida deve ser pelo menos 1h antes de dormir para boa digestão." },
  // Dicas práticas
  { emoji: "🧊", texto: "Cubinhos de caldo de legumes congelados são ótimos para enriquecer papinhas!" },
  { emoji: "🫕", texto: "Cozinhe legumes no vapor para preservar mais vitaminas do que na água fervente." },
  { emoji: "🥣", texto: "Varie as texturas gradualmente: pastoso → amassado → pedacinhos → pedaços maiores." },
  { emoji: "🧅", texto: "Temperos naturais como alho, cebola, salsinha e cebolinha podem ser usados desde os 6 meses." },
  { emoji: "🥤", texto: "Copinho aberto é melhor que copo de transição para o desenvolvimento oral do bebê." },
  { emoji: "🛒", texto: "Leve o bebê à feira! Ele aprende sobre alimentos e cores desde cedo." },
  { emoji: "📚", texto: "Livros infantis sobre comida ajudam a criar familiaridade com novos alimentos." },
  { emoji: "👩‍🍳", texto: "A partir de 1 ano, deixe o bebê ajudar: lavar frutas, mexer ingredientes, descascar banana." },
  { emoji: "🥗", texto: "Monte o prato do bebê com pelo menos 3 grupos: carboidrato + proteína + vegetal." },
  { emoji: "💛", texto: "Cada bebê tem seu ritmo. Compare apenas com ele mesmo, nunca com outros!" },
];

export const TipsTicker = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % DICAS.length);
        setIsAnimating(false);
      }, 300);
    }, 8000);
    return () => clearInterval(interval);
  }, [dismissed]);

  if (dismissed) return null;

  const dica = DICAS[currentIdx];

  return (
    <div className="fixed bottom-4 left-4 z-30 max-w-[280px]">
      <div
        className={`relative transition-all duration-300 ${
          isAnimating ? "opacity-0 -translate-x-2" : "opacity-100 translate-x-0"
        }`}
      >
        <div className="flex items-start gap-2.5 bg-card/90 backdrop-blur-sm rounded-xl border border-border/50 shadow-lg px-3.5 py-2.5">
          <span className="text-base shrink-0 mt-0.5">{dica.emoji}</span>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-secondary/70 uppercase tracking-wider leading-none mb-1">Dica</p>
            <p className="text-[11px] font-medium text-muted-foreground leading-snug">{dica.texto}</p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); setDismissed(true); }}
            className="text-muted-foreground/40 hover:text-muted-foreground text-sm shrink-0 -mt-0.5 -mr-1"
            title="Fechar dicas"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};
