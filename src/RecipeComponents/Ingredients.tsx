import React from 'react';
import clsx from 'clsx';

interface IngredientsProps {
  currentIngredients: {
    name: string;
    quantity: number;
    unit: string;
    steps: number[];
  }[];
  currentStep: number;
  playMode: boolean
}

const Ingredients: React.FC<IngredientsProps> = ({ currentIngredients, currentStep, playMode }) => {
  return (
    <div className="column ingredients">
      <h3>Ingredients</h3>
      <ul>
        {currentIngredients.map((ingredient, index) => {
          const isCurrentStep = ingredient.steps.includes(currentStep); // Check if currentStep is in the steps array
          return (
            <div
              key={index}
              className={clsx({
                'current-step': playMode && isCurrentStep,
                'faded-step': playMode && !isCurrentStep,
              })}
              style={
                playMode
                  ? {
                    fontWeight: playMode && isCurrentStep ? 'bold' : 'normal',
                    opacity: playMode && isCurrentStep ? 1 : 0.5,
                  }
                  : {
                    fontWeight: 'normal',
                    opacity: 1,
                  }
              }
            >
              {ingredient.quantity} {ingredient.unit} {ingredient.name}
            </div>
          );
        })}
      </ul>
    </div>
  );
};

export default Ingredients;
