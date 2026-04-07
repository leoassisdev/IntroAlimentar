import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Plus, Calendar, CalendarDays, AlertTriangle, BarChart3, Sparkles, Heart, ShieldCheck, Trash2, HelpCircle, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfilePhoto } from "@/components/PhotoUpload";
import { RegistroCard } from "@/components/RegistroCard";
import { AlimentosPopup, RegistrosPopup, Regra3Popup } from "@/components/StatPopups";
import { TipsTicker } from "@/components/TipsTicker";
import { CalendarioAlimentar } from "@/components/CalendarioAlimentar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { bebeStore, registroStore } from "@/data/store";
import { toast } from "sonner";
import { idadeEmMeses, idadeDetalhada, faseAlimentar, formatDate, getSigno, getElementoChinês, diaDaSemana } from "@/utils/helpers";
import { CATEGORIA_LABELS } from "@/types";
import type { Bebe, RegistroAlimentar } from "@/types";

const MARCOS_POR_FASE: { min: number; max: number; titulo: string; emoji: string; marcos: { icon: string; texto: string }[] }[] = [
  {
    min: 0, max: 3, titulo: "Recém-nascido a 3 meses", emoji: "👶",
    marcos: [
      { icon: "👀", texto: "Começa a acompanhar objetos com os olhos e reconhecer rostos familiares." },
      { icon: "😊", texto: "Primeiros sorrisos sociais aparecem — sorria de volta, faz toda a diferença!" },
      { icon: "🗣️", texto: "Emite sons como 'aah' e 'ooh'. Converse bastante com o bebê!" },
      { icon: "💪", texto: "Vai ganhando força no pescoço. Coloque de bruços por alguns minutos por dia." },
      { icon: "🍼", texto: "Alimentação exclusiva com leite materno ou fórmula. Nada de água ou chá!" },
      { icon: "😴", texto: "Dorme bastante (14-17h/dia). Aproveite para descansar também!" },
    ],
  },
  {
    min: 4, max: 5, titulo: "4 a 5 meses", emoji: "🤗",
    marcos: [
      { icon: "🤲", texto: "Começa a pegar objetos com as mãos. Ofereça brinquedos seguros e coloridos." },
      { icon: "🔄", texto: "Pode começar a rolar de barriga para cima. Nunca deixe sozinho em superfícies altas!" },
      { icon: "😂", texto: "Primeiras gargalhadas! Brinque, cante e faça caretas — ele adora!" },
      { icon: "🍼", texto: "Ainda é cedo para comida. O leite continua sendo tudo que ele precisa." },
      { icon: "👅", texto: "Começa a mostrar interesse na comida dos pais — é curiosidade, não fome!" },
      { icon: "💤", texto: "Sono começa a se regular. Tente criar uma rotina de hora de dormir." },
    ],
  },
  {
    min: 6, max: 6, titulo: "6 meses — Hora de começar!", emoji: "🎉",
    marcos: [
      { icon: "🍎", texto: "Início da introdução alimentar! Comece com frutas amassadas ou em pedaços grandes." },
      { icon: "🪑", texto: "Deve sentar com apoio. Cadeirinha de alimentação é essencial!" },
      { icon: "✋", texto: "Agarra objetos e leva à boca — aproveite para oferecer alimentos em palito." },
      { icon: "⏰", texto: "Comece com 1 refeição/dia (almoço). O leite ainda é o principal!" },
      { icon: "🤢", texto: "GAG (ânsia) é normal e esperado. O bebê está aprendendo a lidar com texturas." },
      { icon: "🧪", texto: "Ofereça um alimento novo por vez e observe por 3 dias antes do próximo." },
    ],
  },
  {
    min: 7, max: 8, titulo: "7 a 8 meses", emoji: "🥕",
    marcos: [
      { icon: "🍽️", texto: "Hora de incluir a 2a refeição (jantar)! Varie frutas, legumes e proteínas." },
      { icon: "👐", texto: "Desenvolve o movimento de pinça (pega com indicador e polegar)." },
      { icon: "🦷", texto: "Primeiros dentinhos podem aparecer! Alimentos gelados aliviam a gengiva." },
      { icon: "🗣️", texto: "Começa a balbuciar sílabas como 'ma-ma' e 'pa-pa'. Repita para ele!" },
      { icon: "🥜", texto: "Introduza alergênicos (ovo, amendoim) um por vez, pela manhã." },
      { icon: "💧", texto: "Ofereça água em copinho aberto durante as refeições." },
    ],
  },
  {
    min: 9, max: 11, titulo: "9 a 11 meses", emoji: "🌟",
    marcos: [
      { icon: "🍝", texto: "Pode comer a maioria dos alimentos da família (sem sal/açúcar em excesso)." },
      { icon: "🥄", texto: "Quer comer sozinho! Deixe explorar com as mãos — a sujeira faz parte." },
      { icon: "🚶", texto: "Pode começar a engatinhar e ficar em pé. Cuidado com objetos no chão!" },
      { icon: "👋", texto: "Aprende a dar tchau e bater palmas. Comemore cada conquista!" },
      { icon: "🍌", texto: "Cortes podem ser menores agora. Observe se mastiga bem." },
      { icon: "🍽️", texto: "3 refeições + 2 lanches. Leite continua importante entre as refeições." },
    ],
  },
  {
    min: 12, max: 18, titulo: "1 ano a 1 ano e meio", emoji: "🎂",
    marcos: [
      { icon: "🚶", texto: "Primeiros passos! Cada bebê tem seu tempo — não compare." },
      { icon: "🍯", texto: "A partir de 1 ano, mel e leite de vaca já podem ser introduzidos." },
      { icon: "🗣️", texto: "Primeiras palavras com significado. Nomeie tudo durante as refeições!" },
      { icon: "🥄", texto: "Pode começar a usar colher e garfo. Tenha paciência com a bagunça!" },
      { icon: "🚫", texto: "Fase de recusa é normal — não force, não desista, ofereça de formas diferentes." },
      { icon: "👨‍👩‍👧", texto: "Comer junto em família é o melhor estímulo. Ele aprende imitando vocês!" },
    ],
  },
  {
    min: 19, max: 24, titulo: "1 ano e meio a 2 anos", emoji: "⭐",
    marcos: [
      { icon: "🏃", texto: "Corre, pula e escala! Energia de sobra — gaste nas brincadeiras ao ar livre." },
      { icon: "🗣️", texto: "Forma frases curtas (2-3 palavras). Converse sobre os alimentos durante a refeição!" },
      { icon: "🎨", texto: "Adora participar! Deixe ajudar a lavar frutas e mexer ingredientes." },
      { icon: "🍽️", texto: "Come praticamente tudo da família. Temperos naturais estão liberados." },
      { icon: "😤", texto: "Fase do 'não' e das birras. Na alimentação, ofereça escolhas: 'banana ou maçã?'" },
      { icon: "📊", texto: "O apetite varia muito. Confie nos sinais de fome e saciedade dele." },
    ],
  },
  {
    min: 25, max: 999, titulo: "Acima de 2 anos", emoji: "🌈",
    marcos: [
      { icon: "🍽️", texto: "Alimentação igual à da família. Continue evitando ultraprocessados e excesso de açúcar." },
      { icon: "🧠", texto: "Curiosidade a mil! Aproveite para ensinar sobre os alimentos e de onde vêm." },
      { icon: "👩‍🍳", texto: "Pode ajudar a cozinhar receitas simples. Isso aumenta o interesse pela comida." },
      { icon: "🥗", texto: "Incentive a variedade. A regra continua: quanto mais cores no prato, melhor!" },
      { icon: "🤝", texto: "Comer é um momento social. Valorize as refeições em família sem telas." },
      { icon: "💪", texto: "Parabéns pela jornada! Cada hábito saudável construído agora dura a vida toda." },
    ],
  },
];

