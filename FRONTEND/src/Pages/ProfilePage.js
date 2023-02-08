import { UserContext } from "../UserContext";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/joy/Stack";
import TextField from "@mui/joy/TextField";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import CheckIcon from "@mui/icons-material/Check";
import Select from "@mui/material/Select";
import SportsScoreIcon from "@mui/icons-material/SportsScore";
import { useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import Alert from '@mui/material/Alert'


function ProfilePage() {
  const { user, setUser } = useContext(UserContext);
  const [allGoals, setGoals] = React.useState([]);
  const [error, setError] = React.useState('');


  function getGoals() {
    fetch("http://localhost:8080/api/goals")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          const error = (data && data.message) || response.statusText;
          return Promise.reject(error);
        } else {
          setGoals(data.concat("/"))
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }

  const nav = useNavigate();

  const [newGoal1, setNewGoal1] = useState("");

  const [newGoal2, setNewGoal2] = useState("");

  function handleNewGoal1(event) {
    setNewGoal1(event.target.value);
  }

  function handleNewGoal2(event) {
    if (newGoal1 == "" || newGoal1 == null || newGoal1 == event.target.value) {
    } else {
      setNewGoal2(event.target.value);
    }
  }

  function setNewGoals(event) {
    if (newGoal1 == "" || newGoal1 == null) {
    } else {
      const data = new FormData();
      data.append("username", user.username);
      data.append("goal1", newGoal1);
      data.append("goal2", newGoal2);

      const options = {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: data,
      };

      return fetch("http://localhost:8080/api/change_goals", options).then(
        async (response) => {
          console.log(response);
          if (response.ok) {
            const responseJson = await response.json();
            setUser(responseJson);
            sessionStorage.setItem("user", JSON.stringify(responseJson));
            nav("/profilepage");
          } else {
            response.json().then((responseJson) => {
              console.log(responseJson);
              nav("/profilepage", {
                state: {
                  message: responseJson.message,
                },
              });
            });
          }
        }
      );
    }
  }

  const [showButtonEditNewPass, setShowButtonEditNewPass] = useState(true);
  const [showButtonSendNewPass, setShowButtonSendNewPass] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorGoal, setErrorGoal] = useState(false);

  function editNewPass(event) {
    event.preventDefault();
    setError("")
    setShowButtonSendNewPass(true);
    setShowButtonEditNewPass(false);
  }

  function sendNewPass(event) {
    event.preventDefault();
    setShowButtonSendNewPass(false);
    setShowButtonEditNewPass(true);

    const data = new FormData();
    data.append("username", user.username);
    data.append("current_password", oldPassword);
    data.append("new_password", newPassword);

    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: data,
    };

    return fetch("http://localhost:8080/api/change_password", options).then(
      async (response) => {
        console.log(response);
        if (response.ok) {
          nav("/profilepage");
        } else {
          response.json().then((responseJson) => {
            setError(responseJson.message)
            nav("/profilepage");
          });
        }
      }
    );
  }

  const [profilePictureUrl, setProfilePictureUrl] = useState();


  React.useEffect(() => {  //ld
    if(user.role == "admin"){
    setProfilePictureUrl("/images/admin.jpg")
    }
    else if(user.role == "user"){
      setProfilePictureUrl("/images/user.png")
    }
    else if(user.role == "trainer")
    {
      setProfilePictureUrl("/images/trainer.png")
    }
    getGoals();
  }, []);

  if(user==null){
    return ""       //ld
  }
  return (
    <>
      <div class="UserInfo">
        <div class="FormalData">
          <Stack direction="column" spacing={1}>
            <Avatar
              alt="John"
              src={profilePictureUrl}
              sx={{ width: 100, height: 100 }}
            />
            <TextField
              disabled
              label="Name"
              value={user.firstName}
              startDecorator={<PersonRoundedIcon />}
              endDecorator={<CheckIcon />}
            />
            <TextField
              disabled
              label="Surname"
              value={user.lastName}
              startDecorator={<PersonRoundedIcon />}
              endDecorator={<CheckIcon />}
            />
            <TextField
              disabled
              label="Username"
              value={user.username}
              startDecorator={<PersonRoundedIcon />}
              endDecorator={<CheckIcon />}
            />
            <TextField
              disabled
              label="Email"
              value={user.email}
              startDecorator={<PersonRoundedIcon />}
              endDecorator={<CheckIcon />}
            />
            <div>
              {showButtonSendNewPass && (
                  <>
                  <div class ="PasswordInputs">
                  <TextField
                    label = "Password"
                    placeholder ="Enter your old password"
                    value={oldPassword}
                    onChange={(event) => setOldPassword(event.target.value)}
                  />
                  <TextField
                  placeholder ="Set your new password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                  />
                  </div><div class ="ChangeButton">
                  <Button
                    onClick={sendNewPass}
                    style={{ backgroundColor: "rgba(184, 219, 251, 0.8)" }}
                    variant="outlined"
                  >
                    Set new password
                  </Button>
                  </div>
                </>
              )}
              {error &&
              <Alert severity="error" sx={{marginTop: '10px'}}>{error}</Alert>
            }
              {showButtonEditNewPass && (
                
                <Button
                  onClick={editNewPass}
                  style={{ backgroundColor: "rgba(184, 219, 251, 0.8)" }}
                  variant="outlined"
                >
                  Change current password
                </Button>
                
              )}
            </div>
          </Stack>
        </div>
        {user.role == "user" && 
        <div class="Goals">
          <Stack direction="row" spacing={1}>
            {user.newGoal == "0" && (
              <>
                <TextField
                  disabled
                  label="First goal"
                  value={user.goal1}
                  startDecorator={<SportsScoreIcon />}
                  endDecorator={<CheckIcon />}
                />
                <TextField
                  disabled
                  label="Second goal"
                  value={user.goal2}
                  startDecorator={<SportsScoreIcon />}
                  endDecorator={<CheckIcon />}
                />
              </>
            )}
            {user.newGoal == "1" && (
              <>
                <FormControl fullWidth>
                  <InputLabel>First goal</InputLabel>
                  <Select
                    name="goal1"
                    value={newGoal1}
                    label="FirstGoal"
                    onChange={handleNewGoal1}
                  >
                    {allGoals.filter(goal => {   //ld
                  if(newGoal2) {
                      return goal !== newGoal2 && goal !== "/"
                          }
                   return goal !== "/"
                    }).map((goal) => (
                      <MenuItem value={goal}>{goal}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Second goal</InputLabel>
                  <Select
                    name="goal2"
                    value={newGoal2}
                    label="SecondGoal"
                    onChange={handleNewGoal2}
                  >
                    {allGoals.filter(goal => {                  //ld
                if(newGoal1) {
                   return goal !== newGoal1 
                      }
                      }).map((goal) => (
                      <MenuItem value={goal}>{goal}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  onClick={setNewGoals}
                  variant="string"
                  endIcon={<ChangeCircleIcon />}
                >
                  Change goals
                </Button>
              </>
            )}
          </Stack>       
        </div>}
      </div>
      <>
        <Button
          onClick={() => {
            setUser(null);
            sessionStorage.clear();
            nav("/");
          }}
          variant="contained"
          fullWidth
          sx={{ mt: 3, mb: 2 }} 
          style={{
            width: "150px",   //ld
            height: "50px",
            position: "fixed",
            top: "80%",
            left: "90%",
          }}
        >
          Log out
        </Button>
      </>
    </>
  );
}
export default ProfilePage;
