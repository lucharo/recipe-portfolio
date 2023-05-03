"""
This script attempts to turn simple YAML recipes (as seen in src/recipes_simple)
into more complex ones (src/recipes). The only thing that changes is the content
of the ingredients section, breaking down every ingredient into:
    - name: ingredient's name
    - quantity: quantity of ingredient to be added in base recipe
    - unit: unit of measurement for the ingredient (tsp, tbsp, cup...)
    - steps: steps that recipe is used in

The parsing in this script is not perfect as things like onions vs white onions or garlic vs garlic cloves 
are not matched. I could invest more time in making this script super general but I think for the scale 
of what I want to do that is unnecessary. Instead I go to through the output YAML files with a visual editor
(visual-editor.py) which helps me check what ingredients are assigned to each step in an intuitive way.

The already verified recipes are stored in recipes.validated to avoid regenerating these files.
"""
import yaml
import re
import os
import spacy

nlp = spacy.load('en_core_web_sm')

def lemmatize_text(text):
    doc = nlp(text)
    lemmas = [token.lemma_ for token in doc]
    return ' '.join(lemmas)

def parse_ingredients(ingredients, methods):
    parsed_ingredients = []

    for ingredient in ingredients:
        quantity = re.search(r'\d+(\.\d+)?', ingredient)
        quantity = float(quantity.group(0)) if quantity else ''

        unit = re.search(r'\b(tsp|tbsp|cup|can|block|g|gram|ml|oz|lb|stalk|thumb|'
                         r'tablespoon|teaspoon|handful|slice|cube|clove|packet|leaves)s?\b', ingredient)
        unit = unit.group(0) if unit else ''

        ingredient_name = re.sub(rf'\d+(\.\d+)?|\s{unit}\s', '', ingredient)
        ingredient_name = re.sub(r'\s{2,}', ' ', ingredient_name)  # Replace multiple spaces with a single space
        ingredient_name = ingredient_name.strip()

        lemmatized_ingredient_name = lemmatize_text(ingredient_name)

        steps = []
        for idx, method in enumerate(methods):
            if lemmatized_ingredient_name in lemmatize_text(method) or "all ingredients" in method.lower():
                steps.append(idx + 1)

        parsed_ingredients.append({
            'name': ingredient_name,
            'quantity': quantity,
            'unit': unit,
            'steps': steps
        })

    return parsed_ingredients

def process_recipe(recipe_yaml):
    recipe = yaml.safe_load(recipe_yaml)
    recipe['ingredients'] = parse_ingredients(recipe['ingredients'], recipe['methods'])
    return recipe

def save_recipe(recipe, output_path):
    with open(output_path, 'w') as f:
        yaml.dump(recipe, f, default_flow_style=False, sort_keys=False)


# Read the verified recipe file names
with open('src/recipes.validated', 'r') as f:
    verified_recipes = f.read().splitlines()

# Filter out the verified recipe files
recipe_files = [file for file in os.listdir('src/recipes_simple') if file not in verified_recipes]
output_folder = 'src/recipes'

if not os.path.exists(output_folder):
    os.makedirs(output_folder)

for file in recipe_files:
    with open(os.path.join('src/recipes_simple', file), 'r') as f:
        recipe_yaml = f.read()
        processed_recipe = process_recipe(recipe_yaml)
        recipe_name = processed_recipe['name']
        output_path = os.path.join(output_folder, file)
        save_recipe(processed_recipe, output_path)
