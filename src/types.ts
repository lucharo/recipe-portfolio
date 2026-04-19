export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  steps: number[];
}

export interface Recipe {
  name: string;
  source: string;
  image: string | null;
  servings: number;
  ingredients: Ingredient[];
  methods: string[];
  notes?: string[];
  creator?: string | null;
  deleted?: boolean;
}

export interface RecipeDB {
  recipes: Recipe[];
}

export type CardStyle = "simple" | "polaroid" | "list";
export type Accent = "persimmon" | "mustard" | "forest" | "plum";
export type Theme = "light" | "dark";

export interface AppState {
  route: "gallery" | "recipe";
  slug: string | null;
  cardStyle: CardStyle;
  accent: Accent;
  theme: Theme;
}
