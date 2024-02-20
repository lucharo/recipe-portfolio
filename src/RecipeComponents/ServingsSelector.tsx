import React, { useState, useCallback } from 'react';
import { Button, ButtonGroup } from '@mui/material';

type ServingsSelectorProps = {
  currentServings: number;
  setServings: (servings: number) => void;
  ingredients: any[];
  setIngredients: (ingredients: any[]) => void;
  originalIngredients: any[];
  originalServings: number;
};

const ServingsSelector: React.FC<ServingsSelectorProps> = ({
  currentServings,
  setServings,
  ingredients,
  setIngredients,
  originalIngredients,
  originalServings
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const multiplierButtons = ["1x", "2x", "3x", "5x", "8x"];

  const handleMultiply = useCallback(
    (num: number) => {
      const newIngredients = originalIngredients.map(ingredient => {
        const newQuantity = ingredient.quantity * num;
        return { ...ingredient, quantity: newQuantity };
      });

      const newServings = num * originalServings;
      setIngredients(newIngredients);
      setServings(newServings);
    },
    [originalServings, originalIngredients, setIngredients, setServings],
  );

  const handleClick = (index: number) => {
    setSelectedIndex(index);
    const multiplier = +multiplierButtons[index].replace("x", "");
    handleMultiply(multiplier);
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
