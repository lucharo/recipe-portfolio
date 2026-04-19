const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const recipesYamlDir = path.join(__dirname, 'src', 'recipes');
const recipesJsonFile = path.join(__dirname, 'src', 'recipes.json');

// Read all YAML files from the recipes_yaml directory.
// Skip files starting with `_` (e.g. _template.yaml) — not real recipes.
const recipeFiles = fs.readdirSync(recipesYamlDir).filter(file => file.endsWith('.yaml') && !file.startsWith('_'));

// Convert each YAML file to a JSON object
const recipes = recipeFiles.map(file => {
  const yamlContent = fs.readFileSync(path.join(recipesYamlDir, file), 'utf8');
  return yaml.load(yamlContent);
});

// Write the resulting JSON array to the recipes.json file
fs.writeFileSync(recipesJsonFile, JSON.stringify({ recipes }, null, 2));
console.log('Generated recipes.json file successfully.');