const MarcosDesenvolvimento = ({ idadeMeses }: { idadeMeses: number }) => {
  const faseAtual = MARCOS_POR_FASE.find((f) => idadeMeses >= f.min && idadeMeses <= f.max) || MARCOS_POR_FASE[0];
  const faseAnterior = MARCOS_POR_FASE[MARCOS_POR_FASE.indexOf(faseAtual) - 1];
  const faseProxima = MARCOS_POR_FASE[MARCOS_POR_FASE.indexOf(faseAtual) + 1];

  return (
    <div className="space-y-4 mt-1">
      {/* Current phase */}
      <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/20 p-4">
        <p className="text-sm font-extrabold text-primary mb-3">{faseAtual.emoji} {faseAtual.titulo}</p>
        <div className="space-y-2.5">
          {faseAtual.marcos.map((m, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="text-base shrink-0">{m.icon}</span>
              <p className="text-sm text-foreground leading-snug">{m.texto}</p>
            </div>
          ))}
        </div>
      </div>

      {/* What's coming next */}
      {faseProxima && (
        <div className="rounded-2xl bg-secondary/5 border border-secondary/15 p-4">
          <p className="text-sm font-bold text-secondary mb-2">🔮 Em breve — {faseProxima.titulo}</p>
          <div className="space-y-2">
            {faseProxima.marcos.slice(0, 3).map((m, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="text-base shrink-0">{m.icon}</span>
                <p className="text-xs text-muted-foreground leading-snug">{m.texto}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* What was achieved */}
      {faseAnterior && (
        <div className="rounded-2xl bg-muted/50 border border-border/30 p-4">
          <p className="text-sm font-bold text-muted-foreground mb-2">✅ Conquistas anteriores — {faseAnterior.titulo}</p>
          <div className="space-y-2">
            {faseAnterior.marcos.slice(0, 3).map((m, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="text-base shrink-0">{m.icon}</span>
                <p className="text-xs text-muted-foreground/70 leading-snug">{m.texto}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const BebePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bebe, setBebe] = useState<Bebe | null>(null);
  const [registros, setRegistros] = useState<RegistroAlimentar[]>([]);
  const [alimentosOpen, setAlimentosOpen] = useState(false);
  const [registrosOpen, setRegistrosOpen] = useState(false);
  const [regra3Open, setRegra3Open] = useState<{ cat: string; alimentos: string[] } | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [marcosOpen, setMarcosOpen] = useState(false);

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
  const idadePrecisa = idadeDetalhada(bebe.data_nascimento);
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

  const handleDelete = () => {
    bebeStore.delete(bebe.id);
    toast.success(`${bebe.nome} foi removido(a) com sucesso`);
    navigate("/");
  };

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
    <div className="min-h-screen gradient-bg pb-20">
      <div className="paint-blob-yellow" />
      <div className="paint-blob-purple" />

      {/* Help + SOS Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-center">
        <button
          onClick={() => setHelpOpen(true)}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-primary via-accent to-secondary text-white shadow-xl shadow-primary/30 flex items-center justify-center hover:scale-110 transition-transform"
          title="Ajuda Rápida"
        >
          <HelpCircle className="w-6 h-6" />
        </button>
        <button onClick={() => navigate("/emergencia")} className="w-14 h-14 rounded-full bg-destructive text-white shadow-xl shadow-destructive/30 flex items-center justify-center text-xl font-extrabold animate-pulse hover:scale-110 transition-transform">
          🚨
        </button>
      </div>

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
              <p className="text-sm text-white/80 font-semibold">{idadePrecisa.texto}</p>
              <p className="text-xs text-white/60 font-semibold">{fase.fase}</p>
            </div>
            <button
              className="w-9 h-9 rounded-full bg-destructive/20 hover:bg-destructive/40 flex items-center justify-center transition-colors"
              onClick={() => setDeleteOpen(true)}
              title="Excluir perfil"
            >
              <Trash2 className="w-4 h-4 text-white" />
            </button>
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
                <button
                  onClick={() => setMarcosOpen(true)}
                  className="mt-2 text-[11px] font-bold text-white bg-gradient-to-r from-primary to-accent px-3 py-1 rounded-full hover:opacity-90 transition-opacity"
                >
                  🌟 O que esperar nessa fase?
                </button>
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

      {/* Delete confirmation dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="rounded-[1.5rem] border-2 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg">Excluir perfil</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o perfil de <strong>{bebe.nome}</strong>? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-2">
            <button
              className="btn-3d flex-1 text-sm py-2.5"
              onClick={() => setDeleteOpen(false)}
            >
              Cancelar
            </button>
            <button
              className="flex-1 text-sm py-2.5 rounded-xl bg-destructive text-white font-bold hover:bg-destructive/90 transition-colors"
              onClick={handleDelete}
            >
              <span className="flex items-center justify-center gap-1.5">
                <Trash2 className="w-4 h-4" /> Excluir
              </span>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quick Help dialog */}
      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent className="rounded-[1.5rem] border-2 max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">Ajuda Rápida</DialogTitle>
            <DialogDescription>Dicas essenciais para a introdução alimentar</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-1">
            <div className="rounded-xl bg-primary/10 p-3">
              <p className="text-sm font-bold text-primary mb-1">Quando começar?</p>
              <p className="text-sm text-muted-foreground">A introdução alimentar começa aos <strong>6 meses</strong>. Antes disso, o leite materno ou fórmula é suficiente.</p>
            </div>
            <div className="rounded-xl bg-secondary/10 p-3">
              <p className="text-sm font-bold text-secondary mb-1">Como cortar os alimentos?</p>
              <p className="text-sm text-muted-foreground">Para bebês de 6-8 meses, corte em <strong>palitos do tamanho do seu dedo</strong>. Depois de 9 meses, pode ir diminuindo.</p>
            </div>
            <div className="rounded-xl bg-accent/10 p-3">
              <p className="text-sm font-bold text-accent mb-1">Bebê recusou? Tente de novo!</p>
              <p className="text-sm text-muted-foreground">São necessárias até <strong>15 exposições</strong> para o bebê aceitar um alimento novo. Paciência faz parte!</p>
            </div>
            <div className="rounded-xl bg-yellow/10 p-3">
              <p className="text-sm font-bold text-foreground mb-1">Alergênicos: quando oferecer?</p>
              <p className="text-sm text-muted-foreground">Introduza alergênicos <strong>um de cada vez</strong>, pela manhã, e espere <strong>3 dias</strong> antes do próximo para observar reações.</p>
            </div>
            <div className="rounded-xl bg-purple/10 p-3">
              <p className="text-sm font-bold text-purple mb-1">Regra dos 3</p>
              <p className="text-sm text-muted-foreground">Ofereça pelo menos <strong>3 frutas, 3 legumes e 3 proteínas</strong> diferentes por semana para garantir variedade nutricional.</p>
            </div>
            <div className="rounded-xl bg-destructive/10 p-3">
              <p className="text-sm font-bold text-destructive mb-1">Proibidos antes de 1 ano</p>
              <p className="text-sm text-muted-foreground"><strong>Mel, açúcar, sal em excesso</strong> e alimentos ultraprocessados. Em caso de engasgo, use o botão de emergência.</p>
            </div>
            <div className="rounded-xl bg-muted p-3">
              <p className="text-sm font-bold text-foreground mb-1">Usando o app</p>
              <p className="text-sm text-muted-foreground">
                <strong>Registro:</strong> adicione cada refeição do dia.{" "}
                <strong>Calendário:</strong> veja o histórico completo.{" "}
                <strong>Semana:</strong> acompanhe a evolução semanal.{" "}
                <strong>Relatório:</strong> dados detalhados da alimentação.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Marcos do Desenvolvimento dialog */}
      <Dialog open={marcosOpen} onOpenChange={setMarcosOpen}>
        <DialogContent className="rounded-[1.5rem] border-2 max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">🌟 O que esperar de {bebe.nome} nessa fase</DialogTitle>
            <DialogDescription>{idadePrecisa.texto} — {fase.fase}</DialogDescription>
          </DialogHeader>
          <MarcosDesenvolvimento idadeMeses={idade} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BebePage;
