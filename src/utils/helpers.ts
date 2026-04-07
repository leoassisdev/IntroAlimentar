export function idadeEmMeses(dataNascimento: string): number {
  const nascimento = new Date(dataNascimento);
  const hoje = new Date();
  return (hoje.getFullYear() - nascimento.getFullYear()) * 12 + (hoje.getMonth() - nascimento.getMonth());
}

export function faseAlimentar(dataNascimento: string): { fase: string; descricao: string } {
  const idade = idadeEmMeses(dataNascimento);
  if (idade < 6) return { fase: "Antes da introdução", descricao: "Aleitamento exclusivo" };
  if (idade <= 8) return { fase: "Início", descricao: "Palitos grossos, alimentos macios" };
  if (idade <= 9) return { fase: "Intermediário", descricao: "Pedaços menores, pinça" };
  if (idade <= 12) return { fase: "Avançado", descricao: "Cortes menores, tiras finas" };
  return { fase: "Família", descricao: "Alimento da família adaptado" };
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("pt-BR");
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function getSigno(dataNascimento: string): { signo: string; emoji: string; elemento: string; periodo: string } {
  const d = new Date(dataNascimento + "T12:00:00");
  const dia = d.getDate();
  const mes = d.getMonth() + 1;

  if ((mes === 3 && dia >= 21) || (mes === 4 && dia <= 19)) return { signo: "Áries", emoji: "♈", elemento: "Fogo 🔥", periodo: "21/03 – 19/04" };
  if ((mes === 4 && dia >= 20) || (mes === 5 && dia <= 20)) return { signo: "Touro", emoji: "♉", elemento: "Terra 🌍", periodo: "20/04 – 20/05" };
  if ((mes === 5 && dia >= 21) || (mes === 6 && dia <= 20)) return { signo: "Gêmeos", emoji: "♊", elemento: "Ar 💨", periodo: "21/05 – 20/06" };
  if ((mes === 6 && dia >= 21) || (mes === 7 && dia <= 22)) return { signo: "Câncer", emoji: "♋", elemento: "Água 💧", periodo: "21/06 – 22/07" };
  if ((mes === 7 && dia >= 23) || (mes === 8 && dia <= 22)) return { signo: "Leão", emoji: "♌", elemento: "Fogo 🔥", periodo: "23/07 – 22/08" };
  if ((mes === 8 && dia >= 23) || (mes === 9 && dia <= 22)) return { signo: "Virgem", emoji: "♍", elemento: "Terra 🌍", periodo: "23/08 – 22/09" };
  if ((mes === 9 && dia >= 23) || (mes === 10 && dia <= 22)) return { signo: "Libra", emoji: "♎", elemento: "Ar 💨", periodo: "23/09 – 22/10" };
  if ((mes === 10 && dia >= 23) || (mes === 11 && dia <= 21)) return { signo: "Escorpião", emoji: "♏", elemento: "Água 💧", periodo: "23/10 – 21/11" };
  if ((mes === 11 && dia >= 22) || (mes === 12 && dia <= 21)) return { signo: "Sagitário", emoji: "♐", elemento: "Fogo 🔥", periodo: "22/11 – 21/12" };
  if ((mes === 12 && dia >= 22) || (mes === 1 && dia <= 19)) return { signo: "Capricórnio", emoji: "♑", elemento: "Terra 🌍", periodo: "22/12 – 19/01" };
  if ((mes === 1 && dia >= 20) || (mes === 2 && dia <= 18)) return { signo: "Aquário", emoji: "♒", elemento: "Ar 💨", periodo: "20/01 – 18/02" };
  return { signo: "Peixes", emoji: "♓", elemento: "Água 💧", periodo: "19/02 – 20/03" };
}

export function getElementoChinês(dataNascimento: string): string {
  const ano = new Date(dataNascimento + "T12:00:00").getFullYear();
  const animais = ["Rato 🐀", "Boi 🐂", "Tigre 🐅", "Coelho 🐇", "Dragão 🐉", "Serpente 🐍", "Cavalo 🐴", "Cabra 🐐", "Macaco 🐒", "Galo 🐓", "Cão 🐕", "Porco 🐷"];
  return animais[(ano - 4) % 12];
}

export function diaDaSemana(dataNascimento: string): string {
  const dias = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
  return dias[new Date(dataNascimento + "T12:00:00").getDay()];
}
