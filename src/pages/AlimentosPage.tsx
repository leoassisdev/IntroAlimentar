import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { FOOD_DATABASE } from "@/data/foods";
import { CATEGORIA_LABELS } from "@/types";
import type { CategoriaAlimento } from "@/types";

const CATEGORIA_EMOJIS: Record<string, string> = {
  frutas: "🍎",
  vegetais_folhosos: "🥬",
  legumes: "🥕",
  proteinas: "🥩",
  cereais: "🌾",
  leguminosas: "🫘",
};

const CATEGORIA_COLORS: Record<string, string> = {
  frutas: "from-primary to-primary/70",
  vegetais_folhosos: "from-secondary to-secondary/70",
  legumes: "from-orange to-orange/70",
  proteinas: "from-destructive to-destructive/70",
  cereais: "from-yellow to-yellow/70",
  leguminosas: "from-green to-green/70",
};

const AlimentosPage = () => {
  const navigate = useNavigate();
  const [categoriaAtiva, setCategoriaAtiva] = useState<CategoriaAlimento>("frutas");
  const [busca, setBusca] = useState("");
  const [alimentoExpandido, setAlimentoExpandido] = useState<string | null>(null);

  const categorias: CategoriaAlimento[] = ["frutas", "vegetais_folhosos", "legumes", "proteinas", "cereais", "leguminosas"];

  const alimentosFiltrados = (FOOD_DATABASE[categoriaAtiva] || []).filter(
    (a) => !busca || a.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="min-h-screen paint-bg">
      <div className="paint-blob-yellow" />
      <div className="paint-blob-purple" />

      <header className="relative bg-gradient-to-br from-secondary to-secondary/80 pb-10 overflow-hidden">
        <div className="absolute top-4 right-8 w-16 h-16 rounded-full bg-yellow/25 animate-float" />
        <div className="absolute top-10 right-28 w-8 h-8 rounded-full bg-primary/20 animate-float-delay" />
        <div className="max-w-2xl mx-auto px-4 pt-4 pb-6 relative z-10">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="rounded-2xl text-white hover:bg-white/20 bounce-tap">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-extrabold text-white drop-shadow-sm">Base de Alimentos 📚</h1>
              <p className="text-sm text-white/80 font-semibold">Guia completo de alimentos</p>
            </div>
          </div>
        </div>
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path d="M0,30 C250,65 500,15 750,45 C1000,70 1250,25 1440,40 L1440,60 L0,60 Z" fill="hsl(40 50% 97%)" />
        </svg>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5 relative z-10">
        {/* Search */}
        <div className="relative animate-pop-in">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar alimento..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10 rounded-[1.2rem] h-12 border-2 font-semibold"
          />
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar animate-pop-in" style={{ animationDelay: "0.1s" }}>
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => { setCategoriaAtiva(cat); setBusca(""); setAlimentoExpandido(null); }}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-[1rem] text-sm font-extrabold whitespace-nowrap transition-all bounce-tap ${
                categoriaAtiva === cat
                  ? "bg-secondary text-white shadow-lg shadow-secondary/25 scale-105"
                  : "bg-card border-2 border-border text-foreground hover:border-secondary/30"
              }`}
            >
              <span>{CATEGORIA_EMOJIS[cat]}</span>
              <span>{CATEGORIA_LABELS[cat]?.split(" ").slice(1).join(" ")}</span>
            </button>
          ))}
        </div>

        {/* Count */}
        <p className="text-xs text-muted-foreground font-bold">
          {alimentosFiltrados.length} alimento{alimentosFiltrados.length !== 1 ? "s" : ""} encontrado{alimentosFiltrados.length !== 1 ? "s" : ""}
        </p>

        {/* Food list */}
        <div className="stagger-children space-y-3">
          {alimentosFiltrados.map((alimento) => {
            const isExpanded = alimentoExpandido === alimento.nome;
            return (
              <Card
                key={alimento.nome}
                className={`rounded-[1.2rem] border-2 overflow-hidden cursor-pointer transition-all bounce-tap animate-pop-in ${
                  isExpanded ? "border-secondary/30 shadow-lg" : "border-border card-playful"
                }`}
                onClick={() => setAlimentoExpandido(isExpanded ? null : alimento.nome)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-[0.8rem] bg-gradient-to-br ${CATEGORIA_COLORS[categoriaAtiva]} flex items-center justify-center text-white text-sm font-extrabold shadow-sm`}>
                      {CATEGORIA_EMOJIS[categoriaAtiva]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-sm text-foreground">{alimento.nome}</h3>
                        {alimento.alergenico && (
                          <span className="text-[10px] font-extrabold bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">⚠️ Alergênico</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground font-semibold">
                        {alimento.cortes.length} corte{alimento.cortes.length !== 1 ? "s" : ""} sugerido{alimento.cortes.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <span className={`text-muted-foreground transition-transform ${isExpanded ? "rotate-90" : ""}`}>→</span>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-border/50 space-y-3">
                      <div>
                        <p className="text-xs font-extrabold text-foreground mb-2">✂️ Cortes sugeridos:</p>
                        <div className="flex flex-wrap gap-2">
                          {alimento.cortes.map((corte) => (
                            <span key={corte} className="text-xs font-bold bg-secondary/10 text-secondary px-3 py-1.5 rounded-full">
                              {corte}
                            </span>
                          ))}
                        </div>
                      </div>
                      {alimento.variantes && alimento.variantes.length > 0 && (
                        <div>
                          <p className="text-xs font-extrabold text-foreground mb-2">🔄 Variantes:</p>
                          <div className="flex flex-wrap gap-2">
                            {alimento.variantes.map((v) => (
                              <span key={v} className="text-xs font-bold bg-accent/10 text-accent px-3 py-1.5 rounded-full capitalize">
                                {v}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default AlimentosPage;
