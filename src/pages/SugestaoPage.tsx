import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, Lightbulb, TrendingUp, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { bebeStore, registroStore } from "@/data/store";
import { idadeEmMeses, faseAlimentar } from "@/utils/helpers";
import { FOOD_DATABASE } from "@/data/foods";
import { CATEGORIA_LABELS } from "@/types";
import type { Bebe, RegistroAlimentar, CategoriaAlimento } from "@/types";

function getScoreNutricional(registros: RegistroAlimentar[]): { score: number; nivel: string; cor: string; emoji: string } {
  if (registros.length === 0) return { score: 0, nivel: "Sem dados", cor: "text-muted-foreground", emoji: "⚪" };
  const cats = new Set(registros.map(r => r.categoria));
  const alimentos = new Set(registros.map(r => r.nome_alimento));
  const aceitacoes = registros.filter(r => r.aceitacao).map(r => r.aceitacao!);
  const mediaAceitacao = aceitacoes.length > 0 ? aceitacoes.reduce((a, b) => a + b, 0) / aceitacoes.length : 0;

  let score = 0;
  score += Math.min(cats.size * 15, 30);  // diversidade de categorias
  score += Math.min(alimentos.size * 5, 40); // variedade
  score += Math.min(mediaAceitacao * 6, 30); // aceitação

  if (score >= 70) return { score, nivel: "Equilibrado", cor: "text-secondary", emoji: "🟢" };
  if (score >= 40) return { score, nivel: "Médio", cor: "text-yellow", emoji: "🟡" };
  return { score, nivel: "Desequilibrado", cor: "text-destructive", emoji: "🔴" };
}

function getAlimentosNaoExplorados(registros: RegistroAlimentar[]): Record<string, string[]> {
  const comidos = new Set(registros.map(r => r.nome_alimento));
  const naoExplorados: Record<string, string[]> = {};
  const cats: CategoriaAlimento[] = ["frutas", "vegetais_folhosos", "legumes", "proteinas", "cereais", "leguminosas"];
  for (const cat of cats) {
    const faltam = (FOOD_DATABASE[cat] || []).filter(a => !comidos.has(a.nome)).map(a => a.nome);
    if (faltam.length > 0) naoExplorados[cat] = faltam;
  }
  return naoExplorados;
}

function getPadroesAceitacao(registros: RegistroAlimentar[]): string[] {
  const insights: string[] = [];
  const porCategoria: Record<string, number[]> = {};
  const porRefeicao: Record<string, number[]> = {};

  registros.forEach(r => {
    if (!r.aceitacao) return;
    if (!porCategoria[r.categoria]) porCategoria[r.categoria] = [];
    porCategoria[r.categoria].push(r.aceitacao);
    if (!porRefeicao[r.tipo_refeicao]) porRefeicao[r.tipo_refeicao] = [];
    porRefeicao[r.tipo_refeicao].push(r.aceitacao);
  });

  // melhor categoria
  let melhorCat = "", melhorMedia = 0;
  Object.entries(porCategoria).forEach(([cat, vals]) => {
    const m = vals.reduce((a, b) => a + b, 0) / vals.length;
    if (m > melhorMedia) { melhorMedia = m; melhorCat = cat; }
  });
  if (melhorCat) {
    const label = CATEGORIA_LABELS[melhorCat as CategoriaAlimento]?.split(" ").slice(1).join(" ") || melhorCat;
    insights.push(`🏆 Melhor aceitação: ${label} (média ${melhorMedia.toFixed(1)})`);
  }

  // melhor refeição
  let melhorRef = "", melhorRefMedia = 0;
  Object.entries(porRefeicao).forEach(([ref, vals]) => {
    const m = vals.reduce((a, b) => a + b, 0) / vals.length;
    if (m > melhorRefMedia) { melhorRefMedia = m; melhorRef = ref; }
  });
  if (melhorRef) {
    insights.push(`⏰ Melhor horário: ${melhorRef.replace("_", " ")} (média ${melhorRefMedia.toFixed(1)})`);
  }

  // rejeitados recorrentes
  const rejeitados: Record<string, number> = {};
  registros.forEach(r => {
    if (r.aceitacao && r.aceitacao <= 2) rejeitados[r.nome_alimento] = (rejeitados[r.nome_alimento] || 0) + 1;
  });
  const recorrentes = Object.entries(rejeitados).filter(([, c]) => c >= 2).map(([n]) => n);
  if (recorrentes.length > 0) {
    insights.push(`📉 Rejeitados recorrentes: ${recorrentes.join(", ")} — tente outro corte ou preparo`);
  }

  return insights;
}

