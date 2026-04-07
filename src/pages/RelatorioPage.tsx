import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { bebeStore, registroStore } from "@/data/store";
import { idadeEmMeses, faseAlimentar } from "@/utils/helpers";
import { CATEGORIA_LABELS } from "@/types";
import type { Bebe, RegistroAlimentar } from "@/types";

const RelatorioPage = () => {
  const { id: bebeId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bebe, setBebe] = useState<Bebe | null>(null);
  const [registros, setRegistros] = useState<RegistroAlimentar[]>([]);

  useEffect(() => {
    if (!bebeId) return;
    const b = bebeStore.getById(bebeId);
    if (!b) { navigate("/"); return; }
    setBebe(b);
    setRegistros(registroStore.listByBebe(bebeId));
  }, [bebeId, navigate]);

  if (!bebe || !bebeId) return null;

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay() + 1);
  const swStr = startOfWeek.toISOString().split("T")[0];
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  const ewStr = endOfWeek.toISOString().split("T")[0];
  const semana = registros.filter((r) => r.data >= swStr && r.data <= ewStr);

  const categorias: Record<string, number> = {};
  const alimentosUnicos = new Set<string>();
  let totalAceitacao = 0;
  let countAceitacao = 0;
  const baixaAceitacao: string[] = [];

  semana.forEach((r) => {
    categorias[r.categoria] = (categorias[r.categoria] || 0) + 1;
    alimentosUnicos.add(r.nome_alimento);
    if (r.aceitacao) {
      totalAceitacao += r.aceitacao;
      countAceitacao++;
      if (r.aceitacao <= 2) baixaAceitacao.push(r.nome_alimento);
    }
  });

  const media = countAceitacao > 0 ? (totalAceitacao / countAceitacao).toFixed(1) : "—";

  const catColors: Record<string, string> = {
    frutas: "from-primary to-primary/70",
    legumes: "from-orange to-orange/70",
    proteinas: "from-destructive to-destructive/70",
    cereais: "from-yellow to-yellow/70",
    leguminosas: "from-green to-green/70",
    vegetais_folhosos: "from-secondary to-secondary/70",
  };

  const maxCat = Math.max(...Object.values(categorias), 1);

  const observacoes: string[] = [];
  if (semana.length === 0) observacoes.push("Nenhum registro nesta semana");
  if ((categorias["vegetais_folhosos"] || 0) === 0) observacoes.push("⚠️ Nenhum folhoso registrado");
  if (baixaAceitacao.length > 0) observacoes.push(`📉 Baixa aceitação: ${[...new Set(baixaAceitacao)].join(", ")}`);
  const aguaCount = semana.filter(r => r.categoria === "agua").length;
  if (aguaCount < 3) observacoes.push("💧 Poucos registros de água — ofereça nas refeições");
  if (alimentosUnicos.size >= 10) observacoes.push("🌟 Ótima variedade alimentar!");

  return (
    <div className="min-h-screen paint-bg">
      <div className="paint-blob-yellow" />
      <div className="paint-blob-purple" />

      <header className="relative bg-gradient-to-br from-purple to-purple/80 pb-10 overflow-hidden">
        <div className="absolute top-5 right-12 w-14 h-14 rounded-full bg-yellow/25 animate-float" />
        <div className="absolute top-3 right-32 w-8 h-8 rounded-full bg-primary/20 animate-float-delay" />
        <div className="max-w-2xl mx-auto px-4 pt-4 pb-6 relative z-10">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(`/bebe/${bebeId}`)} className="rounded-2xl text-white hover:bg-white/20 bounce-tap">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-extrabold text-white drop-shadow-sm">Relatório Semanal 📊</h1>
              <p className="text-sm text-white/80 font-semibold">{bebe.nome}</p>
            </div>
          </div>
        </div>
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path d="M0,30 C250,65 500,15 750,45 C1000,70 1250,25 1440,40 L1440,60 L0,60 Z" fill="hsl(40 50% 97%)" />
        </svg>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5 relative z-10">
        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-3 stagger-children">
          <Card className="rounded-[1.2rem] border-0 overflow-hidden shadow-lg animate-pop-in">
            <div className="bg-gradient-to-br from-primary to-primary/70 p-4 text-center text-white">
              <span className="text-lg block">📝</span>
              <div className="text-2xl font-extrabold">{semana.length}</div>
              <div className="text-[10px] font-bold opacity-80">Registros</div>
            </div>
          </Card>
          <Card className="rounded-[1.2rem] border-0 overflow-hidden shadow-lg animate-pop-in">
            <div className="bg-gradient-to-br from-secondary to-secondary/70 p-4 text-center text-white">
              <span className="text-lg block">🥗</span>
              <div className="text-2xl font-extrabold">{alimentosUnicos.size}</div>
              <div className="text-[10px] font-bold opacity-80">Alimentos</div>
            </div>
          </Card>
          <Card className="rounded-[1.2rem] border-0 overflow-hidden shadow-lg animate-pop-in">
            <div className="bg-gradient-to-br from-yellow to-orange p-4 text-center text-white">
              <span className="text-lg block">⭐</span>
              <div className="text-2xl font-extrabold">{media}</div>
              <div className="text-[10px] font-bold opacity-80">Aceitação</div>
            </div>
          </Card>
        </div>

        {/* Category breakdown - visual bars */}
        <Card className="rounded-[1.5rem] border-2 border-purple/15 overflow-hidden animate-pop-in">
          <div className="h-1.5 bg-purple/40" />
          <CardContent className="p-5 space-y-4">
            <h3 className="font-bold text-base">📊 Por Categoria</h3>
            {Object.entries(CATEGORIA_LABELS)
              .filter(([k]) => !["leite", "agua"].includes(k))
              .map(([cat, label]) => {
                const count = categorias[cat] || 0;
                const pct = maxCat > 0 ? (count / maxCat) * 100 : 0;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-bold">{label}</span>
                      <span className="font-extrabold text-muted-foreground">{count}</span>
                    </div>
                    <div className="h-4 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${catColors[cat] || "from-muted-foreground to-muted-foreground/70"} rounded-full transition-all duration-700`}
                        style={{ width: `${Math.max(pct, count > 0 ? 8 : 0)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </CardContent>
        </Card>

        {/* Observações */}
        {observacoes.length > 0 && (
          <Card className="rounded-[1.5rem] border-2 border-yellow/20 overflow-hidden animate-pop-in">
            <div className="h-1.5 bg-yellow/40" />
            <CardContent className="p-5 space-y-2">
              <h3 className="font-bold text-base">💡 Observações</h3>
              {observacoes.map((obs, i) => (
                <p key={i} className="text-sm text-muted-foreground font-semibold">{obs}</p>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Baixa aceitação */}
        {baixaAceitacao.length > 0 && (
          <Card className="rounded-[1.5rem] border-2 border-destructive/15 overflow-hidden animate-pop-in">
            <div className="h-1.5 bg-destructive/40" />
            <CardContent className="p-5">
              <h3 className="font-bold text-base mb-3">📉 Alimentos com baixa aceitação</h3>
              <div className="flex flex-wrap gap-2">
                {[...new Set(baixaAceitacao)].map((a) => (
                  <span key={a} className="text-xs font-bold bg-destructive/10 text-destructive px-3 py-1.5 rounded-full">
                    {a}
                  </span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground font-semibold mt-3">
                💡 Dica: ofereça novamente em outro preparo ou corte diferente!
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default RelatorioPage;
