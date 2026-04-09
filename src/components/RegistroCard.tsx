import { useState } from "react";
import { Pencil, Trash2, X, Check, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { registroStore } from "@/data/store";
import { TIPO_REFEICAO_LABELS, CATEGORIA_LABELS } from "@/types";
import type { RegistroAlimentar, TipoRefeicao, CategoriaAlimento } from "@/types";
import { getAlimentosDoRegistro } from "@/utils/helpers";
import { toast } from "sonner";

const FOOD_EMOJI: Record<string, string> = {
  Banana: "🍌", Manga: "🥭", Mamão: "🥭", Abacate: "🥑", Pera: "🍐", Maçã: "🍎",
  Melão: "🍈", Melancia: "🍉", Uva: "🍇", Morango: "🍓", Kiwi: "🥝", Goiaba: "🍈",
  Laranja: "🍊", Brócolis: "🥦", Couve: "🥬", Espinafre: "🥬", "Couve-flor": "🥦",
  Alface: "🥬", Rúcula: "🥬", Repolho: "🥬", Agrião: "🥬",
  Cenoura: "🥕", "Batata-doce": "🍠", Abóbora: "🎃", Abobrinha: "🥒",
  Chuchu: "🥒", Beterraba: "🟣", Inhame: "🍠", Mandioca: "🍠",
  Tomate: "🍅", Vagem: "🫛",
  "Carne bovina": "🥩", Frango: "🍗", Ovo: "🥚", Peixe: "🐟", Fígado: "🫀",
  Arroz: "🍚", Aveia: "🥣", Macarrão: "🍝", Tapioca: "🫓", Cuscuz: "🫓",
  Feijão: "🫘", Lentilha: "🫘", "Grão-de-bico": "🫘", Ervilha: "🫛",
};

const CATEGORIA_COLORS: Record<CategoriaAlimento, string> = {
  frutas: "from-pink-400/20 to-red-400/20 border-pink-300/40",
  vegetais_folhosos: "from-green-400/20 to-emerald-400/20 border-green-300/40",
  legumes: "from-orange-400/20 to-amber-400/20 border-orange-300/40",
  proteinas: "from-red-400/20 to-rose-400/20 border-red-300/40",
  cereais: "from-yellow-400/20 to-amber-300/20 border-yellow-300/40",
  leguminosas: "from-amber-500/20 to-orange-400/20 border-amber-300/40",
  leite: "from-blue-200/20 to-sky-200/20 border-blue-200/40",
  agua: "from-cyan-300/20 to-blue-300/20 border-cyan-300/40",
};

function getFoodEmoji(nome: string, categoria: CategoriaAlimento): string {
  if (FOOD_EMOJI[nome]) return FOOD_EMOJI[nome];
  const catEmoji: Record<string, string> = {
    frutas: "🍎", vegetais_folhosos: "🥬", legumes: "🥕",
    proteinas: "🥩", cereais: "🌾", leguminosas: "🫘",
    leite: "🥛", agua: "💧",
  };
  return catEmoji[categoria] || "🍽️";
}

interface Props {
  registro: RegistroAlimentar;
  onUpdate: () => void;
}

export const RegistroCard = ({ registro: r, onUpdate }: Props) => {
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editData, setEditData] = useState({ ...r });

  const items = getAlimentosDoRegistro(r);

  const handleDelete = () => {
    registroStore.delete(r.id);
    toast.success("Registro removido!");
    setShowDelete(false);
    onUpdate();
  };

  const handleSave = () => {
    registroStore.update(r.id, {
      tipo_refeicao: editData.tipo_refeicao,
      notas: editData.notas,
    });
    toast.success("Registro atualizado! ✏️");
    setShowEdit(false);
    onUpdate();
  };

  const aceitacaoEmojis = [
    { value: 1, emoji: "😫" },
    { value: 2, emoji: "😕" },
    { value: 3, emoji: "😐" },
    { value: 4, emoji: "😊" },
    { value: 5, emoji: "😍" },
  ];

  return (
    <>
      <Card className="rounded-[1.2rem] border-2 border-border card-playful animate-pop-in group relative overflow-hidden">
        {/* Meal type header bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/30">
          <div className="flex items-center gap-2">
            <span className="text-lg">{TIPO_REFEICAO_LABELS[r.tipo_refeicao]?.split(" ")[0] || "🍽️"}</span>
            <span className="text-xs font-extrabold text-foreground/70 uppercase tracking-wider">
              {TIPO_REFEICAO_LABELS[r.tipo_refeicao]?.split(" ").slice(1).join(" ")}
            </span>
          </div>
          {/* Action buttons */}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => { setEditData({ ...r }); setShowEdit(true); }} className="w-7 h-7 rounded-full bg-accent/20 hover:bg-accent/40 flex items-center justify-center transition-colors bounce-tap">
              <Pencil className="w-3.5 h-3.5 text-accent-foreground" />
            </button>
            <button onClick={() => setShowDelete(true)} className="w-7 h-7 rounded-full bg-destructive/15 hover:bg-destructive/30 flex items-center justify-center transition-colors bounce-tap">
              <Trash2 className="w-3.5 h-3.5 text-destructive" />
            </button>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Food items */}
          <div className="space-y-2.5">
            {items.map((item, i) => (
              <div key={i} className={`flex items-center gap-3 p-2.5 rounded-[0.8rem] bg-gradient-to-r ${CATEGORIA_COLORS[item.categoria]} border`}>
                <span className="text-2xl shrink-0">{getFoodEmoji(item.nome, item.categoria)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-black text-base text-foreground uppercase tracking-wide">{item.nome}</p>
                    {item.novidade && (
                      <span className="text-[9px] font-extrabold bg-purple/15 text-purple px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shrink-0 border border-purple/25">
                        <Sparkles className="w-2.5 h-2.5" /> 1a vez
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground font-semibold">
                    {CATEGORIA_LABELS[item.categoria]?.split(" ").slice(1).join(" ")}
                    {item.tipo_corte ? ` · ✂️ ${item.tipo_corte}` : ""}
                  </p>
                </div>
                {item.aceitacao && (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow/80 to-orange/80 flex items-center justify-center shadow-sm shrink-0">
                    <span className="text-lg">{aceitacaoEmojis.find(a => a.value === item.aceitacao)?.emoji}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Photos + notes row */}
          {(r.notas || (r.fotos && r.fotos.length > 0)) && (
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border/30">
              {r.fotos && r.fotos.length > 0 && (
                <div className="flex -space-x-2 shrink-0">
                  {r.fotos.slice(0, 3).map((f, i) => (
                    <div key={i} className="relative">
                      <img src={f} alt="" className="w-9 h-9 rounded-lg object-cover border-2 border-card" />
                      {r.fotos!.length > 3 && i === 2 && (
                        <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                          <span className="text-white text-[9px] font-bold">+{r.fotos!.length - 3}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {r.notas && <p className="text-[11px] text-muted-foreground italic flex-1 min-w-0 truncate">📝 {r.notas}</p>}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent className="rounded-[1.5rem] border-2 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg">Editar Registro ✏️</DialogTitle>
            <DialogDescription>Altere as informações do registro</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1">
              <label className="text-xs font-extrabold">Alimentos</label>
              <div className="flex flex-wrap gap-1.5">
                {items.map((item, i) => (
                  <span key={i} className="text-xs font-bold bg-secondary/10 px-2.5 py-1 rounded-full border border-secondary/20 flex items-center gap-1">
                    {getFoodEmoji(item.nome, item.categoria)} {item.nome}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-extrabold">Refeição</label>
              <Select value={editData.tipo_refeicao} onValueChange={(v) => setEditData({ ...editData, tipo_refeicao: v as TipoRefeicao })}>
                <SelectTrigger className="rounded-xl h-10 border-2"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(TIPO_REFEICAO_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-extrabold">Observações</label>
              <Textarea value={editData.notas || ""} onChange={(e) => setEditData({ ...editData, notas: e.target.value })} className="rounded-xl border-2 resize-none" rows={2} />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowEdit(false)} className="btn-3d flex-1 text-xs py-3">
                <X className="w-4 h-4 mr-1" /> Cancelar
              </button>
              <button onClick={handleSave} className="btn-3d btn-3d-secondary flex-1 text-xs py-3">
                <Check className="w-4 h-4 mr-1" /> Salvar
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent className="rounded-[1.5rem] border-2 max-w-sm text-center">
          <DialogHeader>
            <DialogTitle className="text-lg">Remover Registro? 🗑️</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover <strong>{items.map(i => i.nome).join(", ")}</strong>? Essa ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <button onClick={() => setShowDelete(false)} className="btn-3d flex-1 text-xs py-3">Cancelar</button>
            <button onClick={handleDelete} className="btn-3d flex-1 text-xs py-3" style={{ borderColor: "hsl(0 72% 55%)", background: "hsl(0 72% 55% / 0.15)" }}>
              <Trash2 className="w-4 h-4 mr-1" /> Remover
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
