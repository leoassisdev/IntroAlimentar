import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { bebeStore } from "@/data/store";
import { idadeEmMeses } from "@/utils/helpers";
import GradientCheckbox from "@/components/GradientCheckbox";

const ALIMENTOS_PROIBIDOS = [
  { nome: "Mel", motivo: "Risco de botulismo infantil. O sistema digestivo do bebê não combate a bactéria Clostridium botulinum.", idadeMin: 12, emoji: "🍯" },
  { nome: "Açúcar e doces", motivo: "Prejudica paladar, aumenta risco de obesidade e cáries.", idadeMin: 24, emoji: "🍬" },
  { nome: "Sal em excesso", motivo: "Rins imaturos não processam sódio adequadamente.", idadeMin: 12, emoji: "🧂" },
  { nome: "Leite de vaca integral", motivo: "Difícil digestão, pobre em ferro, pode causar anemia.", idadeMin: 12, emoji: "🥛" },
  { nome: "Café e chá preto", motivo: "Cafeína é estimulante e interfere na absorção de ferro.", idadeMin: 24, emoji: "☕" },
  { nome: "Suco de fruta", motivo: "Recomendação atual: oferecer a fruta inteira. Suco tem excesso de açúcar natural.", idadeMin: 12, emoji: "🧃" },
  { nome: "Embutidos", motivo: "Salsicha, presunto, mortadela — excesso de sódio, conservantes e nitritos.", idadeMin: 24, emoji: "🌭" },
  { nome: "Ultraprocessados", motivo: "Sem valor nutricional, excesso de aditivos químicos.", idadeMin: 36, emoji: "🍟" },
];

const RISCO_ENGASGO = [
  { alimento: "Uva inteira", risco: "alto", correto: "Cortada ao meio no comprido (longitudinal)", errado: "Inteira ou em rodela", emoji: "🍇" },
  { alimento: "Salsicha", risco: "alto", correto: "Cortada em tiras finas no comprido", errado: "Em rodelas", emoji: "🌭" },
  { alimento: "Tomate cereja", risco: "alto", correto: "Cortado em 4 partes", errado: "Inteiro", emoji: "🍅" },
  { alimento: "Maçã crua", risco: "alto", correto: "Cozida ou ralada até 9 meses", errado: "Crua em pedaços", emoji: "🍎" },
  { alimento: "Pipoca", risco: "alto", correto: "NÃO oferecer antes de 4 anos", errado: "Qualquer forma", emoji: "🍿" },
  { alimento: "Amendoim inteiro", risco: "alto", correto: "Pasta de amendoim diluída", errado: "Grão inteiro", emoji: "🥜" },
  { alimento: "Cenoura crua", risco: "alto", correto: "Cozida em palito macio", errado: "Crua em palito", emoji: "🥕" },
  { alimento: "Queijo em cubo", risco: "médio", correto: "Ralado ou em tiras finas", errado: "Em cubos grandes", emoji: "🧀" },
];

const CHECKLIST_POSICAO = [
  "Bebê sentado a 90 graus (não reclinado)",
  "Está no cadeirão adequado com cinto",
  "Pés estão apoiados (não pendurados)",
  "Adulto presente e atento",
  "NÃO está no carro/carrinho",
  "NÃO está sendo forçado a comer",
  "NÃO está rindo/chorando enquanto come",
];

const PRONTIDAO = [
  { sinal: "Sustenta a cabeça sozinho(a)", emoji: "🧠" },
  { sinal: "Senta com apoio mínimo", emoji: "🪑" },
  { sinal: "Demonstra interesse pela comida", emoji: "👀" },
  { sinal: "Perdeu o reflexo de protrusão da língua", emoji: "👅" },
  { sinal: "Leva objetos à boca", emoji: "🤲" },
  { sinal: "Completou 6 meses", emoji: "📅" },
];

