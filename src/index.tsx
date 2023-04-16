import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Recipe from './Recipe';
import Gallery from './Gallery';
import reportWebVitals from './reportWebVitals';
import { HashRouter, Route, Routes } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    {/* <BrowserRouter basename="/recipe-portfolio"> */}
    <HashRouter>
      <Routes>
        <Route path="/" element={<Gallery />} />
        <Route path="/recipe/:recipeId" element={<Recipe />} />
      </Routes>
    </HashRouter>
    {/* </BrowserRouter> */}
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
