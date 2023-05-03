import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";

import RecipeHeader from './RecipeComponents/RecipeHeader';
import ServingsSelector from './RecipeComponents/ServingsSelector';
import Ingredients from './RecipeComponents/Ingredients';
import Methods from './RecipeComponents/Methods';

import "./styles.css";

import recipeDB from "./recipes.json";
import { useParams } from "react-router-dom";
import { Container, CssBaseline, Stack, ThemeProvider, Typography } from "@mui/material";
import TopBar from "./TopBar";
import { useThemeContext, themeLight, themeDark } from "./ThemeContext";

const Recipe = () => {
  const [theme, toggleTheme] = useThemeContext();
  const [playMode, setPlayMode] = useState(false);
  const playModeRef = useRef(playMode);
  const [currentSlide, setCurrentSlide] = useState(0);

  const { recipeId } = useParams();
  const recipe = useMemo(() => recipeDB.recipes.find((r) => r.name === recipeId), [recipeId]);

  const [currentIngredients, setIngredients] = useState<{ 
    name: string; 
    quantity: number; 
    unit: string;
    steps: number[];
  }[]>(
    recipe?.ingredients || []
  );
  const [currentServings, setServings] = useState<number>(recipe?.servings || 0);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleSpacebar = useCallback(
    (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        if (playModeRef.current) {
          changeSlide();
        }
      }
    },
    [currentSlide, recipe?.methods.length]
  );
  
  
  // Add an event listener for the spacebar event
  useEffect(() => {
    window.addEventListener("keydown", handleSpacebar);
    return () => {
      window.removeEventListener("keydown", handleSpacebar);
    };
  }, [handleSpacebar]);
  

  useEffect(() => {
    if (recipe && currentSlide === recipe.methods.length) {
      setPlayMode(false);
      setCurrentSlide(0)
    }
  }, [currentSlide, recipe]);
  
  useEffect(() => {
    playModeRef.current = playMode;
  }, [playMode]);  

  // Create a function to handle the spacebar event
  const changeSlide = () => {
    if (recipe) {
      setCurrentSlide((prevSlide) => {
        let nextSlide = prevSlide + 1;
        if (nextSlide > recipe.methods.length) {
          return 0;
        }
        return nextSlide;
      });
    }
  };
  
  
  const handlePlayClick = () => {
    setPlayMode(!playMode);
  };

  if (!recipe) {
    return <NotFound />;
  }

  return (
    <ThemeProvider theme={theme === 'dark' ? themeDark : themeLight}>
      <CssBaseline />
      <TopBar theme={theme} toggleTheme={toggleTheme} />
      <main>
        <div className="recipe-wrapper">
          <Container maxWidth="md">
          <RecipeHeader recipeName={recipe.name} recipeSource={recipe.source} />
          <ServingsSelector
            currentServings={currentServings}
            setServings={setServings}
            ingredients={recipe.ingredients}
            setIngredients={setIngredients}
          />
          </Container>

          <div className="recipe-container">
            <Container maxWidth="lg">
            <Stack direction={{ xs: "column", sm: "row" }} spacing={4}>
            <Ingredients currentIngredients={currentIngredients} currentStep={currentSlide + 1} playMode={playMode} />
            <Methods recipe={recipe} playMode={playMode} handlePlayClick={handlePlayClick} currentSlide={currentSlide} />
            </Stack>
            </Container>
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