/*import React from "react";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box'
import { Typography } from "@mui/material";


function Homepage() {
    return (
        <Container fixed sx={{ marginTop: '40px' }}>
            <Box>
                <Typography>
                    Živite užurbanim životom i teško Vam je u zatrpani raspored uključiti tjelovježbu?
                </Typography>
            </Box>
            <Box>
                <Typography>
                    Ne znate što vježbati, kako vježbati, koliko često?
                </Typography>
            </Box>
            <Box>
                <Typography>
                    Naša aplikacija omogućit će vam da vrijeme treninga prilagođavate svom slobodnom vremenu u skladu s osobnim planom vježbanja.
                    Isprobajte ju i uvjerite se sami!
                </Typography>
            </Box>

        </Container>
    );
}
export default Homepage;*/

import React from 'react';
import { Box, ImageList, ImageListItem, Typography, Icon } from '@mui/material'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';


const HomePage = () => {

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '40px', marginBottom: '40px' }} >
            <Box sx={{ width: '60%' }}>
                <Typography as='h1' variant='heading' fontFamily='monospace' sx={{ fontWeight: 'bold', color: 'primary', textAlign: 'center' }}>WELCOME TO GROUP FITNESS PLANNER</Typography>
            </Box>
            <ImageList
                sx={{ width: '80%', overflowY: 'clip' }} cols={3} rowHeight={164}>
                <ImageListItem>
                    <img src={'images/pexels-william-choquette-1954524.jpg'} loading='lazy' />
                </ImageListItem>
                <ImageListItem>
                    <img src={'images/pexels-cesar-galeão-3253501.jpg'} loading='lazy' />
                </ImageListItem>
                <ImageListItem>
                    <img src={'images/pexels-victor-freitas-841130.jpg'} loading='lazy' />
                </ImageListItem>
            </ImageList>
            <Box sx={{ width: '60%', margin: '10px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <FitnessCenterIcon sx={{ color: '#83c3f7' }} />
                    <Typography variant="body1" align="center" gutterBottom sx={{ margin: '5px' }}>
                        Are you struggling to fit exercise into your hectic schedule?
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <FitnessCenterIcon sx={{ color: '#83c3f7' }} />
                    <Typography variant="body1" align="center" gutterBottom sx={{ margin: '5px' }}>
                        Not sure what workouts to do, how to do them, or how often?
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <FitnessCenterIcon sx={{ color: '#83c3f7' }} />
                    <Typography variant="body1" align="center" gutterBottom sx={{ margin: '5px' }}>
                        Our app allows you to customize your training schedule based on your personal fitness plan and free time.
                    </Typography>
                </Box>
                <Typography variant="body1" align="center" gutterBottom sx={{ margin: '5px' }}>
                    <strong>Give it a try and experience the benefits for yourself!</strong>
                </Typography>
            </Box>
        </Box>
    );
};

export default HomePage;

