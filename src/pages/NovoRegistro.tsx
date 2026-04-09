import { useState, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Plus, X, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PhotoUpload } from "@/components/PhotoUpload";
import { registroStore } from "@/data/store";
import { generateId, getAlimentosDoRegistro } from "@/utils/helpers";
import { FOOD_DATABASE } from "@/data/foods";
import { TIPO_REFEICAO_LABELS, CATEGORIA_LABELS } from "@/types";
import type { TipoRefeicao, CategoriaAlimento, ItemAlimento } from "@/types";
import { toast } from "sonner";

const aceitacaoEmojis = [
  { value: 1, emoji: "😫", label: "Rejeitou" },
  { value: 2, emoji: "😕", label: "Pouco" },
  { value: 3, emoji: "😐", label: "Ok" },
  { value: 4, emoji: "😊", label: "Gostou" },
  { value: 5, emoji: "😍", label: "Amou!" },
];

const NovoRegistro = () => {
  const { id: bebeId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialDate = searchParams.get("data") || new Date().toISOString().split("T")[0];

  const [data, setData] = useState(initialDate);
  const [tipoRefeicao, setTipoRefeicao] = useState<TipoRefeicao>("almoco");
  const [fotos, setFotos] = useState<string[]>([]);
  const [notas, setNotas] = useState("");

  const [categoria, setCategoria] = useState<CategoriaAlimento>("frutas");
  const [nomeAlimento, setNomeAlimento] = useState("");
  const [nomeCustom, setNomeCustom] = useState("");
  const [tipoCorte, setTipoCorte] = useState("");

  const [alimentos, setAlimentos] = useState<ItemAlimento[]>([]);

  if (!bebeId) return null;

  const alimentosJaOferecidos = useMemo(() => {
    const registros = registroStore.listByBebe(bebeId);
    const set = new Set<string>();
    registros.forEach(r => {
      getAlimentosDoRegistro(r).forEach(a => set.add(a.nome));
    });
    return set;
  }, [bebeId]);

  const alimentosCategoria = FOOD_DATABASE[categoria] || [];
  const alimentoSelecionado = alimentosCategoria.find((a) => a.nome === nomeAlimento);
  const cortesSugeridos = alimentoSelecionado?.cortes || [];

  const handleAddAlimento = () => {
    const nome = nomeAlimento === "__outro__" ? nomeCustom.trim() : nomeAlimento;
    if (!nome) { toast.error("Selecione ou digite um alimento"); return; }
    if (alimentos.some(a => a.nome === nome)) {
      toast.error("Alimento já adicionado");
      return;
    }

    const novidade = !alimentosJaOferecidos.has(nome);

    const item: ItemAlimento = {
      nome,
      categoria,
      tipo_corte: tipoCorte || undefined,
      alergenico: alimentoSelecionado?.alergenico || false,
      novidade,
    };

    setAlimentos([...alimentos, item]);
    setNomeAlimento("");
    setNomeCustom("");
    setTipoCorte("");

    if (novidade) {
      toast.success(`${item.nome} é novidade! ✨`);
    }
    if (item.alergenico) {
      toast.warning(`⚠️ ${item.nome} é alergênico — fique atenta(o)!`, { duration: 4000 });
    }
  };

  const handleRemoveAlimento = (index: number) => {
    setAlimentos(alimentos.filter((_, i) => i !== index));
  };

  const handleSetAceitacao = (index: number, value: number) => {
    const updated = [...alimentos];
    updated[index] = { ...updated[index], aceitacao: updated[index].aceitacao === value ? undefined : value };
    setAlimentos(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (alimentos.length === 0) { toast.error("Adicione pelo menos um alimento"); return; }

    registroStore.create({
      id: generateId(),
      bebe_id: bebeId,
      data,
      tipo_refeicao: tipoRefeicao,
      categoria: alimentos[0].categoria,
      nome_alimento: alimentos.map(a => a.nome).join(", "),
      tipo_corte: alimentos[0].tipo_corte,
      aceitacao: undefined,
      alimento_alergenico: alimentos.some(a => a.alergenico),
      alimentos,
      notas: notas || undefined,
      fotos: fotos.length > 0 ? fotos : undefined,
      created_at: new Date().toISOString(),
    });

    const nomes = alimentos.map(a => a.nome).join(", ");
    toast.success(`${nomes} registrado! 🎉`);
    const novidades = alimentos.filter(a => a.novidade);
    if (novidades.length > 0) {
      toast.success(`✨ Novidade${novidades.length > 1 ? "s" : ""}: ${novidades.map(a => a.nome).join(", ")}!`, { duration: 5000 });
    }
    navigate(`/bebe/${bebeId}`);
  };

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

          {/* Alimentos */}
          <Card className="rounded-[1.5rem] border-2 border-secondary/15 overflow-hidden animate-pop-in">
            <div className="h-1.5 bg-secondary/40" />
            <CardContent className="p-5 space-y-4">
              <p className="font-bold text-base text-foreground">🍎 O que comeu?</p>

              {/* Added foods list */}
              {alimentos.length > 0 && (
                <div className="space-y-3">
                  {alimentos.map((item, idx) => (
                    <div key={idx} className="p-3 bg-card rounded-[1rem] border-2 border-border shadow-sm animate-pop-in">
                      <div className="flex items-center gap-2 mb-2">
                        <button type="button" onClick={() => handleRemoveAlimento(idx)}
                          className="w-6 h-6 rounded-full bg-destructive/15 hover:bg-destructive/30 flex items-center justify-center transition-colors shrink-0">
                          <X className="w-3 h-3 text-destructive" />
                        </button>
                        <span className="font-extrabold text-sm flex-1">{item.nome}</span>
                        {item.novidade && (
                          <span className="text-[10px] font-extrabold bg-gradient-to-r from-purple/15 to-accent/15 text-purple border border-purple/20 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                            <Sparkles className="w-3 h-3" /> Novidade!
                          </span>
                        )}
                        {item.alergenico && (
                          <span className="text-[10px] font-extrabold bg-yellow/15 text-yellow-700 border border-yellow/30 px-2 py-0.5 rounded-full shrink-0">⚠️</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-semibold mb-2">
                        <span>{CATEGORIA_LABELS[item.categoria]}</span>
                        {item.tipo_corte && <span>· ✂️ {item.tipo_corte}</span>}
                      </div>
                      {/* Acceptance per food */}
                      {item.categoria !== "agua" && item.categoria !== "leite" && (
                        <div className="flex gap-1.5">
                          {aceitacaoEmojis.map((a) => (
                            <button key={a.value} type="button" onClick={() => handleSetAceitacao(idx, a.value)}
                              className={`flex-1 py-1.5 rounded-lg border-2 transition-all text-center bounce-tap ${
                                item.aceitacao === a.value ? "border-yellow bg-yellow-light scale-105 shadow-sm" : "border-border hover:border-yellow/40 bg-card"
                              }`}>
                              <span className={`text-lg block ${item.aceitacao === a.value ? "animate-wiggle" : ""}`}>{a.emoji}</span>
                              <span className="text-[8px] font-extrabold text-muted-foreground block">{a.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Add food form */}
              <div className="p-4 bg-secondary/5 rounded-[1rem] border-2 border-dashed border-secondary/20 space-y-3">
                <p className="text-xs font-extrabold text-muted-foreground">
                  {alimentos.length === 0 ? "Adicione os alimentos da refeição" : "+ Adicionar outro alimento"}
                </p>
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

                <div className="space-y-2">
                <Label className="text-sm font-extrabold">Alimento</Label>
                <Select value={nomeAlimento} onValueChange={(v) => { setNomeAlimento(v); setNomeCustom(""); setTipoCorte(""); }}>
                  <SelectTrigger className="rounded-[1rem] h-12 border-2 font-semibold"><SelectValue placeholder="Escolha o alimento" /></SelectTrigger>
                  <SelectContent>
                    {alimentosCategoria.map((a) => (
                      <SelectItem key={a.nome} value={a.nome}>
                        {a.nome} {a.alergenico ? "⚠️" : ""} {!alimentosJaOferecidos.has(a.nome) ? "✨" : ""}
                      </SelectItem>
                    ))}
                    <SelectItem value="__outro__">✏️ Outro...</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {nomeAlimento === "__outro__" && (
                <div className="space-y-2">
                  <Label className="text-sm font-extrabold">Nome do alimento</Label>
                  <Input
                    value={nomeCustom}
                    onChange={(e) => setNomeCustom(e.target.value)}
                    placeholder="Digite o nome do alimento"
                    className="rounded-[1rem] h-12 border-2 font-semibold"
                    autoFocus
                  />
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

                <button type="button" onClick={handleAddAlimento}
                  className="btn-3d btn-3d-secondary w-full text-sm py-3 flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> Adicionar Alimento
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Fotos */}
          <Card className="rounded-[1.5rem] border-2 border-accent/15 overflow-hidden animate-pop-in">
            <div className="h-1.5 bg-accent/40" />
            <CardContent className="p-5 space-y-3">
              <p className="font-bold text-base text-foreground">📸 Fotos (opcional)</p>
              <p className="text-xs text-muted-foreground font-semibold">Registre a refeição ou o bebê comendo!</p>
              <PhotoUpload photos={fotos} onAdd={(p) => setFotos([...fotos, p])} onRemove={(i) => setFotos(fotos.filter((_, idx) => idx !== i))} maxPhotos={8} label="Foto" />
            </CardContent>
          </Card>

          {/* Observações */}
          <Card className="rounded-[1.5rem] border-2 border-purple/10 overflow-hidden animate-pop-in">
            <div className="h-1.5 bg-purple/30" />
            <CardContent className="p-5 space-y-4">
              <p className="font-bold text-base text-foreground">📝 Observações (opcional)</p>
              <Textarea placeholder="Como foi a refeição?" value={notas} onChange={(e) => setNotas(e.target.value)} className="rounded-[1rem] resize-none border-2 font-semibold" rows={3} />
            </CardContent>
          </Card>

          <button type="submit" className="btn-3d btn-3d-secondary w-full text-base py-4">
            Salvar Registro ✅ {alimentos.length > 0 && `(${alimentos.length} alimento${alimentos.length > 1 ? "s" : ""})`}
          </button>
        </form>
      </main>
    </div>
  );
};

export default NovoRegistro;
