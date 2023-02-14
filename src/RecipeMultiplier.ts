// RecipeMultiplier.ts
class RecipeMultiplier {
    private originalServings: number;
  
    constructor(originalServings: number) {
      this.originalServings = originalServings;
    }
  
    public multiplyIngredients(num: number, ingredients: string[]): string[] {
      return ingredients.map(ingredient => {
        const amount = ingredient.split(" ")[0];
        const rest = ingredient.split(" ").slice(1).join(" ");
        const newAmount = (parseFloat(amount) * num);
        return `${newAmount} ${rest}`;
      });
    }
  }
  
  // Usage
  // const ingredients = [
  //   "1 cup flour",
  //   "1 tsp salt",
  //   "1 tbsp sugar",
  //   "1/2 cup milk"
  // ];
  
  // const recipeMultiplier = new RecipeMultiplier(4, 6);
  // const newIngredients = recipeMultiplier.multiplyIngredients(ingredients);
  // console.log(newIngredients);

export default RecipeMultiplier;
