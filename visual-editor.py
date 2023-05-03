import os
import yaml
import streamlit as st

RECIPE_FOLDER = "src/recipes"
VERIFIED_FILE = "src/recipes.validated"

@st.cache_resource
def load_recipe(file_path):
    with open(file_path, "r") as f:
        return yaml.safe_load(f)

def save_recipe(recipe, file_path):
    with open(file_path, "w") as f:
        yaml.dump(recipe, f, default_flow_style=False, sort_keys=False)

def load_verified_recipes():
    with open(VERIFIED_FILE, "r") as f:
        return [line.strip() for line in f.readlines()]

def add_to_verified_recipes(filename):
    with open(VERIFIED_FILE, "a") as f:
        f.write(f"{filename}\n")

st.title("YAML Recipe Visual Editor")

verified_recipes = set(load_verified_recipes())
all_recipes = [f for f in os.listdir(RECIPE_FOLDER) if f.endswith(".yaml") and f not in verified_recipes]

selected_recipe = st.selectbox("Select a recipe", all_recipes)

if selected_recipe:
    recipe_path = os.path.join(RECIPE_FOLDER, selected_recipe)
    recipe = load_recipe(recipe_path)

    ingredients = recipe["ingredients"]
    methods = recipe["methods"]
    current_step = st.number_input("Step Number", min_value=1, max_value=len(methods), value=1)

    col1, col2 = st.columns([1, 9])
    with col1:
        if st.button("Save"):
            save_recipe(recipe, recipe_path)
            st.success("Recipe saved!")

    with col2:
        if st.button('Save and validate'):
            save_recipe(recipe, recipe_path)
            add_to_verified_recipes(selected_recipe)
            st.success("Recipe saved and validated!")

    col1, col2 = st.columns(2)

    with col1:
        st.subheader("Ingredients in Step")
        ingredient_checkboxes = [st.checkbox(ingredient["name"], key=idx, value=current_step in ingredient["steps"]) for idx, ingredient in enumerate(ingredients)]

    with col2:
        st.subheader(f"Step {current_step}:")
        st.write(methods[current_step - 1])

    for idx, checkbox in enumerate(ingredient_checkboxes):
        if checkbox:
            if current_step not in ingredients[idx]["steps"]:
                ingredients[idx]["steps"].append(current_step)
        else:
            if current_step in ingredients[idx]["steps"]:
                ingredients[idx]["steps"].remove(current_step)

    yaml_string = yaml.dump(recipe, default_flow_style=False, sort_keys=False)
    with st.expander("Click here to expand YAML"):
        st.code(yaml_string, language='yaml')
else:
    st.header("All recipes validated! Congrats 🎉")