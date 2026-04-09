export interface Bebe {
  id: string;
  nome: string;
  data_nascimento: string;
  genero: "masculino" | "feminino" | "outro";
  foto?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface ItemAlimento {
  nome: string;
  categoria: CategoriaAlimento;
  tipo_corte?: string;
  aceitacao?: number;
  alergenico: boolean;
  novidade?: boolean;
}

export interface RegistroAlimentar {
  id: string;
  bebe_id: string;
  data: string;
  tipo_refeicao: TipoRefeicao;
  categoria: CategoriaAlimento;
  nome_alimento: string;
  tipo_corte?: string;
  aceitacao?: number;
  notas?: string;
  quantidade?: number;
  unidade?: "ml" | "min" | "g" | "porcao";
  alimento_alergenico: boolean;
  alimentos?: ItemAlimento[];
  fotos?: string[];
  created_at: string;
}

export interface RegistroAlergenico {
  id: string;
  bebe_id: string;
  nome_alimento: string;
  numero_oferta: number;
  data_oferta: string;
  teve_reacao: boolean;
  sintomas: string[];
  notas?: string;
  created_at: string;
}

export type TipoRefeicao = "cafe_manha" | "almoco" | "lanche_tarde" | "jantar" | "ceia" | "mamada" | "agua";
export type CategoriaAlimento = "frutas" | "vegetais_folhosos" | "legumes" | "proteinas" | "cereais" | "leguminosas" | "leite" | "agua";

export const TIPO_REFEICAO_LABELS: Record<TipoRefeicao, string> = {
  cafe_manha: "☀️ Café da Manhã",
  almoco: "🍽️ Almoço",
  lanche_tarde: "🍌 Lanche da Tarde",
  jantar: "🌙 Jantar",
  ceia: "🌛 Ceia",
  mamada: "🍼 Mamada",
  agua: "💧 Água",
};

export const CATEGORIA_LABELS: Record<CategoriaAlimento, string> = {
  frutas: "🍎 Frutas",
  vegetais_folhosos: "🥬 Folhosos",
  legumes: "🥕 Legumes",
  proteinas: "🥩 Proteínas",
  cereais: "🌾 Cereais",
  leguminosas: "🫘 Leguminosas",
  leite: "🥛 Leite",
  agua: "💧 Água",
};

export const ALIMENTOS_ALERGENICOS = [
  "Ovos (clara e gema)",
  "Amendoim",
  "Castanhas",
  "Trigo",
  "Soja e derivados",
  "Peixe e frutos do mar",
  "Leite de vaca",
  "Kiwi",
  "Morango",
] as const;

export const SINTOMAS_ATENCAO = [
  "Vermelhidão ou surgimento de manchas na pele",
  "Coceira na região da boca",
  "Inchaço nos lábios ou no rosto",
  "Dificuldade para respirar (EMERGÊNCIA)",
  "Vômito",
  "Diarreia",
  "Irritabilidade / choro intenso",
] as const;
