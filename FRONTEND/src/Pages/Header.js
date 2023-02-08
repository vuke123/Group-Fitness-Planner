import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { AppBar, Toolbar, Grid, Typography } from "@mui/material";
import { UserContext } from "../UserContext";
import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";



function Header() {
    const { user, setUser } = useContext(UserContext);

    const login = [];
    const userLinks = [];
    const trainerLinks = [];
    const adminLinks = [];

    userLinks.push(
        <Grid container spacing={2} sx={{ justifyContent: "center" }}>
            <Grid item>
                <Link to='/' style={{ textDecoration: 'none', color: 'white', fontFamily: 'monospace', fontSize: '1rem' }}>Home</Link>
            </Grid>
            <Grid item>
                <Typography>|</Typography>
            </Grid>
            <Grid item>
                <Link to='/profilepage' style={{ textDecoration: 'none', color: 'white', fontFamily: 'monospace', fontSize: '1rem' }}>Profile</Link>
            </Grid>
            <Grid item>
                <Typography>|</Typography>
            </Grid>
            <Grid item>
                <Link to='/calendar' style={{ textDecoration: 'none', color: 'white', fontFamily: 'monospace', fontSize: '1rem' }}>Calendar</Link>
            </Grid>
        </Grid>
    )

    trainerLinks.push(
        <Grid container item spacing={2} sx={{ justifyContent: "center" }}>
            <Grid item>
                <Link to='/' style={{ textDecoration: 'none', color: 'white', fontFamily: 'monospace', fontSize: '1rem' }}>Home</Link>
            </Grid>
            <Grid item>
                <Typography>|</Typography>
            </Grid>
            <Grid item>
                <Link to='/profilepage' style={{ textDecoration: 'none', color: 'white', fontFamily: 'monospace', fontSize: '1rem' }}>Profile</Link>
            </Grid>
            <Grid item>
                <Typography>|</Typography>
            </Grid>
            <Grid item>
                <Link to='/users' style={{ textDecoration: 'none', color: 'white', fontFamily: 'monospace', fontSize: '1rem' }}>Users</Link>
            </Grid>
            <Grid item>
                <Typography>|</Typography>
            </Grid>
            <Grid item>
                <Link to='/calendar' style={{ textDecoration: 'none', color: 'white', fontFamily: 'monospace', fontSize: '1rem' }}>Calendar</Link>
            </Grid>

        </Grid>
    )

    adminLinks.push(
        <Grid container item spacing={2} sx={{ justifyContent: "center" }}>
            <Grid item>
                <Link to='/' style={{ textDecoration: 'none', color: 'white', fontFamily: 'monospace', fontSize: '1rem' }}>Home</Link>
            </Grid>
            <Grid item>
                <Typography>|</Typography>
            </Grid>
            <Grid item>
                <Link to='/trainerregistration' style={{ textDecoration: 'none', color: 'white', fontFamily: 'monospace', fontSize: '1rem' }}>Register coach</Link>
            </Grid>
            <Grid item>
                <Typography>|</Typography>
            </Grid>
            <Grid item>
                <Link to='/allusers' style={{ textDecoration: 'none', color: 'white', fontFamily: 'monospace', fontSize: '1rem' }}>All users</Link>
            </Grid>

        </Grid>
    )

    login.push(<Link to='/login' style={{ textDecoration: 'none', color: 'white', fontFamily: 'monospace', fontSize: '1rem' }}>Login</Link>);

    useEffect(() => {
        var userSessionStorage = sessionStorage.getItem("user")
        userSessionStorage = JSON.parse(userSessionStorage)
        if (userSessionStorage != null) {
          setUser(userSessionStorage)
        }
      }, []);

      const nav = useNavigate()

      const handleClickProfile = () => {
        nav("/profilepage")
    }

    
    return (
        <AppBar position="static">
            <Toolbar>
                <Grid container>
                    <FitnessCenterIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        GFP
                    </Typography>

                </Grid>
                {user != null && user.role == "user" && userLinks}
                {user != null && user.role == "trainer" && trainerLinks}
                {user != null && user.role == "admin" && adminLinks}
                <Grid container sx={{ justifyContent: "flex-end" }} spacing={3}>
                    <Button style = {{ color : 'white' , marginTop : '20px', border : '1px solid white'}} item onClick ={handleClickProfile}>{(user != null) ? user.username : login}</Button>
                    <Grid style = {{ marginTop : '10px' }} item>{(user != null && user.role == "user") ? " trainings left: " + user.remainingTrainingSessions : ""}</Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    )
}

export default Header;