import type { Bebe, RegistroAlimentar, RegistroAlergenico } from "@/types";

const BEBES_KEY = "introalimentar_bebes";
const REGISTROS_KEY = "introalimentar_registros";
const ALERGENICOS_KEY = "introalimentar_alergenicos";

function load<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function save<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export const bebeStore = {
  list: (): Bebe[] => load<Bebe>(BEBES_KEY).filter((b) => b.ativo),
  getById: (id: string): Bebe | undefined => load<Bebe>(BEBES_KEY).find((b) => b.id === id),
  create: (bebe: Bebe): void => {
    const all = load<Bebe>(BEBES_KEY);
    all.push(bebe);
    save(BEBES_KEY, all);
  },
  update: (id: string, data: Partial<Bebe>): void => {
    const all = load<Bebe>(BEBES_KEY);
    const idx = all.findIndex((b) => b.id === id);
    if (idx >= 0) {
      all[idx] = { ...all[idx], ...data, updated_at: new Date().toISOString() };
      save(BEBES_KEY, all);
    }
  },
  delete: (id: string): void => {
    const all = load<Bebe>(BEBES_KEY);
    const idx = all.findIndex((b) => b.id === id);
    if (idx >= 0) {
      all[idx].ativo = false;
      save(BEBES_KEY, all);
    }
  },
};

export const registroStore = {
  listByBebe: (bebeId: string): RegistroAlimentar[] =>
    load<RegistroAlimentar>(REGISTROS_KEY)
      .filter((r) => r.bebe_id === bebeId)
      .sort((a, b) => b.data.localeCompare(a.data)),
  listByDate: (bebeId: string, data: string): RegistroAlimentar[] =>
    load<RegistroAlimentar>(REGISTROS_KEY).filter((r) => r.bebe_id === bebeId && r.data === data),
  create: (registro: RegistroAlimentar): void => {
    const all = load<RegistroAlimentar>(REGISTROS_KEY);
    all.push(registro);
    save(REGISTROS_KEY, all);
  },
  update: (id: string, data: Partial<RegistroAlimentar>): void => {
    const all = load<RegistroAlimentar>(REGISTROS_KEY);
    const idx = all.findIndex((r) => r.id === id);
    if (idx >= 0) {
      all[idx] = { ...all[idx], ...data };
      save(REGISTROS_KEY, all);
    }
  },
  delete: (id: string): void => {
    const all = load<RegistroAlimentar>(REGISTROS_KEY).filter((r) => r.id !== id);
    save(REGISTROS_KEY, all);
  },
};

export const alergenicoStore = {
  listByBebe: (bebeId: string): RegistroAlergenico[] =>
    load<RegistroAlergenico>(ALERGENICOS_KEY)
      .filter((r) => r.bebe_id === bebeId)
      .sort((a, b) => a.data_oferta.localeCompare(b.data_oferta)),
  listByAlimento: (bebeId: string, alimento: string): RegistroAlergenico[] =>
    load<RegistroAlergenico>(ALERGENICOS_KEY).filter(
      (r) => r.bebe_id === bebeId && r.nome_alimento === alimento
    ),
  create: (registro: RegistroAlergenico): void => {
    const all = load<RegistroAlergenico>(ALERGENICOS_KEY);
    all.push(registro);
    save(ALERGENICOS_KEY, all);
  },
};
