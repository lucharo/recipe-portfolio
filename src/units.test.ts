import recipeDB from "./recipes.json";

// Metric only: cups, oz, lb and friends should be converted to g or ml.
const BANNED = /^(cups?|oz|ounces?|lbs?|pounds?|teaspoons?|tablespoons?|tbsps|tsps|pints?|quarts?|gallons?|fl oz)$/i;

describe("recipe units", () => {
  it.each(recipeDB.recipes.map((r) => [r.name, r] as const))(
    "%s uses metric units",
    (_name, recipe) => {
      const bad = recipe.ingredients
        .filter((i) => BANNED.test(i.unit ?? ""))
        .map((i) => `${i.quantity} ${i.unit} ${i.name}`);
      expect(bad).toEqual([]);
    }
  );
});
