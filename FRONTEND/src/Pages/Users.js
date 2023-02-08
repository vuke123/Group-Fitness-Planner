import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Typography from '@mui/joy/Typography';
import ListDivider from "@mui/joy/ListDivider";
import Button from '@mui/material/Button';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import axios from "axios";
import Alert from '@mui/material/Alert'

function Users() {

  const [open, setOpen] = React.useState(false);
  const [username, setUsername] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const [exercises, setExercises] = React.useState([]);
  const [checkedState, setCheckedState] = useState();
  const [error, setError] = useState("");
  const [access, setAccess] = useState(true);

  const nav = useNavigate();

  useEffect(() => {
    var userSessionStorage = sessionStorage.getItem("user")
    userSessionStorage = JSON.parse(userSessionStorage)
    if (userSessionStorage == null) {
      nav('/login')
    }
    else {
      if (userSessionStorage.role == "user") {
        setAccess(false);
      }
    }
  }, []);


  function handleClickOpen(username) {
    setOpen(true);
    setUsername(username);
  };

  const handleClose = () => {
    setCheckedState(new Array(exercises.length).fill(false));
    setOpen(false);
  };

  function onSubmit(e) {
    e.preventDefault();
    console.log(username);
    let userex = [];
    exercises.forEach((exercise, index) => {
      if (checkedState[index] === true) {
        userex.push(exercise)
      }
    })
    if (userex.length < 2) {
      setError("Choose at least two exercises!")
    }
    else {
      for (var i = 0; i < users.length; i++) {
        if (users[i].username == username) {
          users[i].hasExercises = "true"
          break;
        }
      }
      const bodyFormData = new FormData();
      bodyFormData.append("username", username);
      bodyFormData.append("exercises", userex);

      const options = {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: bodyFormData
      };
      fetch('http://localhost:8080/api/save-exercises', options)
        .then(async response => {
          if (!response.ok) {
            response = await response.json()
            console.log(response)
          }
        })
      handleClose();
    }
  }

  const handleChange = (position) => {

    setError("");
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    const checked = updatedCheckedState.filter(value => value === true).length;
    console.log(checked)
    if (checked <= 5) {
      setCheckedState(updatedCheckedState);
    }

  };

  useEffect(() => {
    axios.get('http://localhost:8080/api/exercises')
      .then(res => {
        setExercises(res.data)
        setCheckedState(new Array(res.data.length).fill(false));
      })
      .catch(err => {
        console.log(err);
      })
  }, [])

  const exercisescheck = []
  exercises.forEach((exercise, index) => {
    exercisescheck.push(
      <FormControlLabel control={<Checkbox checked={checkedState[index]} onChange={() => handleChange(index)} sx={{ color: "#1976d2" }} />} label={exercise} />
    )
  })

  useEffect(() => {
    axios.get('http://localhost:8080/api/users')
      .then(res => {
        console.log(res.data)
        setUsers(res.data)
      })
      .catch(err => {
        console.log(err);
      })
  }, [])

  let userList = []
  users.forEach((user, index) => {
    let goals = [];
    goals.push(user.goal1);
    if (user.goal2 != '') {
      goals.push(user.goal2)
    }
    userList.push(<ListItem key={index}>
      <ListItemDecorator sx={{ alignSelf: 'flex-start' }}>
        <Avatar>
          <AccountCircleOutlinedIcon sx={{ color: "#1976d2" }} />
        </Avatar>
      </ListItemDecorator>
      <ListItemContent>
        <Typography fontWeight="xl">{user.username}</Typography>
        <Typography level="body2" noWrap>
          {goals.join(", ")}
        </Typography>
      </ListItemContent>
      {
        user.hasExercises == "false" &&
        <Button
          variant="contained"
          size="small"
          onClick={() => handleClickOpen(user.username)}
        >
          Add exercises
        </Button>
      }
    </ListItem>)
    if (index < users.length - 1) {
      userList.push(<ListDivider inset="gutter" sx={{ bgcolor: "#1976d2" }} />)
    }
  })
  if (access == true) {
    return (

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          width: 800,
          margin: 'auto',
          flexDirection: 'column',
          marginTop: "70px"
        }}
      >
        <Typography
          level="body4"
          textTransform="uppercase"
          fontWeight="xl"
          mb={1}
          sx={{ letterSpacing: '0.15rem', margin: "10px" }}
        >
          Users
        </Typography>
        <List
          variant="outlined"
          sx={{
            bgcolor: 'background.body',
            minWidth: 240,
            borderRadius: 'sm',
            boxShadow: 'sm',
            '--List-decorator-size': '56px',
            '--List-item-paddingLeft': '1.5rem',
            '--List-item-paddingRight': '1rem',
          }}
        >
          {userList}
        </List>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add exercises</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please select 2 to 5 exercises.
            </DialogContentText>
            <FormGroup>
              {exercisescheck}
            </FormGroup>
          </DialogContent>
          {error &&
            <Alert severity="error">{error}</Alert>
          }
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={onSubmit}>Submit</Button>
          </DialogActions>
        </Dialog>
      </Box>

    );
  }
  else {
    return (
      <Alert severity="error">You can't access this site</Alert>
    );
  }

}

export default Users;