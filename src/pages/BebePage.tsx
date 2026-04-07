import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Plus, Calendar, CalendarDays, AlertTriangle, BarChart3, Sparkles, Heart, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfilePhoto } from "@/components/PhotoUpload";
import { RegistroCard } from "@/components/RegistroCard";
import { AlimentosPopup, RegistrosPopup, Regra3Popup } from "@/components/StatPopups";
import { TipsTicker } from "@/components/TipsTicker";
import { CalendarioAlimentar } from "@/components/CalendarioAlimentar";
import { bebeStore, registroStore } from "@/data/store";
import { idadeEmMeses, faseAlimentar, formatDate, getSigno, getElementoChinês, diaDaSemana } from "@/utils/helpers";
import { CATEGORIA_LABELS } from "@/types";
import type { Bebe, RegistroAlimentar } from "@/types";

const BebePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bebe, setBebe] = useState<Bebe | null>(null);
  const [registros, setRegistros] = useState<RegistroAlimentar[]>([]);
  const [alimentosOpen, setAlimentosOpen] = useState(false);
  const [registrosOpen, setRegistrosOpen] = useState(false);
  const [regra3Open, setRegra3Open] = useState<{ cat: string; alimentos: string[] } | null>(null);

  const loadData = () => {
    if (!id) return;
    const b = bebeStore.getById(id);
    if (!b) { navigate("/"); return; }
    setBebe(b);
    setRegistros(registroStore.listByBebe(id));
  };

  useEffect(() => { loadData(); }, [id, navigate]);

  if (!bebe) return null;

  const idade = idadeEmMeses(bebe.data_nascimento);
  const fase = faseAlimentar(bebe.data_nascimento);
  const hoje = new Date().toISOString().split("T")[0];
  const registrosHoje = registros.filter((r) => r.data === hoje);

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay() + 1);
  const swStr = startOfWeek.toISOString().split("T")[0];
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  const ewStr = endOfWeek.toISOString().split("T")[0];
  const registrosSemana = registros.filter((r) => r.data >= swStr && r.data <= ewStr);

  const categoriasSemana: Record<string, Set<string>> = {};
  registrosSemana.forEach((r) => {
    if (!categoriasSemana[r.categoria]) categoriasSemana[r.categoria] = new Set();
    categoriasSemana[r.categoria].add(r.nome_alimento);
  });

  const aceitacoes = registrosSemana.filter((r) => r.aceitacao).map((r) => r.aceitacao!);
  const mediaAceitacao = aceitacoes.length ? (aceitacoes.reduce((a, b) => a + b, 0) / aceitacoes.length).toFixed(1) : "—";

  const handlePhotoUpdate = (photo: string) => {
    bebeStore.update(bebe.id, { foto: photo });
    setBebe({ ...bebe, foto: photo });
  };

  const hora = new Date().getHours();
  let proxRefeicao = "almoço";
  if (hora < 10) proxRefeicao = "café da manhã";
  else if (hora >= 14 && hora < 17) proxRefeicao = "lanche da tarde";
  else if (hora >= 17) proxRefeicao = "jantar";

  const temRegistroHoje = registrosHoje.length > 0;
  const alimentosUnicos = new Set(registrosSemana.map(r => r.nome_alimento)).size;

  return (
    <div className="min-h-screen gradient-bg pb-28">
      <div className="paint-blob-yellow" />
      <div className="paint-blob-purple" />

      {/* SOS Button */}
      <button onClick={() => navigate("/emergencia")} className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-destructive text-white shadow-xl shadow-destructive/30 flex items-center justify-center text-xl font-extrabold animate-pulse hover:scale-110 transition-transform">
        🚨
      </button>

      <header className="relative bg-gradient-to-br from-accent to-accent/80 pb-10 overflow-hidden">
        <div className="absolute top-4 right-10 w-14 h-14 rounded-full bg-yellow/25 animate-float" />
        <div className="sparkle top-8 left-[60%] text-white/40" style={{ animationDelay: "0.7s" }}>✧</div>
        <div className="max-w-2xl mx-auto px-4 pt-4 pb-6 relative z-10">
          <div className="flex items-center gap-3">
            <button className="btn-3d text-xs py-2 px-3" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-extrabold text-white drop-shadow-sm">{bebe.nome}</h1>
              <p className="text-sm text-white/80 font-semibold">{idade} {idade === 1 ? "mês" : "meses"} · {fase.fase}</p>
            </div>
          </div>
        </div>
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path d="M0,30 C250,65 500,15 750,45 C1000,70 1250,25 1440,40 L1440,60 L0,60 Z" fill="hsl(40 50% 97%)" />
        </svg>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-4 space-y-5 relative z-10">
        {/* Profile card */}
        <Card className="rounded-[1.8rem] border-2 border-accent/15 overflow-hidden shadow-xl shadow-accent/10 -mt-6 animate-pop-in">
          <div className="h-2 bg-gradient-to-r from-accent via-secondary to-primary" />
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              {/* Gradient border profile */}
              <div className="relative p-1 rounded-full bg-gradient-to-br from-primary via-accent to-secondary">
                <div className="rounded-full overflow-hidden bg-card">
                  <ProfilePhoto foto={bebe.foto} onPhotoChange={handlePhotoUpdate} genero={bebe.genero} size={72} />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-xl text-foreground">{bebe.nome}</h2>
                <p className="text-sm text-muted-foreground font-semibold">Nasceu em {formatDate(bebe.data_nascimento)} ({diaDaSemana(bebe.data_nascimento)})</p>
                <p className="text-sm text-secondary font-bold mt-1">📋 {fase.descricao}</p>
                <p className="text-xs text-muted-foreground font-bold mt-1">
                  {getSigno(bebe.data_nascimento).emoji} {getSigno(bebe.data_nascimento).signo} · {getSigno(bebe.data_nascimento).elemento} · {getElementoChinês(bebe.data_nascimento)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Smart suggestion banner */}
        {!temRegistroHoje && (
          <Card className="rounded-[1.2rem] border-2 border-purple/20 overflow-hidden animate-pop-in bg-gradient-to-r from-purple/5 to-accent/5">
            <CardContent className="p-4 flex items-center gap-3">
              <span className="text-2xl">💡</span>
              <div className="flex-1">
                <p className="text-xs font-extrabold text-foreground">Hoje você ainda não registrou o {proxRefeicao}!</p>
                <p className="text-[10px] text-muted-foreground font-semibold">Toque para registrar agora</p>
              </div>
              <button className="btn-3d btn-3d-primary text-[10px] py-2 px-3" onClick={() => navigate(`/bebe/${id}/novo-registro`)}>Registrar</button>
            </CardContent>
          </Card>
        )}

        {/* Quick actions */}
        <div className="grid grid-cols-3 gap-3 stagger-children">
          <button className="btn-3d btn-3d-primary text-[10px] py-3 px-2 w-full flex-col gap-1" onClick={() => navigate(`/bebe/${id}/novo-registro`)}>
            <Plus className="w-5 h-5" /><span>Registro</span>
          </button>
          <button className="btn-3d text-[10px] py-3 px-2 w-full flex-col gap-1" style={{ borderColor: "hsl(45 95% 68% / 0.6)", background: "hsl(45 95% 68% / 0.15)" }} onClick={() => navigate(`/bebe/${id}/alergenicos`)}>
            <AlertTriangle className="w-5 h-5" /><span>Alergênicos</span>
          </button>
          <button className="btn-3d text-[10px] py-3 px-2 w-full flex-col gap-1" style={{ borderColor: "hsl(260 60% 75% / 0.6)", background: "hsl(260 60% 75% / 0.15)" }} onClick={() => navigate(`/bebe/${id}/relatorio`)}>
            <BarChart3 className="w-5 h-5" /><span>Relatório</span>
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <button className="btn-3d text-[10px] py-3 px-2 w-full flex-col gap-1" onClick={() => navigate(`/bebe/${id}/sugestoes`)}>
            <Sparkles className="w-5 h-5" /><span>Sugestões</span>
          </button>
          <button className="btn-3d text-[10px] py-3 px-2 w-full flex-col gap-1" onClick={() => navigate(`/bebe/${id}/recordacoes`)}>
            <Heart className="w-5 h-5" /><span>Recordações</span>
          </button>
          <button className="btn-3d text-[10px] py-3 px-2 w-full flex-col gap-1" onClick={() => navigate(`/bebe/${id}/seguranca`)}>
            <ShieldCheck className="w-5 h-5" /><span>Segurança</span>
          </button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="hoje" className="w-full">
          <TabsList className="w-full rounded-[1.2rem] bg-card border-2 border-border p-1 h-auto">
            <TabsTrigger value="hoje" className="flex-1 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-extrabold py-2.5 transition-all">
              <Calendar className="w-4 h-4 mr-1.5" /> Hoje
            </TabsTrigger>
            <TabsTrigger value="calendario" className="flex-1 rounded-xl data-[state=active]:bg-accent data-[state=active]:text-accent-foreground font-extrabold py-2.5 transition-all">
              <CalendarDays className="w-4 h-4 mr-1.5" /> Calendário
            </TabsTrigger>
            <TabsTrigger value="semana" className="flex-1 rounded-xl data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground font-extrabold py-2.5 transition-all">
              <BarChart3 className="w-4 h-4 mr-1.5" /> Semana
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hoje" className="mt-4 space-y-3">
            {registrosHoje.length === 0 ? (
              <Card className="rounded-[1.5rem] border-2 border-dashed border-primary/25">
                <CardContent className="text-center py-10">
                  <span className="text-5xl block mb-3 animate-float">🍽️</span>
                  <p className="text-muted-foreground font-semibold">Nenhum registro hoje</p>
                  <button className="btn-3d btn-3d-primary text-xs py-2 px-4 mt-4" onClick={() => navigate(`/bebe/${id}/novo-registro`)}>
                    Adicionar registro →
                  </button>
                </CardContent>
              </Card>
            ) : (
              <div className="stagger-children space-y-3">
                {registrosHoje.map((r) => (
                  <RegistroCard key={r.id} registro={r} onUpdate={loadData} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="calendario" className="mt-4">
            <CalendarioAlimentar
              registros={registros}
              bebeId={bebe.id}
              onNavigateToRegistro={(date) => navigate(`/bebe/${id}/novo-registro?data=${date}`)}
              onDataChange={loadData}
            />
          </TabsContent>

          <TabsContent value="semana" className="mt-4 space-y-4">
            {/* Clickable stat cards */}
            <div className="grid grid-cols-3 gap-3 stagger-children">
              <button onClick={() => setRegistrosOpen(true)} className="text-left transition-transform hover:scale-105 bounce-tap">
                <Card className="rounded-[1.2rem] border-0 overflow-hidden shadow-lg animate-pop-in">
                  <div className="bg-gradient-to-br from-primary to-primary/70 p-4 text-center text-white">
                    <span className="text-lg block">📝</span>
                    <div className="text-2xl font-extrabold">{registrosSemana.length}</div>
                    <div className="text-[10px] font-bold opacity-80">Registros</div>
                  </div>
                </Card>
              </button>
              <button onClick={() => setAlimentosOpen(true)} className="text-left transition-transform hover:scale-105 bounce-tap">
                <Card className="rounded-[1.2rem] border-0 overflow-hidden shadow-lg animate-pop-in">
                  <div className="bg-gradient-to-br from-secondary to-secondary/70 p-4 text-center text-white">
                    <span className="text-lg block">🥗</span>
                    <div className="text-2xl font-extrabold">{alimentosUnicos}</div>
                    <div className="text-[10px] font-bold opacity-80">Alimentos</div>
                  </div>
                </Card>
              </button>
              <Card className="rounded-[1.2rem] border-0 overflow-hidden shadow-lg animate-pop-in">
                <div className="bg-gradient-to-br from-yellow to-orange p-4 text-center text-white">
                  <span className="text-lg block">⭐</span>
                  <div className="text-2xl font-extrabold">{mediaAceitacao}</div>
                  <div className="text-[10px] font-bold opacity-80">Aceitação</div>
                </div>
              </Card>
            </div>

            {/* Regra dos 3 */}
            <Card className="rounded-[1.5rem] border-2 border-secondary/15 overflow-hidden">
              <div className="h-1.5 bg-secondary" />
              <CardContent className="p-5">
                <h3 className="font-bold text-base mb-4 text-foreground">📋 Regra dos 3 — Esta Semana</h3>
                {["frutas", "legumes", "proteinas"].map((cat) => {
                  const alimentos = categoriasSemana[cat] ? Array.from(categoriasSemana[cat]) : [];
                  const ok = alimentos.length >= 3;
                  return (
                    <button
                      key={cat}
                      onClick={() => setRegra3Open({ cat, alimentos })}
                      className="flex items-center justify-between py-3 border-b last:border-0 border-border/40 w-full text-left hover:bg-accent/5 rounded-lg px-2 -mx-2 transition-colors"
                    >
                      <span className="text-sm font-extrabold">{CATEGORIA_LABELS[cat as keyof typeof CATEGORIA_LABELS]}</span>
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                          {[1, 2, 3].map((n) => (
                            <div key={n} className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold transition-all ${
                              alimentos.length >= n ? "bg-secondary text-white shadow-sm" : "bg-muted text-muted-foreground"
                            }`}>{alimentos.length >= n ? "✓" : n}</div>
                          ))}
                        </div>
                        <span className={`text-lg ${ok ? "" : "opacity-70 cursor-pointer"}`} title={ok ? "Meta atingida!" : "Clique para entender"}>
                          {ok ? "✅" : "⚠️"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Tips Ticker */}
      <TipsTicker />

      {/* Popups */}
      <AlimentosPopup open={alimentosOpen} onClose={() => setAlimentosOpen(false)} registros={registrosSemana} />
      <RegistrosPopup open={registrosOpen} onClose={() => setRegistrosOpen(false)} registros={registrosSemana} />
      {regra3Open && (
        <Regra3Popup open={!!regra3Open} onClose={() => setRegra3Open(null)} categoria={regra3Open.cat} alimentos={regra3Open.alimentos} />
      )}
    </div>
  );
};

export default BebePage;
