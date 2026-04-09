import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TipsTicker } from "./components/TipsTicker";
import { PrivacyPopup } from "./components/PrivacyPopup";
import Index from "./pages/Index";
import CadastrarBebe from "./pages/CadastrarBebe";
import BebePage from "./pages/BebePage";
import NovoRegistro from "./pages/NovoRegistro";
import AlergenicoPage from "./pages/AlergenicoPage";
import RelatorioPage from "./pages/RelatorioPage";
import AlimentosPage from "./pages/AlimentosPage";
import EmergenciaPage from "./pages/EmergenciaPage";
import SegurancaAlimentarPage from "./pages/SegurancaAlimentarPage";
import SugestaoPage from "./pages/SugestaoPage";
import MarcosPage from "./pages/MarcosPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/cadastrar-bebe" element={<CadastrarBebe />} />
          <Route path="/bebe/:id" element={<BebePage />} />
          <Route path="/bebe/:id/novo-registro" element={<NovoRegistro />} />
          <Route path="/bebe/:id/alergenicos" element={<AlergenicoPage />} />
          <Route path="/bebe/:id/relatorio" element={<RelatorioPage />} />
          <Route path="/bebe/:id/sugestoes" element={<SugestaoPage />} />
          <Route path="/bebe/:id/recordacoes" element={<MarcosPage />} />
          <Route path="/bebe/:id/seguranca" element={<SegurancaAlimentarPage />} />
          <Route path="/alimentos" element={<AlimentosPage />} />
          <Route path="/emergencia" element={<EmergenciaPage />} />
          <Route path="/seguranca" element={<SegurancaAlimentarPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <TipsTicker />
        <PrivacyPopup />
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
