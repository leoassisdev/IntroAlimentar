import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const PASSOS_ENGASGO_MENOR_1 = [
  { titulo: "1. Avalie a situação", descricao: "O bebê está tossindo? Se SIM, incentive a tossir — NÃO bata nas costas.", emoji: "👀", cor: "border-yellow" },
  { titulo: "2. Bebê NÃO consegue tossir/respirar", descricao: "Coloque o bebê de bruços sobre seu antebraço, com a cabeça mais baixa que o corpo.", emoji: "🤲", cor: "border-destructive" },
  { titulo: "3. Cinco tapas nas costas", descricao: "Dê 5 tapas firmes entre as omoplatas (meio das costas) com a base da mão.", emoji: "✋", cor: "border-destructive" },
  { titulo: "4. Vire o bebê", descricao: "Vire o bebê de barriga para cima, apoiando a cabeça. Mantenha a cabeça mais baixa.", emoji: "🔄", cor: "border-destructive" },
  { titulo: "5. Cinco compressões torácicas", descricao: "Com 2 dedos no centro do peito (abaixo dos mamilos), faça 5 compressões firmes.", emoji: "👆", cor: "border-destructive" },
  { titulo: "6. Repita o ciclo", descricao: "Alterne 5 tapas nas costas + 5 compressões até desobstruir ou o SAMU chegar.", emoji: "🔁", cor: "border-primary" },
];

const PASSOS_ENGASGO_MAIOR_1 = [
  { titulo: "1. Avalie a situação", descricao: "A criança está tossindo? Se SIM, incentive a tossir.", emoji: "👀", cor: "border-yellow" },
  { titulo: "2. Criança NÃO respira", descricao: "Fique atrás da criança, abrace-a na altura do abdômen.", emoji: "🤗", cor: "border-destructive" },
  { titulo: "3. Manobra de Heimlich", descricao: "Feche o punho e posicione acima do umbigo. Com a outra mão, pressione para dentro e para cima.", emoji: "👊", cor: "border-destructive" },
  { titulo: "4. Repita", descricao: "Faça compressões abdominais até desobstruir ou o SAMU chegar.", emoji: "🔁", cor: "border-primary" },
];

const GAG_VS_ENGASGO = [
  { tipo: "GAG (Reflexo de Ânsia)", cor: "bg-yellow/15 border-yellow", emoji: "🟡", sinais: ["Bebê fica vermelho", "Faz cara de ânsia/nojo", "Tosse ou engasga momentaneamente", "Continua respirando", "É NORMAL na introdução alimentar"], acao: "NÃO intervir. Apenas observe. O reflexo protege o bebê." },
  { tipo: "ENGASGO REAL", cor: "bg-destructive/15 border-destructive", emoji: "🔴", sinais: ["Bebê fica SILENCIOSO", "Lábios ficam roxos/azulados", "Não consegue tossir", "Não consegue chorar", "Olhar de pânico"], acao: "AGIR IMEDIATAMENTE com manobra de desengasgo!" },
];

const REACAO_FLUXOGRAMA = [
  { nivel: "LEVE", cor: "border-yellow bg-yellow/10", emoji: "🟡", sinais: ["Manchas SÓ ao redor da boca", "Sem outros sintomas", "Bebê ativo e respirando bem"], acao: "Limpar a região, observar por 2h. Registrar no app. NÃO é emergência." },
  { nivel: "MODERADA", cor: "border-orange bg-orange/10", emoji: "🟠", sinais: ["Manchas espalhadas pelo corpo", "Coceira", "Inchaço leve nos lábios", "Vômito isolado"], acao: "Ligar para o PEDIATRA. Medicar APENAS se prescrito. Registrar com fotos." },
  { nivel: "GRAVE (ANAFILAXIA)", cor: "border-destructive bg-destructive/10", emoji: "🔴", sinais: ["Dificuldade para respirar", "Inchaço na garganta/língua", "Vômitos repetidos", "Bebê pálido ou mole", "Perda de consciência"], acao: "SAMU 192 IMEDIATAMENTE! Posição de segurança. NÃO dê nada pela boca." },
];

const EmergenciaPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"engasgo" | "alergia">("engasgo");
  const [faixaEtaria, setFaixaEtaria] = useState<"menor1" | "maior1">("menor1");
  const [passoAtual, setPasso] = useState(0);

  const passos = faixaEtaria === "menor1" ? PASSOS_ENGASGO_MENOR_1 : PASSOS_ENGASGO_MAIOR_1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-destructive/5 to-background">
      <header className="relative bg-gradient-to-br from-destructive to-destructive/80 pb-10 overflow-hidden">
        <div className="max-w-2xl mx-auto px-4 pt-4 pb-6 relative z-10">
          <div className="flex items-center gap-3">
            <button className="btn-3d text-xs py-2 px-3" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-extrabold text-white drop-shadow-sm">🚨 Central de Emergência</h1>
              <p className="text-sm text-white/80 font-semibold">Guia de ação imediata</p>
            </div>
            <a href="tel:192" className="btn-3d btn-3d-primary text-xs py-2 px-4 animate-pulse">
              <Phone className="w-4 h-4" /> SAMU 192
            </a>
          </div>
        </div>
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path d="M0,30 C250,65 500,15 750,45 C1000,70 1250,25 1440,40 L1440,60 L0,60 Z" fill="hsl(var(--background))" />
        </svg>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5 relative z-10">
        {/* Tab selector */}
        <div className="flex gap-3">
          <button onClick={() => setTab("engasgo")} className={`btn-3d flex-1 text-sm py-3 ${tab === "engasgo" ? "btn-3d-primary" : ""}`}>
            😰 Engasgo
          </button>
          <button onClick={() => setTab("alergia")} className={`btn-3d flex-1 text-sm py-3 ${tab === "alergia" ? "btn-3d-primary" : ""}`}>
            🤧 Reação Alérgica
          </button>
        </div>

        {tab === "engasgo" && (
          <>
            {/* GAG vs Engasgo */}
            <Card className="rounded-[1.5rem] border-2 border-yellow/30 overflow-hidden animate-pop-in">
              <div className="h-1.5 bg-yellow" />
              <CardContent className="p-5">
                <h3 className="font-extrabold text-base mb-4">⚠️ GAG (normal) vs ENGASGO (emergência)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {GAG_VS_ENGASGO.map((item) => (
                    <div key={item.tipo} className={`p-4 rounded-[1rem] border-2 ${item.cor}`}>
                      <h4 className="font-extrabold text-sm mb-2">{item.emoji} {item.tipo}</h4>
                      <ul className="space-y-1 mb-3">
                        {item.sinais.map((s) => (
                          <li key={s} className="text-xs font-semibold text-foreground">• {s}</li>
                        ))}
                      </ul>
                      <p className="text-xs font-extrabold text-foreground bg-card/50 p-2 rounded-lg">👉 {item.acao}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Age selector */}
            <div className="flex gap-3">
              <button onClick={() => { setFaixaEtaria("menor1"); setPasso(0); }} className={`btn-3d flex-1 text-xs py-3 ${faixaEtaria === "menor1" ? "btn-3d-secondary" : ""}`}>
                👶 Menor de 1 ano
              </button>
              <button onClick={() => { setFaixaEtaria("maior1"); setPasso(0); }} className={`btn-3d flex-1 text-xs py-3 ${faixaEtaria === "maior1" ? "btn-3d-secondary" : ""}`}>
                🧒 Maior de 1 ano
              </button>
            </div>

            {/* Step-by-step guide */}
            <Card className="rounded-[1.5rem] border-2 border-destructive/30 overflow-hidden animate-pop-in">
              <div className="h-2 bg-destructive" />
              <CardContent className="p-5">
                <h3 className="font-extrabold text-lg mb-1">Manobra de Desengasgo</h3>
                <p className="text-xs text-muted-foreground font-semibold mb-4">
                  {faixaEtaria === "menor1" ? "Bebês menores de 1 ano" : "Crianças maiores de 1 ano"}
                </p>

                {/* Progress dots */}
                <div className="flex justify-center gap-2 mb-4">
                  {passos.map((_, i) => (
                    <button key={i} onClick={() => setPasso(i)} className={`w-3 h-3 rounded-full transition-all ${i === passoAtual ? "bg-destructive scale-125" : i < passoAtual ? "bg-secondary" : "bg-muted"}`} />
                  ))}
                </div>

                <div className={`p-6 rounded-[1.2rem] border-2 ${passos[passoAtual].cor} bg-card transition-all`}>
                  <div className="text-center">
                    <span className="text-5xl block mb-3">{passos[passoAtual].emoji}</span>
                    <h4 className="font-extrabold text-lg mb-2">{passos[passoAtual].titulo}</h4>
                    <p className="text-sm font-semibold text-foreground leading-relaxed">{passos[passoAtual].descricao}</p>
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <button onClick={() => setPasso(Math.max(0, passoAtual - 1))} disabled={passoAtual === 0} className="btn-3d flex-1 text-xs py-3 disabled:opacity-40">
                    ← Anterior
                  </button>
                  <button onClick={() => setPasso(Math.min(passos.length - 1, passoAtual + 1))} disabled={passoAtual === passos.length - 1} className="btn-3d btn-3d-primary flex-1 text-xs py-3 disabled:opacity-40">
                    Próximo →
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* What NOT to do */}
            <Card className="rounded-[1.5rem] border-2 border-destructive/20 overflow-hidden animate-pop-in">
              <CardContent className="p-5">
                <h3 className="font-extrabold text-base mb-3">❌ O que NÃO fazer</h3>
                <ul className="space-y-2 text-sm font-semibold">
                  <li className="flex items-start gap-2"><span className="text-destructive">✗</span> NÃO coloque o dedo na boca do bebê para tentar tirar o alimento</li>
                  <li className="flex items-start gap-2"><span className="text-destructive">✗</span> NÃO sacuda o bebê de cabeça para baixo</li>
                  <li className="flex items-start gap-2"><span className="text-destructive">✗</span> NÃO dê água enquanto engasgado</li>
                  <li className="flex items-start gap-2"><span className="text-destructive">✗</span> NÃO entre em pânico — respire e aja</li>
                </ul>
              </CardContent>
            </Card>
          </>
        )}

        {tab === "alergia" && (
          <>
            <Card className="rounded-[1.5rem] border-2 border-yellow/30 overflow-hidden animate-pop-in">
              <div className="h-1.5 bg-yellow" />
              <CardContent className="p-5">
                <h3 className="font-extrabold text-base mb-4">🔍 Identifique o nível da reação</h3>
                <div className="space-y-4">
                  {REACAO_FLUXOGRAMA.map((item) => (
                    <div key={item.nivel} className={`p-4 rounded-[1rem] border-2 ${item.cor}`}>
                      <h4 className="font-extrabold text-sm mb-2">{item.emoji} Reação {item.nivel}</h4>
                      <ul className="space-y-1 mb-3">
                        {item.sinais.map((s) => (
                          <li key={s} className="text-xs font-semibold">• {s}</li>
                        ))}
                      </ul>
                      <div className="p-3 bg-card rounded-lg border border-border/50">
                        <p className="text-xs font-extrabold">👉 {item.acao}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Emergency contacts */}
        <Card className="rounded-[1.5rem] border-2 border-destructive/20 overflow-hidden animate-pop-in">
          <CardContent className="p-5">
            <h3 className="font-extrabold text-base mb-4">📞 Contatos de Emergência</h3>
            <div className="grid grid-cols-2 gap-3">
              <a href="tel:192" className="btn-3d btn-3d-primary text-xs py-4 w-full text-center">
                🚑 SAMU — 192
              </a>
              <a href="tel:193" className="btn-3d text-xs py-4 w-full text-center" style={{ borderColor: "hsl(354 100% 80%)", background: "hsl(354 100% 80% / 0.1)" }}>
                🚒 Bombeiros — 193
              </a>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default EmergenciaPage;
