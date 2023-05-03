import React from 'react';
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import clsx from 'clsx';

interface MethodsProps {
    recipe: {
      methods: string[];
      notes?: string[];
    };
    playMode: boolean;
    handlePlayClick: () => void;
    currentSlide: number;
  }

  const Methods: React.FC<MethodsProps> = ({ recipe, playMode, handlePlayClick, currentSlide }) => (
    <div className="column methods">
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <h3>Methods</h3>
      <IconButton
        onClick={handlePlayClick}
        color={playMode ? "primary" : "secondary"}
        aria-label={playMode ? "stop" : "play"}
        >
        {playMode ? <StopIcon /> : <PlayArrowIcon />}
      </IconButton>
      {playMode && <span className="play-mode-message">Press space for the next step</span>}
    </div>
    <ol>
      {recipe.methods.map((step, index) => (
        <li
          key={index}
          className={clsx({
            'current-step': playMode && currentSlide === index,
            'faded-step': playMode && currentSlide !== index,
          })}
          style={playMode ?
            {
              fontWeight: playMode && currentSlide === index ? 'bold' : 'normal',
              opacity: playMode && currentSlide === index ? 1 : 0.5,
            }
            :
            {
              fontWeight: 'normal',
              opacity: 1
            }
          }
        >
          {step}
        </li>


      ))}
    </ol>

    {recipe.notes && (
      <>
        <h3>Notes</h3>
        <ol>
          {recipe.notes.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </>
    )}
  </div>
);

export default Methods;
