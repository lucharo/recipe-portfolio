import React, { useState } from "react";
import RecipeMultiplier from "./RecipeMultiplier";

import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

import "./styles.css";

import recipeDB from "./recipes.json";
import { useParams } from "react-router-dom";
import { Container, CssBaseline, Stack, ThemeProvider, Typography } from "@mui/material";
import TopBar from "./TopBar";
import { useThemeContext, themeLight, themeDark } from "./ThemeContext";

const Recipe = () => {
  const [theme, toggleTheme] = useThemeContext();

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

  return (
    <ThemeProvider theme={theme === 'dark' ? themeDark : themeLight}>
      <CssBaseline />
      <TopBar theme={theme} toggleTheme={toggleTheme} />
      <main>
        <div className="recipe-wrapper">
          <Container maxWidth="md">
            <Typography
              gutterBottom
              color="inherit"
              variant="h3">
              {recipe.name} [modified from <a href={recipe.source}>source</a>]
            </Typography>
            <h2>
              Servings: {currentServings} &ensp;
              <ButtonGroup variant="outlined" aria-label="outlined primary button group">
                {buttons.map((button, index) => (
                  <Button
                    key={button}
                    variant={selectedIndex === index ? "contained" : "outlined"}
                    onClick={() => handleClick(index)}
                  >
                    {button}
                  </Button>
                ))}
              </ButtonGroup>
            </h2>
          </Container>

          <div className="recipe-container">
            <Stack direction={{ xs: "column", sm: "row" }} spacing={4}>

              <div className="column ingredients">
                <h3>Ingredients</h3>
                <ul>
                  {currentIngredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>

              <div className="column methods">
                <h3>Methods</h3>
                <ol>
                  {recipe.methods.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
                {recipe.notes && (
                  <>
                    <h3>Notes</h3>
                    <ol>
                      {recipe.notes.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </>
                )}
              </div>
            </Stack>

          </div>
        </div>

      </main>
    </ThemeProvider >
  );
};

const NotFound = () => {
  return <div>Recipe not found</div>;
};

export default Recipe;
