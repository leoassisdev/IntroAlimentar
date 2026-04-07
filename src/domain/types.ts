export type Gender = 'male' | 'female' | 'other';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type FoodCategory = 'fruit' | 'vegetable' | 'legume' | 'protein' | 'grain' | 'allergenic';

export type Acceptance = 'accepted' | 'partial' | 'rejected';

export interface BabyProfile {
  id: string;
  name: string;
  birthDate: string;
  gender: Gender;
  photoDataUrl?: string;
  createdAt: string;
}

export interface FoodOffer {
  id: string;
  foodName: string;
  category: FoodCategory;
  mealType: MealType;
  cutStyle: string;
  method: string;
  acceptance: Acceptance;
  note?: string;
  offeredAt: string;
}

export interface DailyLog {
  id: string;
  date: string; // YYYY-MM-DD
  milkMl: number;
  waterMl: number;
  offers: FoodOffer[];
  notes?: string;
}

export interface AllergenicTrial {
  id: string;
  allergen: string;
  offerDate: string;
  offerIndex: 1 | 2 | 3 | 4 | 5;
  reactionObserved: boolean;
  reactionNotes?: string;
}

export interface AppData {
  babies: BabyProfile[];
  activeBabyId: string | null;
  logsByBaby: Record<string, DailyLog[]>;
  allergenicByBaby: Record<string, AllergenicTrial[]>;
  updatedAt: string;
}
