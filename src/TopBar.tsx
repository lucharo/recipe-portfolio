// TopBar.tsx
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun, faHome } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

interface TopBarProps {
    theme: string;
    toggleTheme: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ theme, toggleTheme }) => {
    const navigate = useNavigate();

    return (
        <AppBar position="relative">
            <Toolbar>
                <Button
                    key="home"
                    variant="outlined"
                    color="inherit"
                    onClick={() => navigate('/')}
                  >
                    <FontAwesomeIcon icon={faHome} /> 
                    <span style={{ marginLeft: '4px' }}>Recipe Portfolio</span>
                  </Button>
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
