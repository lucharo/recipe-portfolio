# Recipe Portfolio

This is a personal recipe portfolio website built with React. The website contains a collection of recipes gathered from various sources such as Instagram accounts, YouTube channels, and other websites. Each recipe has been personally tested and cooked regularly by the developer. The main purpose of this website is to make it easier for the developer to continue cooking their favorite recipes and share them with others.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Developer Section](#developer-section)
- [License](#license)

## Features

- A visually appealing gallery of recipes
- Responsive design that works on various screen sizes
- Dark and light themes
- Each recipe has its own dedicated page
- Built with React and Material UI

## Installation

To run the project locally, follow these steps:

1. Clone the repository:

   ```
   git clone https://github.com/lucharo/recipe-portfolio.git
   cd recipe-portfolio
   ```

2. Install the dependencies:

   ```
   npm install
   ```

3. Start the development server:

   ```
   npm start
   ```

4. Open your browser and visit `http://localhost:3000`.

## Usage

- Browse the recipe gallery on the homepage.
- Click on a recipe card to view the full details of the recipe.
- Use the top right button to switch between dark and light themes.

## Developer Section

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and uses Material UI components from the `@mui/material` package.

### Project Structure

- `public/` - Contains the static assets and the `index.html` file.
- `src/` - Contains the source code for the React components and other JavaScript files.
  - `App.tsx` - The main component that wraps the entire application.
  - `index.tsx` - The entry point for the React application.
  - `Gallery.tsx` - The main gallery component for displaying recipes.
  - `TopBar.tsx` - The top navigation bar component.
  - `ThemeContext.tsx` - Provides the theme context and hooks for managing the dark and light themes.
  - `recipes.json` - Contains the data for all the recipes in the portfolio.

### Available Scripts

In the project directory, you can run:

- `npm start`: Starts the development server.
- `npm test`: Runs the test suite.
- `npm run build`: Builds the app for production in the `build` folder.
- `npm run eject`: Removes the single build dependency from the project.
- `npm run predeploy`: Runs the build script before deploying the app.
- `npm run deploy`: Deploys the app to GitHub Pages.

### Adding a New Recipe

1. Add the recipe data to `recipes.json`.
2. Add the corresponding image to the `public/images/` folder.

## License

This project is released under the MIT License. See [LICENSE](./LICENSE) for more information.
