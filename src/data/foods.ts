import { CategoriaAlimento } from "@/types";

interface FoodItem {
  nome: string;
  cortes: string[];
  alergenico: boolean;
  variantes?: string[];
}

export const FOOD_DATABASE: Record<CategoriaAlimento, FoodItem[]> = {
  frutas: [
    { nome: "Banana", cortes: ["Amassada", "Palito", "Rodela", "Inteira sem casca"], alergenico: false, variantes: ["prata", "nanica", "maçã"] },
    { nome: "Manga", cortes: ["Palito", "Fatia com casca", "Amassada", "Cubos"], alergenico: false },
    { nome: "Mamão", cortes: ["Amassado", "Palito", "Cubos", "Raspado"], alergenico: false },
    { nome: "Abacate", cortes: ["Amassado", "Palito", "Fatia"], alergenico: false },
    { nome: "Pera", cortes: ["Palito cozido", "Amassada", "Fatia fina"], alergenico: false },
    { nome: "Maçã", cortes: ["Cozida amassada", "Palito cozido", "Raspada"], alergenico: false },
    { nome: "Melão", cortes: ["Palito", "Fatia fina", "Cubos"], alergenico: false },
    { nome: "Melancia", cortes: ["Palito sem sementes", "Fatia"], alergenico: false },
    { nome: "Uva", cortes: ["Cortada ao meio no comprido", "Amassada"], alergenico: false },
    { nome: "Morango", cortes: ["Cortado ao meio", "Amassado"], alergenico: true },
    { nome: "Kiwi", cortes: ["Fatia fina", "Amassado", "Palito"], alergenico: true },
    { nome: "Goiaba", cortes: ["Amassada sem sementes", "Palito cozido"], alergenico: false },
    { nome: "Laranja", cortes: ["Gomo sem película", "Espremida"], alergenico: false },
  ],
  vegetais_folhosos: [
    { nome: "Brócolis", cortes: ["Buquê cozido", "Amassado", "Floretes no vapor"], alergenico: false },
    { nome: "Couve", cortes: ["Refogada picada fina", "No caldo", "Chips assada"], alergenico: false },
    { nome: "Espinafre", cortes: ["Refogado", "No caldo", "Com arroz"], alergenico: false },
    { nome: "Couve-flor", cortes: ["Buquê cozido", "Amassada", "Purê"], alergenico: false },
    { nome: "Alface", cortes: ["Picada fina", "Folha inteira"], alergenico: false },
    { nome: "Rúcula", cortes: ["Picada fina", "No caldo"], alergenico: false },
    { nome: "Repolho", cortes: ["Refogado picado"], alergenico: false },
    { nome: "Agrião", cortes: ["Refogado", "No caldo"], alergenico: false },
  ],
  legumes: [
    { nome: "Cenoura", cortes: ["Palito cozido", "Ralada cozida", "Rodela cozida"], alergenico: false },
    { nome: "Batata-doce", cortes: ["Palito cozido", "Purê", "Amassada"], alergenico: false },
    { nome: "Abóbora", cortes: ["Palito cozido", "Purê", "Amassada"], alergenico: false },
    { nome: "Abobrinha", cortes: ["Palito cozido", "Rodela", "Meia lua"], alergenico: false },
    { nome: "Chuchu", cortes: ["Palito cozido", "Amassado"], alergenico: false },
    { nome: "Beterraba", cortes: ["Palito cozido", "Ralada cozida"], alergenico: false },
    { nome: "Inhame", cortes: ["Cozido amassado", "Palito", "Purê"], alergenico: false },
    { nome: "Mandioca", cortes: ["Palito cozido", "Purê"], alergenico: false },
    { nome: "Tomate", cortes: ["Sem pele e semente", "Cubos"], alergenico: false },
    { nome: "Vagem", cortes: ["Cozida inteira", "Picada cozida"], alergenico: false },
  ],
  proteinas: [
    { nome: "Carne bovina", cortes: ["Desfiada", "Moída", "Tira cozida"], alergenico: false, variantes: ["acém", "alcatra", "patinho"] },
    { nome: "Frango", cortes: ["Desfiado", "Moído", "Tira cozida"], alergenico: false },
    { nome: "Ovo", cortes: ["Cozido em tiras", "Mexido", "Omelete palito"], alergenico: true },
    { nome: "Peixe", cortes: ["Desfiado", "Assado em lascas"], alergenico: true, variantes: ["tilápia", "pescada", "salmão"] },
    { nome: "Fígado", cortes: ["Moído refogado", "Patê caseiro"], alergenico: false },
  ],
  cereais: [
    { nome: "Arroz", cortes: ["Cozido", "Bolinho", "Papa"], alergenico: false },
    { nome: "Aveia", cortes: ["Mingau", "Com fruta", "Panqueca"], alergenico: false },
    { nome: "Macarrão", cortes: ["Parafuso cozido", "Espaguete cortado"], alergenico: false },
    { nome: "Tapioca", cortes: ["Crepe fino", "Bolinha"], alergenico: false },
    { nome: "Cuscuz", cortes: ["Amassado", "Com legumes"], alergenico: false },
  ],
  leguminosas: [
    { nome: "Feijão", cortes: ["Amassado", "Caldo", "Inteiro cozido"], alergenico: false, variantes: ["carioca", "preto", "branco"] },
    { nome: "Lentilha", cortes: ["Cozida amassada", "Caldo"], alergenico: false },
    { nome: "Grão-de-bico", cortes: ["Amassado", "Homus caseiro"], alergenico: false },
    { nome: "Ervilha", cortes: ["Amassada", "Inteira cozida"], alergenico: false },
  ],
  leite: [],
  agua: [],
};
