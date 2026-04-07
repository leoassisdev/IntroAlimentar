import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Check, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import GradientCheckbox from "@/components/GradientCheckbox";
import { alergenicoStore } from "@/data/store";
import { generateId } from "@/utils/helpers";
import { ALIMENTOS_ALERGENICOS, SINTOMAS_ATENCAO } from "@/types";
import type { RegistroAlergenico } from "@/types";
import { toast } from "sonner";

const AlergenicoPage = () => {
  const { id: bebeId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [registros, setRegistros] = useState<RegistroAlergenico[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alimento, setAlimento] = useState("");
  const [dataOferta, setDataOferta] = useState(new Date().toISOString().split("T")[0]);
  const [teveReacao, setTeveReacao] = useState(false);
  const [sintomasSelecionados, setSintomasSelecionados] = useState<string[]>([]);
  const [notas, setNotas] = useState("");

  useEffect(() => {
    if (bebeId) setRegistros(alergenicoStore.listByBebe(bebeId));
  }, [bebeId]);

  if (!bebeId) return null;

  const ofertasPorAlimento: Record<string, RegistroAlergenico[]> = {};
  registros.forEach((r) => {
    if (!ofertasPorAlimento[r.nome_alimento]) ofertasPorAlimento[r.nome_alimento] = [];
    ofertasPorAlimento[r.nome_alimento].push(r);
  });

  const podeOferecer = (alimentoNome: string): { pode: boolean; motivo: string } => {
    const ofertas = ofertasPorAlimento[alimentoNome] || [];
    if (ofertas.length >= 5) return { pode: false, motivo: "Máximo de 5 ofertas atingido" };
    const hoje = new Date();
    for (const o of ofertas) {
      const diff = Math.abs((hoje.getTime() - new Date(o.data_oferta).getTime()) / (1000 * 60 * 60 * 24));
      if (diff < 3) return { pode: false, motivo: "Intervalo mínimo de 3 dias" };
    }
    return { pode: true, motivo: "" };
  };

  const handleSubmit = () => {
    if (!alimento) { toast.error("Selecione o alimento"); return; }
    const check = podeOferecer(alimento);
    if (!check.pode) { toast.error(check.motivo); return; }
    if (teveReacao && sintomasSelecionados.length === 0) { toast.error("Selecione pelo menos um sintoma"); return; }
    const ofertas = ofertasPorAlimento[alimento] || [];
    alergenicoStore.create({
      id: generateId(), bebe_id: bebeId, nome_alimento: alimento, numero_oferta: ofertas.length + 1,
      data_oferta: dataOferta, teve_reacao: teveReacao, sintomas: sintomasSelecionados,
      notas: notas || undefined, created_at: new Date().toISOString(),
    });
    setRegistros(alergenicoStore.listByBebe(bebeId));
    setDialogOpen(false);
    setAlimento(""); setTeveReacao(false); setSintomasSelecionados([]); setNotas("");
    toast.success("Oferta registrada! ✅");
  };

  const toggleSintoma = (s: string) => {
    setSintomasSelecionados((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  };

  return (
    <div className="min-h-screen gradient-bg">
      <div className="paint-blob-yellow" />
      <div className="paint-blob-purple" />

      <header className="relative bg-gradient-to-br from-yellow to-yellow/80 pb-10 overflow-hidden">
        <div className="absolute top-4 right-10 w-14 h-14 rounded-full bg-primary/20 animate-float" />
        <div className="sparkle top-6 left-[25%] text-white/50" style={{ animationDelay: "0.5s" }}>✦</div>
        <div className="max-w-2xl mx-auto px-4 pt-4 pb-6 relative z-10">
          <div className="flex items-center gap-3">
            <button className="btn-3d text-xs py-2 px-3" onClick={() => navigate(`/bebe/${bebeId}`)}>
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-extrabold text-foreground drop-shadow-sm">Alergênicos ⚠️</h1>
              <p className="text-sm text-foreground/70 font-semibold">Controle de introdução</p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <button className="btn-3d btn-3d-primary text-xs py-2 px-3">
                  <Plus className="w-4 h-4" /> Registrar
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-md rounded-[1.5rem] max-h-[90vh] overflow-y-auto border-2">
                <DialogHeader>
                  <DialogTitle className="text-lg font-extrabold">Nova Oferta ⚠️</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label className="font-extrabold">Alimento</Label>
                    <Select value={alimento} onValueChange={setAlimento}>
                      <SelectTrigger className="rounded-[1rem] h-12 border-2 font-semibold"><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        {ALIMENTOS_ALERGENICOS.map((a) => {
                          const check = podeOferecer(a);
                          return (
                            <SelectItem key={a} value={a} disabled={!check.pode}>
                              {a} {!check.pode ? "🔒" : `(${(ofertasPorAlimento[a] || []).length}/5)`}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-extrabold">Data da Oferta</Label>
                    <Input type="date" value={dataOferta} onChange={(e) => setDataOferta(e.target.value)} className="rounded-[1rem] h-12 border-2 font-semibold" />
                  </div>

                  {/* Gradient checkbox for reaction */}
                  <div className="p-3 bg-destructive/5 rounded-[1rem] border-2 border-destructive/20">
                    <GradientCheckbox
                      checked={teveReacao}
                      onChange={setTeveReacao}
                      label="Teve reação alérgica?"
                    />
                  </div>

                  {teveReacao && (
                    <div className="space-y-3 p-4 bg-destructive/5 rounded-[1rem] border-2 border-destructive/20">
                      <Label className="text-sm font-extrabold">Sintomas observados:</Label>
                      {SINTOMAS_ATENCAO.map((s) => (
                        <GradientCheckbox
                          key={s}
                          checked={sintomasSelecionados.includes(s)}
                          onChange={() => toggleSintoma(s)}
                          label={s}
                        />
                      ))}
                      {sintomasSelecionados.some((s) => s.includes("EMERGÊNCIA")) && (
                        <div className="p-4 bg-destructive/15 rounded-[1rem] border-2 border-destructive/30 mt-2">
                          <p className="text-sm font-extrabold text-destructive">🚨 EMERGÊNCIA — Ligue SAMU: 192</p>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label className="font-extrabold">Observações</Label>
                    <Textarea value={notas} onChange={(e) => setNotas(e.target.value)} className="rounded-[1rem] border-2 font-semibold" rows={2} />
                  </div>
                  <button onClick={handleSubmit} className="btn-3d btn-3d-primary w-full text-sm py-3">
                    Registrar Oferta
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path d="M0,30 C250,60 500,15 750,45 C1000,65 1250,25 1440,35 L1440,60 L0,60 Z" fill="hsl(40 50% 97%)" />
        </svg>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4 relative z-10">
        <Card className="rounded-[1.5rem] border-2 border-yellow/25 bg-yellow-light/50 overflow-hidden animate-pop-in">
          <div className="h-1.5 bg-yellow" />
          <CardContent className="p-4 text-sm">
            <p className="font-extrabold text-foreground">💡 Dicas da nutricionista:</p>
            <ul className="mt-2 text-muted-foreground text-xs space-y-1.5 font-semibold">
              <li>• Introduzir UM alergênico por vez</li>
              <li>• Intervalo mínimo de 3 dias entre ofertas</li>
              <li>• Oferecer pela manhã para observar reações</li>
            </ul>
          </CardContent>
        </Card>

        <div className="stagger-children space-y-3">
          {ALIMENTOS_ALERGENICOS.map((alimentoNome) => {
            const ofertas = ofertasPorAlimento[alimentoNome] || [];
            const check = podeOferecer(alimentoNome);
            const teveAlgumaReacao = ofertas.some((o) => o.teve_reacao);

            return (
              <Card key={alimentoNome} className={`rounded-[1.2rem] border-2 card-playful animate-pop-in ${teveAlgumaReacao ? "border-destructive/30" : "border-border"}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {teveAlgumaReacao && <AlertTriangle className="w-4 h-4 text-destructive" />}
                      <h3 className="font-extrabold text-sm">{alimentoNome}</h3>
                    </div>
                    <span className="text-xs text-muted-foreground font-extrabold bg-muted px-2.5 py-1 rounded-full">{ofertas.length}/5</span>
                  </div>
                  <div className="flex gap-2.5">
                    {[1, 2, 3, 4, 5].map((n) => {
                      const oferta = ofertas.find((o) => o.numero_oferta === n);
                      return (
                        <div key={n} className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-extrabold border-2 transition-all ${
                          oferta
                            ? oferta.teve_reacao
                              ? "bg-destructive/15 border-destructive text-destructive shadow-md"
                              : "bg-secondary/15 border-secondary text-secondary shadow-md"
                            : "bg-muted border-border text-muted-foreground"
                        }`}>
                          {oferta ? (oferta.teve_reacao ? "!" : <Check className="w-4 h-4" />) : n}
                        </div>
                      );
                    })}
                  </div>
                  {!check.pode && ofertas.length < 5 && (
                    <p className="text-xs text-muted-foreground font-semibold mt-2">⏳ {check.motivo}</p>
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

export default AlergenicoPage;
