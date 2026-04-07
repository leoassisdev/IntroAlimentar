import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Utensils, BookOpen, ShieldAlert, Heart, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { bebeStore } from "@/data/store";
import { toast } from "sonner";
import { idadeEmMeses, idadeDetalhada, faseAlimentar, formatDate } from "@/utils/helpers";
import type { Bebe } from "@/types";
import FoodCarousel3D from "@/components/FoodCarousel3D";
import SocialButtons from "@/components/SocialButtons";
import appIcon from "@/assets/app-icon.png";

const FASE_COLORS: Record<string, string> = {
  inicio: "bg-secondary/20 text-foreground",
  intermediario: "bg-accent/20 text-foreground",
  avancado: "bg-yellow/20 text-foreground",
  familia: "bg-purple/20 text-foreground",
  antes_da_introducao: "bg-muted text-muted-foreground",
};

const Index = () => {
  const navigate = useNavigate();
  const [bebes, setBebes] = useState<Bebe[]>(() => bebeStore.list());
  const [deleteTarget, setDeleteTarget] = useState<Bebe | null>(null);

  const handleDelete = (bebe: Bebe) => {
    bebeStore.delete(bebe.id);
    setBebes(bebeStore.list());
    setDeleteTarget(null);
    toast.success(`${bebe.nome} foi removido(a) com sucesso`);
  };

  return (
    <div className="min-h-screen gradient-bg">
      <div className="paint-blob-yellow" />
      <div className="paint-blob-purple" />

      {/* SOS Button - always visible */}
      <button
        onClick={() => navigate("/emergencia")}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-destructive text-white shadow-xl shadow-destructive/30 flex items-center justify-center text-xl font-extrabold animate-pulse hover:scale-110 transition-transform"
        title="Central de Emergência"
      >
        🚨
      </button>

      {/* Header */}
      <header className="relative bg-gradient-to-br from-primary to-primary/80 pb-10 overflow-hidden">
        <div className="absolute top-4 right-8 w-20 h-20 rounded-full bg-yellow/30 animate-float" />
        <div className="absolute top-12 right-28 w-10 h-10 rounded-full bg-secondary/30 animate-float-delay" />
        <div className="absolute top-2 left-[60%] w-6 h-6 rounded-full bg-white/20 animate-float-delay-2" />

        <div className="sparkle top-6 left-[20%] text-yellow text-lg" style={{ animationDelay: "0.5s" }}>✦</div>
        <div className="sparkle top-10 left-[75%] text-white/50 text-sm" style={{ animationDelay: "1.2s" }}>✧</div>

        <div className="max-w-2xl mx-auto px-4 pt-6 pb-6 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-[1.2rem] overflow-hidden shadow-xl hover-wiggle bg-gradient-to-br from-pink-200 via-sky-200 to-green-200">
                <img src={appIcon} alt="IntroAlimentar" className="w-full h-full object-cover scale-105" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-white drop-shadow-sm tracking-tight">IntroAlimentar</h1>
                <p className="text-sm text-white/80 font-semibold">Nutrição do bebê com carinho 💛</p>
              </div>
            </div>
            <button className="btn-3d btn-3d-primary text-xs py-2 px-3" onClick={() => navigate("/alimentos")}>
              <BookOpen className="w-4 h-4" />
              Alimentos
            </button>
          </div>
        </div>

        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 70" preserveAspectRatio="none">
          <path d="M0,45 C200,80 400,20 600,50 C800,80 1000,25 1200,55 C1350,70 1440,40 1440,40 L1440,70 L0,70 Z" fill="hsl(40 50% 97%)" />
        </svg>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 -mt-2 relative z-10">
        {bebes.length === 0 ? (
          <div className="text-center py-6 space-y-4">
            <FoodCarousel3D />

            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary/15 to-yellow/15 rounded-full flex items-center justify-center border-4 border-dashed border-primary/25 animate-pop-in">
              <span className="text-6xl">👶</span>
            </div>
            <div className="animate-pop-in" style={{ animationDelay: "0.15s" }}>
              <h2 className="text-3xl text-foreground mb-2">Olá, Família!</h2>
              <p className="text-muted-foreground max-w-sm mx-auto font-semibold text-base">
                Cadastre seu bebê para começar a acompanhar a introdução alimentar 🍎🥕🍌
              </p>
            </div>
            <div className="animate-pop-in" style={{ animationDelay: "0.3s" }}>
              <button className="btn-3d btn-3d-primary text-base py-4 px-10" onClick={() => navigate("/cadastrar-bebe")}>
                <Plus className="w-5 h-5" />
                Cadastrar Bebê
              </button>
            </div>

            {/* Quick access cards even without baby */}
            <div className="grid grid-cols-2 gap-3 pt-4 animate-pop-in" style={{ animationDelay: "0.4s" }}>
              <button className="btn-3d text-xs py-3 px-4 w-full" onClick={() => navigate("/seguranca")}>
                <ShieldAlert className="w-4 h-4" />
                Segurança Alimentar
              </button>
              <button className="btn-3d text-xs py-3 px-4 w-full" style={{ borderColor: "hsl(0 80% 60% / 0.4)", background: "hsl(0 80% 60% / 0.08)" }} onClick={() => navigate("/emergencia")}>
                🚨 Emergência
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="h-40">
              <FoodCarousel3D />
            </div>

            <div className="flex items-center justify-between">
              <h2 className="text-2xl text-foreground">Meus Bebês 👶</h2>
              <button className="btn-3d btn-3d-secondary text-xs py-2 px-4" onClick={() => navigate("/cadastrar-bebe")}>
                <Plus className="w-4 h-4" />
                Novo
              </button>
            </div>

            <div className="stagger-children space-y-4">
              {bebes.map((bebe) => {
                const idade = idadeEmMeses(bebe.data_nascimento);
                const idadePrecisa = idadeDetalhada(bebe.data_nascimento);
                const fase = faseAlimentar(bebe.data_nascimento);
                const faseKey = idade >= 6 && idade <= 8 ? "inicio" : idade > 8 && idade <= 9 ? "intermediario" : idade > 9 && idade <= 12 ? "avancado" : idade > 12 ? "familia" : "antes_da_introducao";
                const emoji = bebe.genero === "feminino" ? "👧" : bebe.genero === "masculino" ? "👦" : "👶";

                return (
                  <Card
                    key={bebe.id}
                    className="cursor-pointer card-playful rounded-[1.5rem] border-2 border-primary/15 overflow-hidden animate-pop-in bounce-tap"
                    onClick={() => navigate(`/bebe/${bebe.id}`)}
                  >
                    <div className="h-1.5 bg-gradient-to-r from-primary via-yellow to-secondary" />
                    <CardContent className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full shrink-0 overflow-hidden border-3 border-primary/20 shadow-md">
                          {bebe.foto ? (
                            <img src={bebe.foto} alt={bebe.nome} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center text-3xl">
                              {emoji}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-extrabold text-foreground text-lg">{bebe.nome}</h3>
                          <p className="text-xs text-muted-foreground font-semibold">
                            {idadePrecisa.texto}
                          </p>
                          <p className="text-[10px] text-muted-foreground/70 font-semibold">
                            {formatDate(bebe.data_nascimento)}
                          </p>
                          <span className={`inline-block mt-1.5 text-xs font-extrabold px-3 py-1 rounded-full ${FASE_COLORS[faseKey]}`}>
                            {fase.fase}
                          </span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover-wiggle">
                            <span className="text-primary font-extrabold text-lg">→</span>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeleteTarget(bebe); }}
                            className="w-8 h-8 rounded-full bg-destructive/10 hover:bg-destructive/20 flex items-center justify-center transition-colors"
                            title="Excluir perfil"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-destructive" />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Quick access */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button className="btn-3d btn-3d-secondary text-xs py-3 px-4 w-full" onClick={() => navigate("/alimentos")}>
                <Utensils className="w-4 h-4" />
                Alimentos
              </button>
              <button className="btn-3d text-xs py-3 px-4 w-full" style={{ borderColor: "hsl(260 60% 75% / 0.6)", background: "hsl(260 60% 75% / 0.1)" }}
                onClick={() => bebes[0] && navigate(`/bebe/${bebes[0].id}/relatorio`)}>
                <BookOpen className="w-4 h-4" />
                Relatório
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <button className="btn-3d text-xs py-3 px-2 w-full" onClick={() => navigate("/seguranca")}>
                <ShieldAlert className="w-4 h-4" />
                Segurança
              </button>
              <button className="btn-3d text-xs py-3 px-2 w-full" onClick={() => bebes[0] && navigate(`/bebe/${bebes[0].id}/sugestoes`)}>
                ✨ Sugestões
              </button>
              <button className="btn-3d text-xs py-3 px-2 w-full" onClick={() => bebes[0] && navigate(`/bebe/${bebes[0].id}/recordacoes`)}>
                <Heart className="w-4 h-4" />
                Recordações
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-border/40 pb-6">
          <div className="text-center space-y-4">
            <SocialButtons />
            <p className="text-xs text-muted-foreground font-extrabold">
              FLOWCORE 2026 — CRIADO POR LEONARDO ASSIS
            </p>
            <a
              href="https://flowcoresolucoes.com/criacao"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary font-extrabold hover:underline inline-block"
            >
              CONHEÇA NOSSOS APPS →
            </a>
            <p className="text-[10px] text-muted-foreground/60 font-semibold">
              IntroAlimentar © {new Date().getFullYear()} · Feito com 💛
            </p>
          </div>
        </footer>
      </main>

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="rounded-[1.5rem] border-2 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg">Excluir perfil</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o perfil de <strong>{deleteTarget?.nome}</strong>? Os registros alimentares serão mantidos, mas o perfil não aparecerá mais na lista.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-2">
            <button
              className="btn-3d flex-1 text-sm py-2.5"
              onClick={() => setDeleteTarget(null)}
            >
              Cancelar
            </button>
            <button
              className="flex-1 text-sm py-2.5 rounded-xl bg-destructive text-white font-bold hover:bg-destructive/90 transition-colors"
              onClick={() => deleteTarget && handleDelete(deleteTarget)}
            >
              <span className="flex items-center justify-center gap-1.5">
                <Trash2 className="w-4 h-4" /> Excluir
              </span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