function getSugestaoHoje(registros: RegistroAlimentar[], idadeMeses: number): { prato: string[]; refeicao: string } {
  const hoje = new Date().toISOString().split("T")[0];
  const hojeRegs = registros.filter(r => r.data === hoje);
  const hora = new Date().getHours();

  let refeicao = "almoço";
  if (hora < 10) refeicao = "café da manhã";
  else if (hora >= 10 && hora < 14) refeicao = "almoço";
  else if (hora >= 14 && hora < 17) refeicao = "lanche da tarde";
  else refeicao = "jantar";

  const jaComeramHoje = new Set(hojeRegs.map(r => r.nome_alimento));
  const semanaPassada = registros.filter(r => {
    const d = new Date(r.data);
    const diff = (new Date().getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  });
  const frequencia: Record<string, number> = {};
  semanaPassada.forEach(r => { frequencia[r.nome_alimento] = (frequencia[r.nome_alimento] || 0) + 1; });

  const prato: string[] = [];
  const cats: CategoriaAlimento[] = ["cereais", "leguminosas", "proteinas", "legumes"];
  for (const cat of cats) {
    const opcoes = (FOOD_DATABASE[cat] || [])
      .filter(a => !jaComeramHoje.has(a.nome))
      .sort((a, b) => (frequencia[a.nome] || 0) - (frequencia[b.nome] || 0));
    if (opcoes.length > 0) prato.push(opcoes[0].nome);
  }

  return { prato, refeicao };
}

function gerarListaCompras(registros: RegistroAlimentar[]): Record<string, string[]> {
  const semana = registros.filter(r => {
    const d = new Date(r.data);
    const diff = (new Date().getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  });
  const alimentos = new Set(semana.map(r => r.nome_alimento));
  const lista: Record<string, string[]> = {};
  const cats: CategoriaAlimento[] = ["frutas", "vegetais_folhosos", "legumes", "proteinas", "cereais", "leguminosas"];
  for (const cat of cats) {
    const items = (FOOD_DATABASE[cat] || []).filter(a => alimentos.has(a.nome)).map(a => a.nome);
    if (items.length > 0) {
      const label = CATEGORIA_LABELS[cat]?.split(" ").slice(1).join(" ") || cat;
      lista[label] = items;
    }
  }
  return lista;
}

const SugestaoPage = () => {
  const { id: bebeId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bebe, setBebe] = useState<Bebe | null>(null);
  const [registros, setRegistros] = useState<RegistroAlimentar[]>([]);
  const [tab, setTab] = useState<"sugestao" | "explorar" | "score" | "padroes" | "compras">("sugestao");

  useEffect(() => {
    if (!bebeId) return;
    const b = bebeStore.getById(bebeId);
    if (!b) { navigate("/"); return; }
    setBebe(b);
    setRegistros(registroStore.listByBebe(bebeId));
  }, [bebeId, navigate]);

  if (!bebe || !bebeId) return null;

  const idade = idadeEmMeses(bebe.data_nascimento);
  const fase = faseAlimentar(bebe.data_nascimento);
  const score = getScoreNutricional(registros);
  const naoExplorados = getAlimentosNaoExplorados(registros);
  const padroes = getPadroesAceitacao(registros);
  const sugestao = getSugestaoHoje(registros, idade);
  const totalAlimentos = Object.values(FOOD_DATABASE).flat().length;
  const experimentados = new Set(registros.map(r => r.nome_alimento)).size;
  const listaCompras = gerarListaCompras(registros);

  return (
    <div className="min-h-screen gradient-bg">
      <div className="paint-blob-yellow" />
      <div className="paint-blob-purple" />

      <header className="relative bg-gradient-to-br from-purple to-accent/80 pb-10 overflow-hidden">
        <div className="absolute top-4 right-10 w-14 h-14 rounded-full bg-yellow/25 animate-float" />
        <div className="max-w-2xl mx-auto px-4 pt-4 pb-6 relative z-10">
          <div className="flex items-center gap-3">
            <button className="btn-3d text-xs py-2 px-3" onClick={() => navigate(`/bebe/${bebeId}`)}>
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-extrabold text-white drop-shadow-sm">
                <Sparkles className="w-5 h-5 inline mr-1" /> Inteligência Alimentar
              </h1>
              <p className="text-sm text-white/80 font-semibold">{bebe.nome} · {fase.fase}</p>
            </div>
          </div>
        </div>
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path d="M0,30 C250,65 500,15 750,45 C1000,70 1250,25 1440,40 L1440,60 L0,60 Z" fill="hsl(40 50% 97%)" />
        </svg>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5 relative z-10">
        <div className="flex flex-wrap gap-2">
          {[
            { key: "sugestao", label: "🍽️ Sugestão" },
            { key: "explorar", label: "🔍 Explorar" },
            { key: "score", label: "📊 Score" },
            { key: "padroes", label: "🧠 Padrões" },
            { key: "compras", label: "🛒 Compras" },
          ].map((t) => (
            <button key={t.key} onClick={() => setTab(t.key as any)}
              className={`text-xs font-extrabold px-4 py-2.5 rounded-[1rem] transition-all bounce-tap ${
                tab === t.key ? "bg-purple text-white shadow-lg" : "bg-card border-2 border-border"
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === "sugestao" && (
          <div className="space-y-4 stagger-children">
            {/* What to offer NOW */}
            <Card className="rounded-[1.5rem] border-2 border-purple/20 overflow-hidden animate-pop-in">
              <div className="h-2 bg-gradient-to-r from-purple via-accent to-primary" />
              <CardContent className="p-6 text-center">
                <Lightbulb className="w-8 h-8 text-yellow mx-auto mb-2" />
                <h3 className="font-extrabold text-lg mb-1">O que oferecer agora?</h3>
                <p className="text-xs text-muted-foreground font-semibold mb-4">Sugestão para o {sugestao.refeicao} de hoje</p>
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {sugestao.prato.map((a) => (
                    <span key={a} className="text-sm font-extrabold bg-gradient-to-r from-primary/10 to-purple/10 border-2 border-primary/20 px-4 py-2 rounded-[1rem]">
                      {a}
                    </span>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground font-semibold italic">
                  Baseado na fase ({fase.fase}), histórico e Regra dos 3
                </p>
              </CardContent>
            </Card>

            {/* Progress */}
            <Card className="rounded-[1.2rem] border-2 border-secondary/15 overflow-hidden animate-pop-in">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-extrabold text-sm">🎯 Progresso de Exploração</h3>
                  <span className="text-xs font-extrabold text-secondary">{experimentados}/{totalAlimentos}</span>
                </div>
                <div className="h-4 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-secondary to-accent rounded-full transition-all duration-700"
                    style={{ width: `${Math.max((experimentados / totalAlimentos) * 100, 2)}%` }} />
                </div>
                <p className="text-[10px] text-muted-foreground font-semibold mt-1">
                  {bebe.nome} já experimentou {experimentados} de {totalAlimentos} alimentos disponíveis
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {tab === "explorar" && (
          <div className="space-y-4 stagger-children">
            <Card className="rounded-[1.5rem] border-2 border-accent/15 overflow-hidden animate-pop-in">
              <div className="h-1.5 bg-accent" />
              <CardContent className="p-5">
                <h3 className="font-extrabold text-base mb-4">🔍 Alimentos Não Explorados</h3>
                <p className="text-xs text-muted-foreground font-semibold mb-4">O que {bebe.nome} ainda NÃO experimentou:</p>
                {Object.entries(naoExplorados).map(([cat, alimentos]) => (
                  <div key={cat} className="mb-4">
                    <p className="text-xs font-extrabold text-foreground mb-2">
                      {CATEGORIA_LABELS[cat as CategoriaAlimento] || cat}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {alimentos.map((a) => (
                        <span key={a} className="text-xs font-bold bg-accent/10 text-accent px-3 py-1.5 rounded-full">{a}</span>
                      ))}
                    </div>
                  </div>
                ))}
                {Object.keys(naoExplorados).length === 0 && (
                  <div className="text-center py-6">
                    <span className="text-4xl block mb-2">🌟</span>
                    <p className="text-sm font-extrabold text-secondary">Incrível! {bebe.nome} já experimentou todos os alimentos!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {tab === "score" && (
          <div className="space-y-4 stagger-children">
            <Card className="rounded-[1.5rem] border-0 overflow-hidden shadow-xl animate-pop-in">
              <div className={`bg-gradient-to-br ${score.score >= 70 ? "from-secondary to-secondary/70" : score.score >= 40 ? "from-yellow to-orange" : "from-destructive to-destructive/70"} p-8 text-center text-white`}>
                <span className="text-5xl block mb-2">{score.emoji}</span>
                <div className="text-5xl font-extrabold">{score.score}</div>
                <div className="text-sm font-bold opacity-90 mt-1">{score.nivel}</div>
                <p className="text-xs opacity-70 mt-2">Score Nutricional da Semana</p>
              </div>
            </Card>

            <Card className="rounded-[1.5rem] border-2 border-border overflow-hidden animate-pop-in">
              <CardContent className="p-5">
                <h3 className="font-extrabold text-base mb-3">📊 Como é calculado</h3>
                <div className="space-y-3 text-xs font-semibold text-muted-foreground">
                  <div className="flex justify-between"><span>🥗 Diversidade de categorias</span><span className="font-extrabold">até 30 pts</span></div>
                  <div className="flex justify-between"><span>🍎 Variedade de alimentos</span><span className="font-extrabold">até 40 pts</span></div>
                  <div className="flex justify-between"><span>⭐ Média de aceitação</span><span className="font-extrabold">até 30 pts</span></div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {tab === "padroes" && (
          <div className="space-y-4 stagger-children">
            <Card className="rounded-[1.5rem] border-2 border-purple/15 overflow-hidden animate-pop-in">
              <div className="h-1.5 bg-purple" />
              <CardContent className="p-5">
                <h3 className="font-extrabold text-base mb-4">🧠 Padrões de Aceitação</h3>
                {padroes.length > 0 ? (
                  <div className="space-y-3">
                    {padroes.map((p, i) => (
                      <div key={i} className="p-3 bg-purple/5 rounded-[1rem] border border-purple/10">
                        <p className="text-sm font-semibold">{p}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <span className="text-3xl block mb-2">📈</span>
                    <p className="text-sm font-semibold text-muted-foreground">Registre mais refeições para gerar insights automáticos</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top 5 alimentos */}
            {registros.length > 0 && (() => {
              const aceitacaoPorAlimento: Record<string, number[]> = {};
              registros.forEach(r => {
                if (r.aceitacao) {
                  if (!aceitacaoPorAlimento[r.nome_alimento]) aceitacaoPorAlimento[r.nome_alimento] = [];
                  aceitacaoPorAlimento[r.nome_alimento].push(r.aceitacao);
                }
              });
              const ranking = Object.entries(aceitacaoPorAlimento)
                .map(([nome, vals]) => ({ nome, media: vals.reduce((a, b) => a + b, 0) / vals.length }))
                .sort((a, b) => b.media - a.media);

              return (
                <Card className="rounded-[1.5rem] border-2 border-yellow/15 overflow-hidden animate-pop-in">
                  <div className="h-1.5 bg-yellow" />
                  <CardContent className="p-5">
                    <h3 className="font-extrabold text-base mb-3">🏆 Ranking de Aceitação</h3>
                    <div className="space-y-2">
                      {ranking.slice(0, 5).map((item, i) => (
                        <div key={item.nome} className="flex items-center gap-3 p-2 rounded-lg">
                          <span className="text-lg font-extrabold text-yellow w-6">{i + 1}.</span>
                          <span className="text-sm font-extrabold flex-1">{item.nome}</span>
                          <span className="text-xs font-extrabold bg-yellow/15 px-2.5 py-1 rounded-full">⭐ {item.media.toFixed(1)}</span>
                        </div>
                      ))}
                    </div>
                    {ranking.length > 5 && (
                      <>
                        <p className="text-xs font-extrabold text-muted-foreground mt-4 mb-2">📉 Para tentar de novo:</p>
                        <div className="flex flex-wrap gap-2">
                          {ranking.slice(-3).map((item) => (
                            <span key={item.nome} className="text-xs font-bold bg-destructive/10 text-destructive px-3 py-1.5 rounded-full">
                              {item.nome} ({item.media.toFixed(1)})
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              );
            })()}
          </div>
        )}

        {tab === "compras" && (
          <div className="space-y-4 stagger-children">
            <Card className="rounded-[1.5rem] border-2 border-secondary/15 overflow-hidden animate-pop-in">
              <div className="h-1.5 bg-secondary" />
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingCart className="w-5 h-5 text-secondary" />
                  <h3 className="font-extrabold text-base">Lista de Compras</h3>
                </div>
                <p className="text-xs text-muted-foreground font-semibold mb-4">Baseada no que {bebe.nome} comeu esta semana:</p>
                {Object.keys(listaCompras).length > 0 ? (
                  Object.entries(listaCompras).map(([cat, items]) => (
                    <div key={cat} className="mb-4">
                      <p className="text-xs font-extrabold text-foreground mb-2">🏷️ {cat}</p>
                      <div className="space-y-1">
                        {items.map((item) => (
                          <div key={item} className="flex items-center gap-2 text-sm font-semibold text-foreground">
                            <span className="w-4 h-4 rounded border-2 border-secondary/40" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <span className="text-3xl block mb-2">🛒</span>
                    <p className="text-sm font-semibold text-muted-foreground">Registre refeições para gerar a lista de compras</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default SugestaoPage;
