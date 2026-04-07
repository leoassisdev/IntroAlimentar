import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RegistroCard } from "@/components/RegistroCard";
import type { RegistroAlimentar } from "@/types";

interface Props {
  registros: RegistroAlimentar[];
  bebeId: string;
  onNavigateToRegistro: (date: string) => void;
  onDataChange: () => void;
}

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export const CalendarioAlimentar = ({ registros, bebeId, onNavigateToRegistro, onDataChange }: Props) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const today = new Date().toISOString().split("T")[0];

  // Count registros per day
  const registrosPorDia = useMemo(() => {
    const map: Record<string, RegistroAlimentar[]> = {};
    registros.forEach((r) => {
      if (!map[r.data]) map[r.data] = [];
      map[r.data].push(r);
    });
    return map;
  }, [registros]);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const getDateStr = (day: number) => {
    const m = String(month + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${year}-${m}-${d}`;
  };

  const selectedRegistros = selectedDate ? (registrosPorDia[selectedDate] || []) : [];

  const getDayColor = (count: number) => {
    if (count === 0) return "";
    if (count <= 2) return "bg-secondary/20 border-secondary/40";
    if (count <= 4) return "bg-secondary/40 border-secondary/60";
    return "bg-secondary/60 border-secondary/80";
  };

  return (
    <>
      <Card className="rounded-[1.8rem] border-2 border-accent/20 overflow-hidden shadow-xl animate-pop-in">
        {/* Gradient header */}
        <div className="bg-gradient-to-r from-[hsl(200,70%,85%)] to-[hsl(280,60%,88%)] p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={prevMonth}
              className="w-9 h-9 rounded-full bg-white/60 backdrop-blur flex items-center justify-center hover:bg-white/80 transition-all hover:scale-110 bounce-tap shadow-sm"
            >
              <ChevronLeft className="w-5 h-5 text-[hsl(220,50%,30%)]" />
            </button>
            <div className="text-center">
              <h3 className="text-xl font-extrabold text-[hsl(220,50%,30%)] tracking-wide" style={{ fontFamily: "'Kaushan Script', cursive" }}>
                {MESES[month]}
              </h3>
              <p className="text-xs font-bold text-[hsl(220,50%,30%)]/60">{year}</p>
            </div>
            <button
              onClick={nextMonth}
              className="w-9 h-9 rounded-full bg-white/60 backdrop-blur flex items-center justify-center hover:bg-white/80 transition-all hover:scale-110 bounce-tap shadow-sm"
            >
              <ChevronRight className="w-5 h-5 text-[hsl(220,50%,30%)]" />
            </button>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DIAS_SEMANA.map((d) => (
              <div key={d} className="text-center text-[10px] font-extrabold text-primary/70 py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, i) => {
              if (day === null) return <div key={`empty-${i}`} />;

              const dateStr = getDateStr(day);
              const count = registrosPorDia[dateStr]?.length || 0;
              const isToday = dateStr === today;
              const isFuture = dateStr > today;
              const isSelected = dateStr === selectedDate;

              return (
                <button
                  key={dateStr}
                  onClick={() => !isFuture && setSelectedDate(dateStr)}
                  disabled={isFuture}
                  className={`
                    relative aspect-square rounded-2xl flex flex-col items-center justify-center
                    text-sm font-bold transition-all duration-200 border-2
                    ${isFuture ? "opacity-30 cursor-not-allowed border-transparent" : "cursor-pointer hover:scale-110 bounce-tap"}
                    ${isSelected ? "border-primary bg-primary/15 scale-110 shadow-lg ring-2 ring-primary/30" :
                      isToday ? "border-accent bg-accent/20 shadow-md" :
                      count > 0 ? getDayColor(count) : "border-transparent hover:border-border hover:bg-muted/30"}
                  `}
                >
                  <span className={`${isToday ? "text-accent-foreground font-extrabold" : isSelected ? "text-primary" : "text-foreground"}`}>
                    {day}
                  </span>
                  {count > 0 && (
                    <div className="flex gap-0.5 mt-0.5">
                      {Array.from({ length: Math.min(count, 4) }).map((_, j) => (
                        <div
                          key={j}
                          className={`w-1 h-1 rounded-full ${
                            isSelected ? "bg-primary" : "bg-secondary"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                  {isToday && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent border-2 border-card" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-border/30">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-accent/40 border border-accent" />
              <span className="text-[9px] font-bold text-muted-foreground">Hoje</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-secondary/40 border border-secondary" />
              <span className="text-[9px] font-bold text-muted-foreground">Com registros</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex gap-0.5">
                <div className="w-1 h-1 rounded-full bg-secondary" />
                <div className="w-1 h-1 rounded-full bg-secondary" />
                <div className="w-1 h-1 rounded-full bg-secondary" />
              </div>
              <span className="text-[9px] font-bold text-muted-foreground">Nº refeições</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected day detail */}
      <Dialog open={!!selectedDate} onOpenChange={(open) => !open && setSelectedDate(null)}>
        <DialogContent className="rounded-[1.5rem] max-w-lg max-h-[80vh] overflow-y-auto border-2 border-accent/20">
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold flex items-center gap-2">
              📅 {selectedDate && new Date(selectedDate + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
            </DialogTitle>
          </DialogHeader>

          {selectedRegistros.length === 0 ? (
            <div className="text-center py-8">
              <span className="text-5xl block mb-3 animate-float">🍽️</span>
              <p className="text-muted-foreground font-semibold mb-1">Nenhum registro neste dia</p>
              <p className="text-xs text-muted-foreground mb-4">Adicione uma refeição para este dia</p>
              <button
                className="btn-3d btn-3d-primary text-xs py-2.5 px-5"
                onClick={() => {
                  setSelectedDate(null);
                  onNavigateToRegistro(selectedDate!);
                }}
              >
                <Plus className="w-4 h-4 mr-1" /> Adicionar Refeição
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedRegistros
                .sort((a, b) => {
                  const order = ["cafe_manha", "lanche_manha", "almoco", "lanche_tarde", "jantar", "ceia"];
                  return order.indexOf(a.tipo_refeicao) - order.indexOf(b.tipo_refeicao);
                })
                .map((r) => (
                  <RegistroCard key={r.id} registro={r} onUpdate={onDataChange} />
                ))}
              <button
                className="btn-3d btn-3d-secondary w-full text-xs py-3 mt-2"
                onClick={() => {
                  setSelectedDate(null);
                  onNavigateToRegistro(selectedDate!);
                }}
              >
                <Plus className="w-4 h-4 mr-1" /> Adicionar mais refeições
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
