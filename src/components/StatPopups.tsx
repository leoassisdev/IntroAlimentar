import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { TIPO_REFEICAO_LABELS, CATEGORIA_LABELS } from "@/types";
import type { RegistroAlimentar } from "@/types";

interface AlimentosPopupProps {
  open: boolean;
  onClose: () => void;
  registros: RegistroAlimentar[];
}

export const AlimentosPopup = ({ open, onClose, registros }: AlimentosPopupProps) => {
  const porCategoria: Record<string, Record<string, number>> = {};
  registros.forEach((r) => {
    if (!porCategoria[r.categoria]) porCategoria[r.categoria] = {};
    porCategoria[r.categoria][r.nome_alimento] = (porCategoria[r.categoria][r.nome_alimento] || 0) + 1;
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-[1.5rem] border-2 max-w-md max-h-[70vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">🥗 Alimentos da Semana</DialogTitle>
          <DialogDescription>Tudo que foi oferecido, agrupado por categoria</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          {Object.entries(porCategoria).map(([cat, alimentos]) => (
            <div key={cat}>
              <p className="text-sm font-extrabold mb-2">{CATEGORIA_LABELS[cat as keyof typeof CATEGORIA_LABELS] || cat}</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(alimentos).map(([nome, qtd]) => (
                  <span key={nome} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-secondary/15 text-xs font-bold text-foreground border border-secondary/20">
                    {nome} <span className="text-secondary font-extrabold">×{qtd}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
          {Object.keys(porCategoria).length === 0 && (
            <p className="text-center text-muted-foreground py-6">Nenhum alimento registrado esta semana</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface RegistrosPopupProps {
  open: boolean;
  onClose: () => void;
  registros: RegistroAlimentar[];
}

export const RegistrosPopup = ({ open, onClose, registros }: RegistrosPopupProps) => {
  const porDia: Record<string, RegistroAlimentar[]> = {};
  registros.forEach((r) => {
    if (!porDia[r.data]) porDia[r.data] = [];
    porDia[r.data].push(r);
  });

  const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-[1.5rem] border-2 max-w-md max-h-[70vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">📝 Registros da Semana</DialogTitle>
          <DialogDescription>Todos os registros organizados por dia</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          {Object.entries(porDia).sort(([a], [b]) => a.localeCompare(b)).map(([data, regs]) => {
            const d = new Date(data + "T12:00:00");
            return (
              <div key={data}>
                <p className="text-sm font-extrabold mb-2">{dias[d.getDay()]} · {d.toLocaleDateString("pt-BR")}</p>
                <div className="space-y-1.5">
                  {regs.map((r) => (
                    <div key={r.id} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/5 border border-primary/10">
                      <span className="text-sm">{TIPO_REFEICAO_LABELS[r.tipo_refeicao]?.split(" ")[0]}</span>
                      <span className="text-xs font-bold text-foreground flex-1">{r.nome_alimento}</span>
                      {r.aceitacao && <span className="text-xs">{"😫😕😐😊😍"[r.aceitacao - 1]}</span>}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {Object.keys(porDia).length === 0 && (
            <p className="text-center text-muted-foreground py-6">Nenhum registro esta semana</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface Regra3PopupProps {
  open: boolean;
  onClose: () => void;
  categoria: string;
  alimentos: string[];
}

export const Regra3Popup = ({ open, onClose, categoria, alimentos }: Regra3PopupProps) => {
  const ok = alimentos.length >= 3;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-[1.5rem] border-2 max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg">{ok ? "✅" : "⚠️"} Regra dos 3 — {CATEGORIA_LABELS[categoria as keyof typeof CATEGORIA_LABELS]}</DialogTitle>
          <DialogDescription className="text-left">
            {ok
              ? "Parabéns! O bebê está recebendo variedade suficiente nesta categoria."
              : "A Regra dos 3 recomenda oferecer pelo menos 3 alimentos diferentes por categoria por semana, para garantir diversidade nutricional."
            }
          </DialogDescription>
        </DialogHeader>
        <div className="mt-3 space-y-3">
          <div className="p-3 rounded-xl bg-accent/10 border border-accent/20">
            <p className="text-xs font-extrabold text-foreground mb-1">📋 Por que isso importa?</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              A diversidade alimentar garante que o bebê receba diferentes vitaminas, minerais e nutrientes. 
              Repetir sempre o mesmo alimento pode causar deficiências e reduzir a aceitação no futuro.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-card border border-border">
            <p className="text-xs font-extrabold mb-2">Alimentos oferecidos ({alimentos.length}/3):</p>
            {alimentos.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {alimentos.map((a) => (
                  <span key={a} className="px-2.5 py-1 rounded-full bg-secondary/15 text-[11px] font-bold border border-secondary/20">{a}</span>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-muted-foreground">Nenhum alimento registrado nesta categoria esta semana.</p>
            )}
          </div>
          {!ok && (
            <div className="p-3 rounded-xl bg-yellow/10 border border-yellow/20">
              <p className="text-xs font-extrabold text-foreground">💡 Sugestão</p>
              <p className="text-[11px] text-muted-foreground">
                Tente incluir {3 - alimentos.length} alimento{3 - alimentos.length > 1 ? "s" : ""} diferente{3 - alimentos.length > 1 ? "s" : ""} de {CATEGORIA_LABELS[categoria as keyof typeof CATEGORIA_LABELS]?.split(" ").slice(1).join(" ")} até o fim da semana.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
