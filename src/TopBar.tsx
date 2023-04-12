// TopBar.tsx
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { useThemeContext } from './ThemeContext';

const TopBar: React.FC = () => {
  const { theme, toggleTheme } = useThemeContext();

  return (
    <AppBar position="relative">
      <Toolbar>
        <Typography
          variant="h6"
          color="inherit"
          noWrap
          style={{ cursor: 'pointer' }}
          onClick={() => history.push('/')}
        >
          Recipe Portfolio
        </Typography>
        <IconButton edge="end" color="inherit" onClick={toggleTheme} style={{ marginLeft: 'auto' }}>
          {theme === 'dark' ? (
            <FontAwesomeIcon icon={faSun} />
          ) : (
            <FontAwesomeIcon icon={faMoon} />
          )}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
