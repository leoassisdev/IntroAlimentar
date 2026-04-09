import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Heart, Star, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PhotoUpload } from "@/components/PhotoUpload";
import { bebeStore, registroStore } from "@/data/store";
import { formatDate, generateId, getAlimentosDoRegistro } from "@/utils/helpers";
import type { Bebe, RegistroAlimentar } from "@/types";

interface Marco {
  id: string;
  bebe_id: string;
  titulo: string;
  descricao: string;
  data: string;
  tipo: "primeiro_alimento" | "comeu_sozinho" | "pediu_mais" | "refeicao_completa" | "bebeu_agua_copo" | "outro";
  foto?: string;
  created_at: string;
}

const MARCOS_KEY = "introalimentar_marcos";

function loadMarcos(bebeId: string): Marco[] {
  try {
    return JSON.parse(localStorage.getItem(MARCOS_KEY) || "[]").filter((m: Marco) => m.bebe_id === bebeId);
  } catch { return []; }
}

function saveMarco(marco: Marco) {
  const all = JSON.parse(localStorage.getItem(MARCOS_KEY) || "[]");
  all.push(marco);
  localStorage.setItem(MARCOS_KEY, JSON.stringify(all));
}

const TIPO_MARCOS = [
  { value: "primeiro_alimento", emoji: "🍎", label: "Primeiro alimento" },
  { value: "comeu_sozinho", emoji: "🤲", label: "Comeu sozinho" },
  { value: "pediu_mais", emoji: "🙋", label: "Pediu mais" },
  { value: "refeicao_completa", emoji: "🍽️", label: "Refeição completa" },
  { value: "bebeu_agua_copo", emoji: "🥤", label: "Bebeu água no copo" },
  { value: "outro", emoji: "⭐", label: "Outro" },
];

const CONQUISTAS = [
  { titulo: "Primeira fruta", condFn: (r: RegistroAlimentar[]) => r.some(x => getAlimentosDoRegistro(x).some(a => a.categoria === "frutas")), emoji: "🍌" },
  { titulo: "Primeira proteína", condFn: (r: RegistroAlimentar[]) => r.some(x => getAlimentosDoRegistro(x).some(a => a.categoria === "proteinas")), emoji: "🥩" },
  { titulo: "10 alimentos diferentes", condFn: (r: RegistroAlimentar[]) => new Set(r.flatMap(x => getAlimentosDoRegistro(x).map(a => a.nome))).size >= 10, emoji: "🎯" },
  { titulo: "30 refeições registradas", condFn: (r: RegistroAlimentar[]) => r.length >= 30, emoji: "📋" },
  { titulo: "100 refeições registradas", condFn: (r: RegistroAlimentar[]) => r.length >= 100, emoji: "🏆" },
  { titulo: "3 dias seguidos", condFn: (r: RegistroAlimentar[]) => {
    const datas = [...new Set(r.map(x => x.data))].sort();
    for (let i = 0; i < datas.length - 2; i++) {
      const d1 = new Date(datas[i]), d2 = new Date(datas[i+1]), d3 = new Date(datas[i+2]);
      if ((d2.getTime() - d1.getTime()) <= 86400000 && (d3.getTime() - d2.getTime()) <= 86400000) return true;
    }
    return false;
  }, emoji: "🔥" },
  { titulo: "Todas as frutas", condFn: (r: RegistroAlimentar[]) => {
    const frutas = new Set(r.flatMap(x => getAlimentosDoRegistro(x).filter(a => a.categoria === "frutas").map(a => a.nome)));
    return frutas.size >= 10;
  }, emoji: "🍇" },
];

