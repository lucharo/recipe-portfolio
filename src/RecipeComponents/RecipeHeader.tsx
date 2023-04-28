import React from 'react';
import { Typography } from '@mui/material';

type RecipeHeaderProps = {
  recipeName: string;
  recipeSource: string;
};

const RecipeHeader: React.FC<RecipeHeaderProps> = ({ recipeName, recipeSource }) => {
  return (
    <Typography gutterBottom color="inherit" variant="h3">
      {recipeName} [modified from <a href={recipeSource}>source</a>]
    </Typography>
  );
};

export default RecipeHeader;
