import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ProfilePhoto } from "@/components/PhotoUpload";
import { bebeStore } from "@/data/store";
import { generateId } from "@/utils/helpers";
import { toast } from "sonner";
import { showPrivacyPopup } from "@/components/PrivacyPopup";

const CadastrarBebe = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [genero, setGenero] = useState<"masculino" | "feminino" | "outro">("feminino");
  const [foto, setFoto] = useState<string | undefined>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nome.length < 2) { toast.error("Nome deve ter pelo menos 2 caracteres"); return; }
    if (!dataNascimento || new Date(dataNascimento) > new Date()) { toast.error("Data de nascimento inválida"); return; }

    const now = new Date().toISOString();
    bebeStore.create({ id: generateId(), nome, data_nascimento: dataNascimento, genero, foto, ativo: true, created_at: now, updated_at: now });
    showPrivacyPopup();
    toast.success(`${nome} cadastrado(a) com sucesso! 🎉`);
    navigate("/");
  };

  const generos = [
    { value: "feminino" as const, emoji: "👧", label: "Menina", activeColor: "border-primary bg-pink-light" },
    { value: "masculino" as const, emoji: "👦", label: "Menino", activeColor: "border-accent bg-blue-light" },
    { value: "outro" as const, emoji: "👶", label: "Outro", activeColor: "border-yellow bg-yellow-light" },
  ];

  return (
    <div className="min-h-screen gradient-bg">
      <div className="paint-blob-yellow" />
      <div className="paint-blob-purple" />

      <header className="relative bg-gradient-to-br from-secondary to-secondary/80 pb-10 overflow-hidden">
        <div className="absolute top-6 right-12 w-16 h-16 rounded-full bg-yellow/25 animate-float" />
        <div className="sparkle top-4 left-[30%] text-white/40" style={{ animationDelay: "0.8s" }}>✦</div>

        <div className="max-w-2xl mx-auto px-4 pt-4 pb-6 relative z-10">
          <div className="flex items-center gap-3">
            <button className="btn-3d text-xs py-2 px-3" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-xl font-extrabold text-white drop-shadow-sm">Cadastrar Bebê 🍼</h1>
          </div>
        </div>
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path d="M0,35 C300,70 600,15 900,45 C1100,60 1300,30 1440,40 L1440,60 L0,60 Z" fill="hsl(40 50% 97%)" />
        </svg>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 relative z-10">
        <Card className="rounded-[1.8rem] border-2 border-secondary/20 shadow-xl shadow-secondary/10 overflow-hidden animate-pop-in">
          <div className="h-2 bg-gradient-to-r from-secondary via-accent to-primary" />
          <CardContent className="p-6">
            <div className="flex flex-col items-center mb-6">
              <ProfilePhoto foto={foto} onPhotoChange={setFoto} genero={genero} size={100} />
              <p className="text-xs text-muted-foreground font-semibold mt-3">Toque para adicionar uma foto 📸</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nome" className="font-extrabold text-foreground text-sm">Nome do bebê</Label>
                <Input id="nome" placeholder="Ex: Maria, João..." value={nome} onChange={(e) => setNome(e.target.value)} className="rounded-[1.2rem] h-13 border-2 border-border focus:border-secondary text-base font-semibold" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nascimento" className="font-extrabold text-foreground text-sm">Data de Nascimento 📅</Label>
                <Input id="nascimento" type="date" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} className="rounded-[1.2rem] h-13 border-2 border-border focus:border-secondary text-base font-semibold" required />
              </div>

              <div className="space-y-3">
                <Label className="font-extrabold text-foreground text-sm">Gênero</Label>
                <div className="grid grid-cols-3 gap-3">
                  {generos.map((g) => (
                    <button
                      key={g.value}
                      type="button"
                      onClick={() => setGenero(g.value)}
                      className={`p-4 rounded-[1.2rem] border-2 transition-all text-center bounce-tap ${
                        genero === g.value ? `${g.activeColor} scale-105 shadow-lg` : "border-border hover:border-primary/30 bg-card"
                      }`}
                    >
                      <span className={`text-3xl block mb-1 ${genero === g.value ? "animate-wiggle" : ""}`}>{g.emoji}</span>
                      <span className="text-sm font-extrabold">{g.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn-3d btn-3d-primary w-full text-base py-4">
                Cadastrar 🎉
              </button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CadastrarBebe;
