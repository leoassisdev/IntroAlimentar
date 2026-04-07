import { useState } from "react";
import { Pencil, Trash2, X, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { registroStore } from "@/data/store";
import { TIPO_REFEICAO_LABELS, CATEGORIA_LABELS } from "@/types";
import type { RegistroAlimentar, TipoRefeicao, CategoriaAlimento } from "@/types";
import { toast } from "sonner";

interface Props {
  registro: RegistroAlimentar;
  onUpdate: () => void;
}

export const RegistroCard = ({ registro: r, onUpdate }: Props) => {
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editData, setEditData] = useState({ ...r });

  const handleDelete = () => {
    registroStore.delete(r.id);
    toast.success("Registro removido!");
    setShowDelete(false);
    onUpdate();
  };

  const handleSave = () => {
    registroStore.update(r.id, {
      tipo_refeicao: editData.tipo_refeicao,
      categoria: editData.categoria,
      nome_alimento: editData.nome_alimento,
      tipo_corte: editData.tipo_corte,
      aceitacao: editData.aceitacao,
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
      <Card className="rounded-[1.2rem] border-2 border-border card-playful animate-pop-in group relative">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-[1rem] bg-gradient-to-br from-primary/15 to-yellow/15 flex items-center justify-center text-2xl shrink-0">
              {TIPO_REFEICAO_LABELS[r.tipo_refeicao]?.split(" ")[0] || "🍽️"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-extrabold text-sm text-foreground">{r.nome_alimento}</p>
              <p className="text-xs text-muted-foreground font-semibold">
                {TIPO_REFEICAO_LABELS[r.tipo_refeicao]?.split(" ").slice(1).join(" ")} · {CATEGORIA_LABELS[r.categoria]?.split(" ").slice(1).join(" ")}
              </p>
              {r.tipo_corte && <p className="text-xs text-muted-foreground">✂️ {r.tipo_corte}</p>}
              {r.notas && <p className="text-[10px] text-muted-foreground italic mt-0.5">📝 {r.notas}</p>}
            </div>
            {r.fotos && r.fotos.length > 0 && (
              <div className="flex -space-x-2">
                {r.fotos.slice(0, 2).map((f, i) => (
                  <div key={i} className="relative">
                    <img src={f} alt="" className="w-8 h-8 rounded-lg object-cover border-2 border-card" />
                    {r.fotos!.length > 2 && i === 1 && (
                      <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                        <span className="text-white text-[9px] font-bold">+{r.fotos!.length - 2}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {r.aceitacao && (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow to-orange flex items-center justify-center shadow-md">
                <span className="text-lg">{aceitacaoEmojis.find(a => a.value === r.aceitacao)?.emoji || r.aceitacao}</span>
              </div>
            )}
            {/* Action buttons */}
            <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => { setEditData({ ...r }); setShowEdit(true); }} className="w-7 h-7 rounded-full bg-accent/20 hover:bg-accent/40 flex items-center justify-center transition-colors bounce-tap">
                <Pencil className="w-3.5 h-3.5 text-accent-foreground" />
              </button>
              <button onClick={() => setShowDelete(true)} className="w-7 h-7 rounded-full bg-destructive/15 hover:bg-destructive/30 flex items-center justify-center transition-colors bounce-tap">
                <Trash2 className="w-3.5 h-3.5 text-destructive" />
              </button>
            </div>
          </div>
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
              <label className="text-xs font-extrabold">Alimento</label>
              <Input value={editData.nome_alimento} onChange={(e) => setEditData({ ...editData, nome_alimento: e.target.value })} className="rounded-xl h-10 border-2" />
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
              <label className="text-xs font-extrabold">Corte</label>
              <Input value={editData.tipo_corte || ""} onChange={(e) => setEditData({ ...editData, tipo_corte: e.target.value })} className="rounded-xl h-10 border-2" placeholder="Ex: palito, amassado..." />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-extrabold">Aceitação</label>
              <div className="flex gap-2">
                {aceitacaoEmojis.map((a) => (
                  <button key={a.value} type="button" onClick={() => setEditData({ ...editData, aceitacao: a.value })}
                    className={`p-2 rounded-xl border-2 transition-all bounce-tap text-xl ${editData.aceitacao === a.value ? "border-yellow bg-yellow-light scale-110" : "border-border bg-card"}`}>
                    {a.emoji}
                  </button>
                ))}
              </div>
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
              Tem certeza que deseja remover <strong>{r.nome_alimento}</strong>? Essa ação não pode ser desfeita.
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