const MarcosPage = () => {
  const { id: bebeId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bebe, setBebe] = useState<Bebe | null>(null);
  const [marcos, setMarcos] = useState<Marco[]>([]);
  const [registros, setRegistros] = useState<RegistroAlimentar[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);
  const [tipo, setTipo] = useState<string>("outro");
  const [foto, setFoto] = useState<string[]>([]);
  const [tab, setTab] = useState<"marcos" | "conquistas" | "timeline">("marcos");

  useEffect(() => {
    if (!bebeId) return;
    const b = bebeStore.getById(bebeId);
    if (!b) { navigate("/"); return; }
    setBebe(b);
    setMarcos(loadMarcos(bebeId));
    setRegistros(registroStore.listByBebe(bebeId));
  }, [bebeId, navigate]);

  if (!bebe || !bebeId) return null;

  const handleSubmit = () => {
    if (!titulo) return;
    const marco: Marco = {
      id: generateId(), bebe_id: bebeId, titulo, descricao, data, tipo: tipo as any,
      foto: foto[0], created_at: new Date().toISOString(),
    };
    saveMarco(marco);
    setMarcos([...marcos, marco]);
    setDialogOpen(false);
    setTitulo(""); setDescricao(""); setFoto([]);
  };

  // Build timeline from registros
  const timeline = registros.reduce((acc, r) => {
    if (!acc[r.data]) acc[r.data] = [];
    acc[r.data].push(r);
    return acc;
  }, {} as Record<string, RegistroAlimentar[]>);

  const timelineDates = Object.keys(timeline).sort().reverse().slice(0, 14);

  return (
    <div className="min-h-screen gradient-bg">
      <div className="paint-blob-yellow" />
      <div className="paint-blob-purple" />

      <header className="relative bg-gradient-to-br from-primary to-primary/80 pb-10 overflow-hidden">
        <div className="absolute top-4 right-10 w-14 h-14 rounded-full bg-yellow/25 animate-float" />
        <div className="max-w-2xl mx-auto px-4 pt-4 pb-6 relative z-10">
          <div className="flex items-center gap-3">
            <button className="btn-3d text-xs py-2 px-3" onClick={() => navigate(`/bebe/${bebeId}`)}>
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-extrabold text-white drop-shadow-sm">
                <Heart className="w-5 h-5 inline mr-1" /> Recordações
              </h1>
              <p className="text-sm text-white/80 font-semibold">{bebe.nome}</p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <button className="btn-3d btn-3d-secondary text-xs py-2 px-3">
                  <Plus className="w-4 h-4" /> Novo
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-md rounded-[1.5rem] max-h-[90vh] overflow-y-auto border-2">
                <DialogHeader>
                  <DialogTitle className="text-lg font-extrabold">Novo Marco ⭐</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-3 gap-2">
                    {TIPO_MARCOS.map((t) => (
                      <button key={t.value} type="button" onClick={() => setTipo(t.value)}
                        className={`p-2 rounded-[1rem] border-2 text-center transition-all bounce-tap ${
                          tipo === t.value ? "border-primary bg-primary/10 scale-105" : "border-border bg-card"
                        }`}>
                        <span className="text-xl block">{t.emoji}</span>
                        <span className="text-[9px] font-extrabold">{t.label}</span>
                      </button>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <Label className="font-extrabold">Título</Label>
                    <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex: Primeiro alimento do Pedro!" className="rounded-[1rem] h-12 border-2 font-semibold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-extrabold">Data</Label>
                    <Input type="date" value={data} onChange={(e) => setData(e.target.value)} className="rounded-[1rem] h-12 border-2 font-semibold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-extrabold">Descrição (opcional)</Label>
                    <Textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Conte como foi..." className="rounded-[1rem] border-2 font-semibold" rows={3} />
                  </div>
                  <PhotoUpload photos={foto} onAdd={(p) => setFoto([p])} onRemove={() => setFoto([])} maxPhotos={1} label="Foto do momento" />
                  <button onClick={handleSubmit} className="btn-3d btn-3d-primary w-full text-sm py-3">
                    Salvar Marco ⭐
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path d="M0,30 C250,65 500,15 750,45 C1000,70 1250,25 1440,40 L1440,60 L0,60 Z" fill="hsl(40 50% 97%)" />
        </svg>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5 relative z-10">
        <div className="flex gap-3">
          {[
            { key: "marcos", label: "⭐ Marcos" },
            { key: "conquistas", label: "🏆 Conquistas" },
            { key: "timeline", label: "📅 Timeline" },
          ].map((t) => (
            <button key={t.key} onClick={() => setTab(t.key as any)}
              className={`text-xs font-extrabold px-4 py-2.5 rounded-[1rem] flex-1 transition-all bounce-tap ${
                tab === t.key ? "bg-primary text-white shadow-lg" : "bg-card border-2 border-border"
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === "marcos" && (
          <div className="stagger-children space-y-4">
            {marcos.length === 0 ? (
              <Card className="rounded-[1.5rem] border-2 border-dashed border-primary/25">
                <CardContent className="text-center py-10">
                  <span className="text-5xl block mb-3 animate-float">💝</span>
                  <p className="text-muted-foreground font-semibold">Nenhum marco registrado ainda</p>
                  <p className="text-xs text-muted-foreground font-semibold mt-1">Registre momentos especiais da introdução alimentar!</p>
                </CardContent>
              </Card>
            ) : (
              marcos.sort((a, b) => b.data.localeCompare(a.data)).map((m) => (
                <Card key={m.id} className="rounded-[1.5rem] border-2 border-primary/15 overflow-hidden card-playful animate-pop-in">
                  <div className="h-1.5 bg-gradient-to-r from-primary via-yellow to-secondary" />
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      {m.foto ? (
                        <img src={m.foto} alt="" className="w-16 h-16 rounded-[1rem] object-cover border-2 border-primary/20" />
                      ) : (
                        <div className="w-16 h-16 rounded-[1rem] bg-primary/10 flex items-center justify-center text-2xl">
                          {TIPO_MARCOS.find(t => t.value === m.tipo)?.emoji || "⭐"}
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-extrabold text-sm">{m.titulo}</h3>
                        <p className="text-xs text-muted-foreground font-semibold">{formatDate(m.data)}</p>
                        {m.descricao && <p className="text-xs text-foreground font-semibold mt-1">{m.descricao}</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {tab === "conquistas" && (
          <div className="stagger-children space-y-3">
            {CONQUISTAS.map((c) => {
              const conquistado = c.condFn(registros);
              return (
                <Card key={c.titulo} className={`rounded-[1.2rem] border-2 overflow-hidden animate-pop-in ${conquistado ? "border-yellow/30 shadow-lg" : "border-border opacity-60"}`}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${conquistado ? "bg-yellow/20" : "bg-muted"}`}>
                      {conquistado ? c.emoji : "🔒"}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-extrabold text-sm">{c.titulo}</h3>
                      <p className="text-xs text-muted-foreground font-semibold">{conquistado ? "✅ Conquistado!" : "Continue registrando..."}</p>
                    </div>
                    {conquistado && <Star className="w-5 h-5 text-yellow fill-yellow" />}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {tab === "timeline" && (
          <div className="space-y-4 stagger-children">
            {timelineDates.length === 0 ? (
              <Card className="rounded-[1.5rem] border-2 border-dashed border-accent/25">
                <CardContent className="text-center py-10">
                  <span className="text-5xl block mb-3 animate-float">📅</span>
                  <p className="text-muted-foreground font-semibold">Nenhum registro para mostrar</p>
                </CardContent>
              </Card>
            ) : (
              timelineDates.map((date) => (
                <div key={date} className="animate-pop-in">
                  <p className="text-xs font-extrabold text-muted-foreground mb-2">📅 {formatDate(date)}</p>
                  <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {timeline[date].map((r) => (
                      <Card key={r.id} className="rounded-[1rem] border-2 border-border min-w-[140px] shrink-0">
                        <CardContent className="p-3">
                          {r.fotos && r.fotos[0] && (
                            <img src={r.fotos[0]} alt="" className="w-full h-16 object-cover rounded-lg mb-2" />
                          )}
                          <p className="text-xs font-extrabold">{getAlimentosDoRegistro(r).map(a => a.nome).join(", ")}</p>
                          <p className="text-[10px] text-muted-foreground font-semibold">{r.tipo_refeicao.replace("_", " ")}</p>
                          {getAlimentosDoRegistro(r).some(a => a.aceitacao) && <span className="text-[10px] font-extrabold text-yellow">⭐ {(getAlimentosDoRegistro(r).filter(a => a.aceitacao).reduce((s, a) => s + a.aceitacao!, 0) / getAlimentosDoRegistro(r).filter(a => a.aceitacao).length).toFixed(0)}/5</span>}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default MarcosPage;
