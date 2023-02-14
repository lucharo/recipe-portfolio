// App.tsx
import React, { useState } from "react";
import RecipeMultiplier from "./RecipeMultiplier";

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

import "./styles.css"

import recipeDB from './recipes.json';

const data = recipeDB.recipes[0]


const App = () => {
  // const originalIngredients = [
  //   "1 cup flour",
  //   "1 tsp salt",
  //   "1 tbsp sugar",
  //   "1/2 cup milk"
  // ]
  const originalIngredients = data.ingredients;
  const originalServings = data.servings;
  const steps = data.methods;
  const [currentIngredients, setIngredients] = useState<string[]>(originalIngredients);
  const [currentServings, setServings] = useState<number>(originalServings);  

  const handleMultiply = (num: number) => {
    const recipeMultiplier = new RecipeMultiplier(currentServings);
    const newIngredients = recipeMultiplier.multiplyIngredients(num, originalIngredients);
    const newServings = num*originalServings;
    setIngredients(newIngredients);
    setServings(newServings);
  };

  const [selectedIndex, setSelectedIndex] = useState(0);
  const buttons = ['1x', '2x', '3x', '4x', '5x', '8x'];
  const handleClick = (index: number) => {
    setSelectedIndex(index);
    const multiplier = +buttons[index].replace('x', '');
    handleMultiply(multiplier)
  };

  return (
    <div className="content">
    <div>
      <h1>{data.name} [modified from <a href={data.source}>source</a>]</h1>
      <h2>Servings: {currentServings} &ensp;
      <ButtonGroup variant="outlined" aria-label="outlined primary button group">
        {buttons.map((button, index) => (
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
          {steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </div>

    </div>
  );
};

export default App;

// import * as React from 'react';
// import Button from '@mui/material/Button';

// export default function App() {
//   return (
//     <div>
//       <Button variant="contained">Hello World</Button>
//     </div>
//   );
// }
