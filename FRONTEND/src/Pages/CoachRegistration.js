import React, { useContext } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const theme = createTheme();

function CoachRegistration(props) {
  const { user, setUser } = useContext(UserContext);

  const nav = useNavigate();
  const [form, setForm] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
  });
  const location = useLocation();

  function onChange(event) {
    const { name, value } = event.target;
    console.log(event.target);
    setForm((oldForm) => ({ ...oldForm, [name]: value }));
  }

  function onSubmit(e) {
    e.preventDefault();
    const data = {
      firstName: form.firstName,
      lastName: form.lastName,
      username: form.username,
      email: form.email,
      password: form.password,
      role: "trainer",
      goal1: "",
      goal2: "",
      remainingTrainingSessions: 0,
      newGoal: 0,
    };

    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    return fetch(
      "http://localhost:8080/api/new-trainer",
      options
    ).then(async (response) => {
      console.log(response);
      if (response.ok) {
        
        nav("/profilepage");
      } else {
        response.json().then((responseJson) => {
          console.log(responseJson);
          nav("/trainerregistration", {
            state: {
              message: responseJson.message,
            },
          });
        });
      }
    });
  }

  function onReset() {
    setForm("");
    location.state = null;
  }
  



  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Coach registration
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={onSubmit}
            onReset={onReset}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              {location.state != null ? (
                <Grid
                  style={{ border: "3px solid red", fontSize: "20px" }}
                  item
                  xs={12}
                  sm={12}
                >
                  {location.state.message}
                </Grid>
              ) : (
                ""
              )}

              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  onChange={onChange}
                  value={form.firstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  onChange={onChange}
                  value={form.lastName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={onChange}
                  value={form.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="username"
                  label="Username"
                  type="username"
                  id="username"
                  autoComplete="new-username"
                  onChange={onChange}
                  value={form.username}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={onChange}
                  value={form.password}
                />
              </Grid>
              <Grid container justifyContent={"space-between"}>
                <Grid item>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Submit
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    type="reset"
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Reset
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
export default CoachRegistration;