const CORTES_POR_FASE = [
  { fase: "6-8 meses", descricao: "Tamanho do dedo indicador da mãe, macio o suficiente para amassar entre dois dedos", alimentos: ["Palitos grossos", "Buquês de brócolis", "Fatias de manga com casca"], emoji: "👆" },
  { fase: "8-9 meses", descricao: "Pedaços menores, bebê usa pinça. Alimentos mais variados em textura", alimentos: ["Pedaços de 1-2cm", "Arroz soltinho", "Carne desfiada"], emoji: "🤏" },
  { fase: "9-12 meses", descricao: "Tiras finas, alimentos da família adaptados. Mais autonomia", alimentos: ["Mini pedaços", "Tiras finas", "Mastigação mais eficiente"], emoji: "✂️" },
  { fase: "12+ meses", descricao: "Alimento da família com adaptações mínimas. Sem sal/açúcar excessivos", alimentos: ["Mesma comida da família", "Pedaços regulares", "Talheres adaptados"], emoji: "🍽️" },
];

const SegurancaAlimentarPage = () => {
  const navigate = useNavigate();
  const { id: bebeId } = useParams<{ id: string }>();
  const [tab, setTab] = useState<"proibidos" | "engasgo" | "cortes" | "posicao" | "prontidao">("proibidos");
  const [checklistPosicao, setChecklistPosicao] = useState<boolean[]>(new Array(CHECKLIST_POSICAO.length).fill(false));
  const [checklistProntidao, setChecklistProntidao] = useState<boolean[]>(new Array(PRONTIDAO.length).fill(false));

  const bebe = bebeId ? bebeStore.getById(bebeId) : null;
  const idadeMeses = bebe ? idadeEmMeses(bebe.data_nascimento) : 0;

  const togglePosicao = (i: number) => {
    const n = [...checklistPosicao]; n[i] = !n[i]; setChecklistPosicao(n);
  };
  const toggleProntidao = (i: number) => {
    const n = [...checklistProntidao]; n[i] = !n[i]; setChecklistProntidao(n);
  };

  const todoPronto = checklistProntidao.every(Boolean);

  return (
    <div className="min-h-screen gradient-bg">
      <div className="paint-blob-yellow" />
      <div className="paint-blob-purple" />

      <header className="relative bg-gradient-to-br from-secondary to-secondary/80 pb-10 overflow-hidden">
        <div className="max-w-2xl mx-auto px-4 pt-4 pb-6 relative z-10">
          <div className="flex items-center gap-3">
            <button className="btn-3d text-xs py-2 px-3" onClick={() => navigate(bebeId ? `/bebe/${bebeId}` : "/")}>
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-extrabold text-white drop-shadow-sm">
                <ShieldCheck className="w-5 h-5 inline mr-1" /> Segurança Alimentar
              </h1>
              <p className="text-sm text-white/80 font-semibold">Guia completo de prevenção</p>
            </div>
          </div>
        </div>
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path d="M0,30 C250,65 500,15 750,45 C1000,70 1250,25 1440,40 L1440,60 L0,60 Z" fill="hsl(40 50% 97%)" />
        </svg>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5 relative z-10">
        {/* Tab buttons */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: "proibidos", label: "🚫 Proibidos" },
            { key: "engasgo", label: "⚠️ Engasgo" },
            { key: "cortes", label: "✂️ Cortes" },
            { key: "posicao", label: "🪑 Posição" },
            { key: "prontidao", label: "✅ Prontidão" },
          ].map((t) => (
            <button key={t.key} onClick={() => setTab(t.key as any)}
              className={`text-xs font-extrabold px-4 py-2.5 rounded-[1rem] transition-all bounce-tap ${
                tab === t.key ? "bg-secondary text-white shadow-lg" : "bg-card border-2 border-border"
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === "proibidos" && (
          <div className="stagger-children space-y-3">
            {ALIMENTOS_PROIBIDOS.map((item) => (
              <Card key={item.nome} className="rounded-[1.2rem] border-2 border-destructive/20 overflow-hidden animate-pop-in">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{item.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-extrabold text-sm">{item.nome}</h3>
                        <span className="text-[10px] font-extrabold bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">
                          Proibido até {item.idadeMin}m
                        </span>
                        {bebe && idadeMeses < item.idadeMin && (
                          <span className="text-[10px] font-extrabold bg-destructive text-white px-2 py-0.5 rounded-full">🚫 BLOQUEADO</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground font-semibold">{item.motivo}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {tab === "engasgo" && (
          <div className="stagger-children space-y-3">
            {RISCO_ENGASGO.map((item) => (
              <Card key={item.alimento} className={`rounded-[1.2rem] border-2 overflow-hidden animate-pop-in ${item.risco === "alto" ? "border-destructive/30" : "border-yellow/30"}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{item.emoji}</span>
                    <h3 className="font-extrabold text-sm flex-1">{item.alimento}</h3>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${item.risco === "alto" ? "bg-destructive/10 text-destructive" : "bg-yellow/20 text-foreground"}`}>
                      Risco {item.risco}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-lg bg-secondary/10 border border-secondary/20">
                      <p className="text-[10px] font-extrabold text-secondary mb-1">✅ CORRETO</p>
                      <p className="text-xs font-semibold">{item.correto}</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-destructive/10 border border-destructive/20">
                      <p className="text-[10px] font-extrabold text-destructive mb-1">❌ ERRADO</p>
                      <p className="text-xs font-semibold">{item.errado}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {tab === "cortes" && (
          <div className="stagger-children space-y-4">
            {CORTES_POR_FASE.map((fase) => (
              <Card key={fase.fase} className={`rounded-[1.5rem] border-2 overflow-hidden animate-pop-in ${bebe && fase.fase.includes(String(Math.min(Math.max(idadeMeses, 6), 13))) ? "border-primary/30 shadow-lg" : "border-border"}`}>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{fase.emoji}</span>
                    <h3 className="font-extrabold text-sm">{fase.fase}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground font-semibold mb-3">{fase.descricao}</p>
                  <div className="flex flex-wrap gap-2">
                    {fase.alimentos.map((a) => (
                      <span key={a} className="text-xs font-bold bg-primary/10 px-3 py-1.5 rounded-full">{a}</span>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground font-semibold mt-3 italic">
                    💡 Regra prática: o alimento deve estar macio o suficiente para amassar entre dois dedos
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {tab === "posicao" && (
          <Card className="rounded-[1.5rem] border-2 border-secondary/20 overflow-hidden animate-pop-in">
            <div className="h-1.5 bg-secondary" />
            <CardContent className="p-5 space-y-4">
              <h3 className="font-extrabold text-base">🪑 Checklist de Posição Segura</h3>
              <p className="text-xs text-muted-foreground font-semibold">Verifique antes de cada refeição:</p>
              <div className="space-y-3">
                {CHECKLIST_POSICAO.map((item, i) => (
                  <GradientCheckbox key={item} checked={checklistPosicao[i]} onChange={() => togglePosicao(i)} label={item} />
                ))}
              </div>
              {checklistPosicao.every(Boolean) && (
                <div className="p-4 bg-secondary/10 rounded-[1rem] border-2 border-secondary/20 text-center">
                  <span className="text-3xl block mb-1">✅</span>
                  <p className="text-sm font-extrabold text-secondary">Tudo certo! Refeição segura!</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {tab === "prontidao" && (
          <Card className="rounded-[1.5rem] border-2 border-primary/20 overflow-hidden animate-pop-in">
            <div className="h-1.5 bg-primary" />
            <CardContent className="p-5 space-y-4">
              <h3 className="font-extrabold text-base">✅ Sinais de Prontidão</h3>
              <p className="text-xs text-muted-foreground font-semibold">O bebê precisa apresentar TODOS os sinais para iniciar a introdução alimentar:</p>
              <div className="space-y-3">
                {PRONTIDAO.map((item, i) => (
                  <GradientCheckbox key={item.sinal} checked={checklistProntidao[i]} onChange={() => toggleProntidao(i)} label={`${item.emoji} ${item.sinal}`} />
                ))}
              </div>
              {todoPronto ? (
                <div className="p-4 bg-secondary/10 rounded-[1rem] border-2 border-secondary/20 text-center">
                  <span className="text-3xl block mb-1">🎉</span>
                  <p className="text-sm font-extrabold text-secondary">Bebê pronto para a introdução alimentar!</p>
                </div>
              ) : (
                <div className="p-4 bg-yellow/10 rounded-[1rem] border-2 border-yellow/20 text-center">
                  <span className="text-3xl block mb-1">⏳</span>
                  <p className="text-sm font-extrabold text-foreground">Aguarde todos os sinais antes de iniciar</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default SegurancaAlimentarPage;
