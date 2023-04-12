import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { useThemeContext } from './ThemeContext';
import TopBar from './TopBar';

import recipeDB from './recipes.json'
const recipes = recipeDB.recipes;

export default function Album() {
  const [theme, toggleTheme] = useThemeContext(); // Add this line
  const themeConfig = createTheme({
    palette: {
      mode: theme === 'dark' ? 'dark' : 'light',
    },
  });

  return (
    <ThemeProvider theme={themeConfig}>
      <CssBaseline />
      <TopBar />
      <main>
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="md">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Recipe Portfolio
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
              This is my personal recipe collection that I have gathered from Instagram
              accounts, YouTube channels and the web more broadly. The recipes that
              end up on this site have all been tested by me and I make them on a recurrent basis.
              <br></br><br></br>
              I built this website to make it easier for myself to keep cooking great recipes that
              I have discovered and also to share them with others.
            </Typography>
          </Container>
        </Box>
        <Container sx={{ py: 0 }} maxWidth="lg">
          {/* End hero unit */}
          <Grid container spacing={4} columns={16}>
            {recipes.map((recipe) => (
              <Grid item key={recipe.name} xs={12} sm={6} md={4}>
                <Card
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <Link to={`/recipe/${recipe.name}`}>
                    <CardMedia
                      component="img"
                      sx={{
                        height: 200
                      }}
                      image="/images/auberginecurry.jpg" //https://source.unsplash.com/random"
                      alt="random"
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {recipe.name}
                      </Typography>
                      <Typography>
                        YUMMY!
                      </Typography>
                    </CardContent>
                  </Link>

                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          by <a href="https://github.com/lucharo">@lucharo</a>, 2023
        </Typography>
      </Box>
      {/* End footer */}
    </ThemeProvider>
  );
}