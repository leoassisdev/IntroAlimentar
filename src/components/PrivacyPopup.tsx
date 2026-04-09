import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const PRIVACY_EVENT = "introalimentar:show-privacy";

/** Call this to show the privacy popup from anywhere */
export function showPrivacyPopup() {
  window.dispatchEvent(new CustomEvent(PRIVACY_EVENT));
}

export const PrivacyPopup = () => {
  const [open, setOpen] = useState(false);

  const handleShow = useCallback(() => setOpen(true), []);

  useEffect(() => {
    window.addEventListener(PRIVACY_EVENT, handleShow);
    return () => window.removeEventListener(PRIVACY_EVENT, handleShow);
  }, [handleShow]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="rounded-[1.5rem] border-2 border-primary/20 max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg text-center">Seus dados estao seguros</DialogTitle>
          <DialogDescription className="text-center text-sm">
            Privacidade em primeiro lugar
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-3xl">
              🔒
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10">
              <span className="text-lg shrink-0">📱</span>
              <div>
                <p className="text-xs font-extrabold text-foreground">100% Offline</p>
                <p className="text-[11px] text-muted-foreground">O app funciona inteiramente sem internet. Nenhum dado sai do seu dispositivo.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-secondary/5 border border-secondary/10">
              <span className="text-lg shrink-0">🔐</span>
              <div>
                <p className="text-xs font-extrabold text-foreground">Dados confidenciais</p>
                <p className="text-[11px] text-muted-foreground">Fotos, registros e informacoes do bebe ficam armazenados apenas neste dispositivo.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-accent/5 border border-accent/10">
              <span className="text-lg shrink-0">🚫</span>
              <div>
                <p className="text-xs font-extrabold text-foreground">Sem compartilhamento</p>
                <p className="text-[11px] text-muted-foreground">Nao coletamos, enviamos ou compartilhamos nenhuma informacao com terceiros.</p>
              </div>
            </div>
          </div>

          <button onClick={() => setOpen(false)} className="btn-3d btn-3d-primary w-full text-sm py-3.5">
            Entendi!
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
