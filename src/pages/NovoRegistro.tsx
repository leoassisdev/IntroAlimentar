import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PhotoUpload } from "@/components/PhotoUpload";
import { registroStore } from "@/data/store";
import { generateId } from "@/utils/helpers";
import { FOOD_DATABASE } from "@/data/foods";
import { TIPO_REFEICAO_LABELS, CATEGORIA_LABELS } from "@/types";
import type { TipoRefeicao, CategoriaAlimento } from "@/types";
import { toast } from "sonner";

const NovoRegistro = () => {
  const { id: bebeId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialDate = searchParams.get("data") || new Date().toISOString().split("T")[0];
  const [data, setData] = useState(initialDate);
  const [tipoRefeicao, setTipoRefeicao] = useState<TipoRefeicao>("almoco");
  const [categoria, setCategoria] = useState<CategoriaAlimento>("frutas");
  const [nomeAlimento, setNomeAlimento] = useState("");
  const [tipoCorte, setTipoCorte] = useState("");
  const [aceitacao, setAceitacao] = useState<number | undefined>();
  const [notas, setNotas] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [unidade, setUnidade] = useState("");
  const [fotos, setFotos] = useState<string[]>([]);

  if (!bebeId) return null;

  const alimentosCategoria = FOOD_DATABASE[categoria] || [];
  const alimentoSelecionado = alimentosCategoria.find((a) => a.nome === nomeAlimento);
  const cortesSugeridos = alimentoSelecionado?.cortes || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeAlimento) { toast.error("Selecione um alimento"); return; }

    registroStore.create({
      id: generateId(), bebe_id: bebeId, data, tipo_refeicao: tipoRefeicao, categoria,
      nome_alimento: nomeAlimento, tipo_corte: tipoCorte || undefined, aceitacao,
      notas: notas || undefined, quantidade: quantidade ? parseFloat(quantidade) : undefined,
      unidade: (unidade || undefined) as any, alimento_alergenico: alimentoSelecionado?.alergenico || false,
      fotos: fotos.length > 0 ? fotos : undefined, created_at: new Date().toISOString(),
    });

    toast.success(`${nomeAlimento} registrado! 🎉`);
    if (alimentoSelecionado?.alergenico) {
      toast.warning(`⚠️ ${nomeAlimento} é alergênico — fique atenta(o) a reações!`, { duration: 5000 });
    }
    navigate(`/bebe/${bebeId}`);
  };

  const aceitacaoEmojis = [
    { value: 1, emoji: "😫", label: "Rejeitou" },
    { value: 2, emoji: "😕", label: "Pouco" },
    { value: 3, emoji: "😐", label: "Ok" },
    { value: 4, emoji: "😊", label: "Gostou" },
    { value: 5, emoji: "😍", label: "Amou!" },
  ];

  return (
    <div className="min-h-screen gradient-bg">
      <div className="paint-blob-yellow" />
      <div className="paint-blob-purple" />

      <header className="relative bg-gradient-to-br from-primary to-primary/80 pb-10 overflow-hidden">
        <div className="absolute top-5 right-10 w-12 h-12 rounded-full bg-yellow/25 animate-float" />
        <div className="sparkle top-3 left-[40%] text-white/40" style={{ animationDelay: "1s" }}>✧</div>
        <div className="max-w-2xl mx-auto px-4 pt-4 pb-6 relative z-10">
          <div className="flex items-center gap-3">
            <button className="btn-3d text-xs py-2 px-3" onClick={() => navigate(`/bebe/${bebeId}`)}>
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-xl font-extrabold text-white drop-shadow-sm">Novo Registro 🍎</h1>
          </div>
        </div>
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path d="M0,35 C300,70 600,15 900,45 C1100,60 1300,30 1440,40 L1440,60 L0,60 Z" fill="hsl(40 50% 97%)" />
        </svg>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 relative z-10">
        <form onSubmit={handleSubmit} className="space-y-5 stagger-children">
          {/* Data e Refeição */}
          <Card className="rounded-[1.5rem] border-2 border-primary/15 overflow-hidden animate-pop-in">
            <div className="h-1.5 bg-primary/40" />
            <CardContent className="p-5 space-y-4">
              <p className="font-bold text-base text-foreground">📅 Quando?</p>
              <div className="space-y-2">
                <Label className="text-sm font-extrabold">Data</Label>
                <Input type="date" value={data} onChange={(e) => setData(e.target.value)} className="rounded-[1rem] h-12 border-2 font-semibold" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-extrabold">Refeição</Label>
                <Select value={tipoRefeicao} onValueChange={(v) => setTipoRefeicao(v as TipoRefeicao)}>
                  <SelectTrigger className="rounded-[1rem] h-12 border-2 font-semibold"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(TIPO_REFEICAO_LABELS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Alimento */}
          <Card className="rounded-[1.5rem] border-2 border-secondary/15 overflow-hidden animate-pop-in">
            <div className="h-1.5 bg-secondary/40" />
            <CardContent className="p-5 space-y-4">
              <p className="font-bold text-base text-foreground">🍎 O que comeu?</p>
              <div className="space-y-2">
                <Label className="text-sm font-extrabold">Categoria</Label>
                <Select value={categoria} onValueChange={(v) => { setCategoria(v as CategoriaAlimento); setNomeAlimento(""); setTipoCorte(""); }}>
                  <SelectTrigger className="rounded-[1rem] h-12 border-2 font-semibold"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(CATEGORIA_LABELS).filter(([k]) => k !== "leite" && k !== "agua").map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {alimentosCategoria.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-extrabold">Alimento</Label>
                  <Select value={nomeAlimento} onValueChange={(v) => { setNomeAlimento(v); setTipoCorte(""); }}>
                    <SelectTrigger className="rounded-[1rem] h-12 border-2 font-semibold"><SelectValue placeholder="Escolha o alimento" /></SelectTrigger>
                    <SelectContent>
                      {alimentosCategoria.map((a) => (
                        <SelectItem key={a.nome} value={a.nome}>{a.nome} {a.alergenico ? "⚠️" : ""}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {cortesSugeridos.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-extrabold">Tipo de Corte ✂️</Label>
                  <Select value={tipoCorte} onValueChange={setTipoCorte}>
                    <SelectTrigger className="rounded-[1rem] h-12 border-2 font-semibold"><SelectValue placeholder="Selecione o corte" /></SelectTrigger>
                    <SelectContent>
                      {cortesSugeridos.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Fotos */}
          <Card className="rounded-[1.5rem] border-2 border-accent/15 overflow-hidden animate-pop-in">
            <div className="h-1.5 bg-accent/40" />
            <CardContent className="p-5 space-y-3">
              <p className="font-bold text-base text-foreground">📸 Fotos (opcional)</p>
              <p className="text-xs text-muted-foreground font-semibold">Registre a refeição ou o bebê comendo!</p>
              <PhotoUpload photos={fotos} onAdd={(p) => setFotos([...fotos, p])} onRemove={(i) => setFotos(fotos.filter((_, idx) => idx !== i))} maxPhotos={4} label="Foto" />
            </CardContent>
          </Card>

          {/* Aceitação */}
          {categoria !== "agua" && categoria !== "leite" && (
            <Card className="rounded-[1.5rem] border-2 border-yellow/15 overflow-hidden animate-pop-in">
              <div className="h-1.5 bg-yellow/40" />
              <CardContent className="p-5">
                <p className="font-bold text-base text-foreground mb-4">😋 Como foi a aceitação?</p>
                <div className="grid grid-cols-5 gap-2">
                  {aceitacaoEmojis.map((a) => (
                    <button key={a.value} type="button" onClick={() => setAceitacao(a.value)}
                      className={`p-3 rounded-[1rem] border-2 transition-all text-center bounce-tap ${
                        aceitacao === a.value ? "border-yellow bg-yellow-light scale-110 shadow-lg" : "border-border hover:border-yellow/40 bg-card"
                      }`}>
                      <span className={`text-2xl block ${aceitacao === a.value ? "animate-wiggle" : ""}`}>{a.emoji}</span>
                      <span className="text-[9px] font-extrabold text-muted-foreground">{a.label}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Detalhes */}
          <Card className="rounded-[1.5rem] border-2 border-purple/10 overflow-hidden animate-pop-in">
            <div className="h-1.5 bg-purple/30" />
            <CardContent className="p-5 space-y-4">
              <p className="font-bold text-base text-foreground">📝 Detalhes (opcional)</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-sm font-extrabold">Quantidade</Label>
                  <Input type="number" placeholder="Ex: 100" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} className="rounded-[1rem] h-12 border-2 font-semibold" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-extrabold">Unidade</Label>
                  <Select value={unidade} onValueChange={setUnidade}>
                    <SelectTrigger className="rounded-[1rem] h-12 border-2 font-semibold"><SelectValue placeholder="—" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="g">gramas</SelectItem>
                      <SelectItem value="ml">ml</SelectItem>
                      <SelectItem value="porcao">porção</SelectItem>
                      <SelectItem value="min">minutos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-extrabold">Observações</Label>
                <Textarea placeholder="Como foi a refeição?" value={notas} onChange={(e) => setNotas(e.target.value)} className="rounded-[1rem] resize-none border-2 font-semibold" rows={3} />
              </div>
            </CardContent>
          </Card>

          <button type="submit" className="btn-3d btn-3d-secondary w-full text-base py-4">
            Salvar Registro ✅
          </button>
        </form>
      </main>
    </div>
  );
};

export default NovoRegistro;
