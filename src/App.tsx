import React, { useState } from "react";
import RecipeMultiplier from "./RecipeMultiplier";

import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

import "./styles.css";

import recipeDB from "./recipes.json";
import { useParams } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import TopBar from "./TopBar";
import { useThemeContext } from "./ThemeContext";

const App = () => {
  const [theme, toggleTheme] = useThemeContext(); // Add this line
  const themeConfig = createTheme({
    palette: {
      mode: theme === 'dark' ? 'dark' : 'light',
    },
  });

  const { recipeId } = useParams();
  const recipe = recipeDB.recipes.find((r) => r.name === recipeId);

  const [currentIngredients, setIngredients] = useState<string[]>(recipe?.ingredients || []);
  const [currentServings, setServings] = useState<number>(recipe?.servings || 0);
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!recipe) {
    return <NotFound />;
  }

  const handleMultiply = (num: number) => {
    const recipeMultiplier = new RecipeMultiplier(currentServings);
    const newIngredients = recipeMultiplier.multiplyIngredients(num, recipe.ingredients);
    const newServings = num * recipe.servings;
    setIngredients(newIngredients);
    setServings(newServings);
  };

  const buttons = ["1x", "2x", "3x", "4x", "5x", "8x"];
  const handleClick = (index: number) => {
    setSelectedIndex(index);
    const multiplier = +buttons[index].replace("x", "");
    handleMultiply(multiplier);
  };

  // return (
  //   <div className="content">
  //     <div>
  //       <h1>
  //         {recipe.name} [modified from <a href={recipe.source}>source</a>]
  //       </h1>
  //       <h2>
  //         Servings: {currentServings} &ensp;
  //         <ButtonGroup variant="outlined" aria-label="outlined primary button group">
  //           {buttons.map((button, index) => (
  //             <Button
  //               key={button}
  //               variant={selectedIndex === index ? "contained" : "outlined"}
  //               onClick={() => handleClick(index)}
  //             >
  //               {button}
  //             </Button>
  //           ))}
  //         </ButtonGroup>
  //       </h2>
  //     </div>

  //     <div className="column ingredients">
  //       <h3>Ingredients</h3>
  //       <ul>
  //         {currentIngredients.map((ingredient, index) => (
  //           <li key={index}>{ingredient}</li>
  //         ))}
  //       </ul>
  //     </div>

  //     <div className="column methods">
  //       <h3>Methods</h3>
  //       <ol>
  //         {recipe.methods.map((step, index) => (
  //           <li key={index}>{step}</li>
  //         ))}
  //       </ol>
  //     </div>
  //   </div>
  // );

  return (
    <ThemeProvider theme={themeConfig}>
      <CssBaseline />
      <TopBar />
      <main>
        <h1>{recipe.name}</h1>
        {/* <p>{recipe.description}</p> */}
        <h2>Ingredients</h2>
        <ul>
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
        <h2>Instructions</h2>
        <ol>
          {recipe.methods.map((instruction, index) => (
            <li key={index}>{instruction}</li>
          ))}
        </ol>
      </main>
    </ThemeProvider>
  );
};

const NotFound = () => {
  return <div>Recipe not found</div>;
};

export default App;
