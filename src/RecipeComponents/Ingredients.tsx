import React from 'react';

interface IngredientsProps {
  currentIngredients: string[];
}

const Ingredients: React.FC<IngredientsProps> = ({ currentIngredients }) => (
  <div className="column ingredients">
    <h3>Ingredients</h3>
    <ul>
      {currentIngredients.map((ingredient, index) => (
        <li key={index}>{ingredient}</li>
      ))}
    </ul>
  </div>
);

export default Ingredients;
