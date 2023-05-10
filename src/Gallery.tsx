import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { ThemeProvider } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { useThemeContext, themeDark, themeLight } from './ThemeContext';
import TopBar from './TopBar';
import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import './styles.css';

import recipeDB from './recipes.json'
import { Divider } from '@mui/material';
const recipes = recipeDB.recipes;

export default function Gallery() {
  const [theme, toggleTheme] = useThemeContext(); // Add this line

  return (
    <ThemeProvider theme={theme === 'dark' ? themeDark : themeLight}>
      <CssBaseline />
      <TopBar theme={theme} toggleTheme={toggleTheme} />
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
            <Accordion sx={{ marginBottom: 2 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="about-content"
                id="about-header"
              >
                <Typography variant="h5" component="h2">
                  About
                </Typography>
              </AccordionSummary>
              <Divider />
              <AccordionDetails>
                <Typography variant="h6" align="center" color="text.secondary" paragraph>
                  This is my personal recipe collection that I have gathered from Instagram
                  accounts, YouTube channels and the web more broadly. The recipes that
                  end up on this site have all been tested by me and I make them on a recurrent basis.
                  <br />
                  <br />
                  I built this website to make it easier for myself to keep cooking great recipes that
                  I have discovered and also to share them with others.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Container>
        </Box>

        <Container sx={{ py: 0 }} maxWidth="lg">
          {/* End hero unit */}
          <Grid container key="recipe-grid" spacing={4} columns={{ xs: 4, sm: 8, md: 12 }}>
            {recipes.map((recipe) => (
              <Grid item key={recipe.name} xs={12} sm={6} md={4}>
                <Card
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <Link to={`/recipe/${recipe.name}`} className={theme === "dark" ? "white-link" : "black-link"}>
                    <CardMedia
                      component="img"
                      sx={{
                        height: 200
                      }}
                      image={`${process.env.PUBLIC_URL}/images/${recipe.image}`} //https://source.unsplash.com/random"
                      alt="random"
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom color="inherit" variant="h5" component="h2">
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
          by <a className={theme === "dark" ? "white-link" : "black-link"} href="https://github.com/lucharo">@lucharo</a>, 2023
          
        </Typography>
      </Box>
      {/* End footer */}
    </ThemeProvider>
  );
}