import React, { useState, useCallback } from 'react';
import { Button, ButtonGroup } from '@mui/material';
import RecipeMultiplier from '../RecipeMultiplier';

type ServingsSelectorProps = {
  currentServings: number;
  setServings: (servings: number) => void;
  ingredients: any[];
  setIngredients: (ingredients: any[]) => void;
};

const ServingsSelector: React.FC<ServingsSelectorProps> = ({ currentServings, setServings, ingredients, setIngredients }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const multiplierButtons = ["1x", "2x", "3x", "5x", "8x"];

  const handleMultiply = useCallback(
    (num: number) => {
      const recipeMultiplier = new RecipeMultiplier(currentServings);
      const newIngredients = recipeMultiplier.multiplyIngredients(num, ingredients);
      const newServings = num * currentServings;
      setIngredients(newIngredients);
      setServings(newServings)
    },
    [currentServings, ingredients, setIngredients],
  );

  const handleClick = (index: number) => {
    setSelectedIndex(index);
    const multiplier = +multiplierButtons[index].replace("x", "");
    handleMultiply(multiplier)
  };

  return (
    <div>
      <h2>
        Servings: {currentServings} &ensp;
        <ButtonGroup variant="outlined" aria-label="outlined primary button group">
          {multiplierButtons.map((button, index) => (
            <Button
              key={button}
              variant={selectedIndex === index ? 'contained' : 'outlined'}
              onClick={() => handleClick(index)}
            >
              {button}
            </Button>
          ))}
        </ButtonGroup>
      </h2>
    </div>
  );
};

export default ServingsSelector;
