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
import Alert from '@mui/material/Alert'


const theme = createTheme();

function Registration(props) {
  const { user, setUser } = useContext(UserContext);
  const [isProcessed, setIsProcessed] = React.useState(false)
  const nav = useNavigate();
  const [error, setError] = React.useState('');
  const [form, setForm] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
  });
  const [goals, setGoals] = React.useState([]);
  function onChange(event) {
    const { name, value } = event.target;
    setForm((oldForm) => ({ ...oldForm, [name]: value }));
  }

  function onSubmit(e) {
    e.preventDefault();
    setError("")
    const data = {
      firstName: form.firstName,
      lastName: form.lastName,
      username: form.username,
      email: form.email,
      password: form.password,
      role: "user",
      goal1: form.goal1,
      goal2: form.goal2,
      remainingTrainingSessions: 25,
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

    return fetch('http://localhost:8080/api/registration', options).
      then(async response => {
        console.log(response);
        if (response.ok) {
          const responseJson = await response.json()
          setUser(responseJson)
          sessionStorage.setItem("user", JSON.stringify(responseJson))
          nav("/calendar") //ld
        }
        else {
          response.json().then((responseJson) => {
            console.log(responseJson);
            setError(responseJson.message)
            nav('/registration')
          })
        }
      });
  }

  function onReset() {
    setForm("");
    setError("");
  }

  function getGoals() {
    fetch('http://localhost:8080/api/goals')
      .then(async response => {
        const data = await response.json();
        if (!response.ok) {
          const error = (data && data.message) || response.statusText;
          return Promise.reject(error);
        } else {
          setGoals(data.concat("/"));    //ld
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }
 
  

  React.useEffect(() => {
      getGoals();
  }, []);
  

  return (
    <isProcessed>
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
            Registration
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={onSubmit}
            onReset={onReset}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
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
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    First goal
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    name="goal1"
                    id="demo-simple-select"
                    value={form.goal1}
                    label="FirstGoal"
                    onChange={onChange}
                  >
                    {goals.map((goal) => {
                      if (goal !== form.goal2 && goal !== "/") {  //ld
                      return <MenuItem value={goal}>{goal}</MenuItem>
                      }
})}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Second goal
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="goal2"
                    value={form.goal2}
                    label="SecondGoal"
                    onChange={onChange}
                  >
                    {goals.map((goal) => { 
                      if (goal !== form.goal1) {    //ld
                      return <MenuItem value={goal}>{goal}</MenuItem>
                      }
                    })}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            {error &&
              <Alert severity="error" sx={{marginTop: '10px'}}>{error}</Alert>
            }
            <Grid container justifyContent={"space-between"}>
              <Grid item>
                <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
                  Submit
                </Button>
              </Grid>
              <Grid item>
                <Button type="reset" variant="contained" sx={{ mt: 3, mb: 2 }}>
                  Reset
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
    </isProcessed>
  );
}
export default Registration;
