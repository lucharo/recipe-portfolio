import React, { useState } from 'react';
import { TextField, Grid, Typography } from '@mui/material';

import recipeDB from './recipes.json'
const recipes = recipeDB.recipes;

interface Recipe {
  name: string;
  ingredients: string[];
}

const SearchBar: React.FC<any> = () => {
  const [query, setQuery] = useState<string>('');
  const [filteredRecipes, setFilteredRecipes] = useState<any[]>([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = event.target.value.toLowerCase();
    const filtered = recipes.filter((recipe) => {
      const title = recipe.name.toLowerCase();
      const ingredients = recipe.ingredients.join(',').toLowerCase();
      
      return title.includes(searchQuery) || ingredients.includes(searchQuery);
    });
    setQuery(searchQuery);
    setFilteredRecipes(filtered);
  };

  return (
    <div className="search-bar">
      <TextField
        placeholder="Search recipes"
        value={query}
        onInput={handleInputChange}
        onClick={(event) => {
            const input = event.currentTarget.querySelector('input');
            input?.select();
          }}
        variant="outlined"
        fullWidth
      />
      {filteredRecipes.length > 0 && (
        <Grid container spacing={1} className="search-results">
          {filteredRecipes.map((recipe) => (
            <Grid item xs={12} key={recipe.id}>
              <Typography variant="h6">{recipe.name}</Typography>
              <Typography variant="body2">{recipe.ingredients.map((i: { quantity: number; unit: string; name: string }) => `${i.quantity} ${i.unit} ${i.name}`).join(', ')}</Typography>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default SearchBar;
