import React, { useContext } from "react";
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";



const theme = createTheme();

function Login(props) {
  const { user, setUser } = useContext(UserContext)
  const nav = useNavigate();
  const [loginForm, setLoginForm] = React.useState({ username: '', password: '' });
  const [error, setError] = React.useState('');
  function onChange(event) {
    setUser(null)
    const { name, value } = event.target;
    setLoginForm(oldForm => ({ ...oldForm, [name]: value }))
  }

  function onSubmit(e) {
    e.preventDefault();
    setError("");
    const body = `username=${loginForm.username}&password=${loginForm.password}`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body
    };
    fetch('http://localhost:8080/api/login', options)
      .then(async response => {
        if (!response.ok) {
          response = await response.json();
          setError(response.message)
          nav('/login')
        } else {
          let responseJson = await response.json();
          setUser(responseJson);
          sessionStorage.setItem("user", JSON.stringify(responseJson))
          if (responseJson.role == "admin")
            nav("/allusers")
          else nav("/calendar"); //ld
        } 
      });
  }
 

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 15,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Log In
          </Typography>
          <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              onChange={onChange}
              value={loginForm.username}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={onChange}
              value={loginForm.password}
            />
            {error &&
              <Alert severity="error">{error}</Alert>
            }
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3, mb: 2 }}
            >
              Log in
            </Button>
            
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center">
              <Link href="/registration" variant="body2">
                {"No account? Register here"}
              </Link>
            </Box>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
export default Login;

