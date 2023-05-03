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

        unit = re.search(r'\b(tsp|tbsp|cup|can|block|g|ml|oz|lb|stalk|tablespoon|teaspoon|handful|cube|clove|packet)s?\b', ingredient)
        unit = unit.group(0) if unit else ''

        ingredient_name = re.sub(rf'\d+(\.\d+)?|\s{unit}\s', '', ingredient)
        ingredient_name = re.sub(r'[\(\)\[\]/]', ' ', ingredient_name)  # Remove special symbols like (, ), [, ], /
        ingredient_name = re.sub(r'\s{2,}', ' ', ingredient_name)  # Replace multiple spaces with a single space
        ingredient_name = re.sub(r'(optional)', '', ingredient_name, flags=re.IGNORECASE)  # Remove the word 'optional'
       # Remove 'of' after unit
        if unit:
            ingredient_name = re.sub(rf'\b({unit})s?\s+of\s+', rf'\1 ', ingredient_name)
        else:
            ingredient_name = re.sub(r'\s+of\s+', ' ', ingredient_name)
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

recipe_files = os.listdir('src/recipes_simple')
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
