import * as React from 'react';
import Paper from '@mui/material/Paper';
import {
    Scheduler,
    WeekView,
    Appointments,
    AppointmentTooltip,
    Toolbar,
    DateNavigator,
    TodayButton,
} from '@devexpress/dx-react-scheduler-material-ui';
import { ViewState } from '@devexpress/dx-react-scheduler';
import dayjs from 'dayjs';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button'
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { UserContext } from "../UserContext";
import { useContext, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Box from '@mui/material/Box'
import axios from "axios";

export default function Rezervacija() {
    const { user, setUser } = useContext(UserContext);
    const [trainingType, setTrainingType] = useState("");
    const [types, setTypes] = useState(null);
    const [capacity, setCapacity] = useState("");
    const [appointments, setAppointments] = useState(null);
    const [open, setOpen] = React.useState(false);
    const [dateTime, setDateTime] = React.useState(dayjs());
    const [currentDate, setCurrentDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [deniedPermission, setDeniedPermission] = useState(false);

    //Add training form open and close
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    function changeCurrentDate(currDate) {
        setCurrentDate(currDate);
    }

    const handleChange = (newValue) => {
        setDateTime(newValue);
    };

    useEffect(() => {

        if (user != null) {
        
            //admin i trainer imaju uvid u sve treninge
            if (user.role === "trainer" || user.role === "admin") {
                getData();
            }
            if (user.role == "user") {
                getUserSessions(user);
                checkPermission(); // permission
            }
        }
    }, [user]);  


    //data za trenere i admina
    async function getData() {
        axios.get("http://localhost:8080/api/training-types")
            .then((res) => setTypes(res.data));
        axios.get("http://localhost:8080/api/sessions") // all sessions
            .then((res) => {
                var AppsJSON = res.data;
                AppsJSON.forEach(element => {
                    element.title = element.trainingType;
                    element.startDate = element.start;
                    element.endDate = element.startDate;
                    element.endDate = dayjs(element.start).add(1, 'hour').format('YYYY-MM-DDTHH:mm:ss.sss');
                    element.color = 'blue';
                    if (user.username == element.trainerUsername) {
                        element.color = 'orange';
                    }
                });
                setAppointments(AppsJSON);
            });
    }

    //Getting data for user role
    async function getUserSessions(user) {
        var nonReserved = null;
        var reserved = null;
    
        var link = `http://localhost:8080/api/non-reserved-sessions-per-user?username=${user.username}`;
        await axios.get(link)
            .then(res => {
                nonReserved = res.data;
                formatSessions(nonReserved, false, "blue")
            })
            .catch((err) => {
                console.log(err);
            });
    
        link = `http://localhost:8080/api/reserved-sessions-per-user?username=${user.username}`;
        await axios.get(link)
            .then(res => {
                reserved = res.data;
                formatSessions(reserved, true, "green")
            })
            .catch((err) => {
                console.log(err);
            });
        var finalObj = [...(reserved || []), ...(nonReserved || [])];
        setAppointments(finalObj);
    }
    
    function formatSessions(sessions, reserved, color) {
        sessions.forEach(element => {
            element.title = element.trainingType;
            element.startDate = element.start;
            element.endDate = dayjs(element.start).add(1, 'hour').format('YYYY-MM-DDTHH:mm:ss.sss');
            element.reserved = reserved;
            element.color = color;
        });
    }

    //Checking if user should be able to see the calendar
    async function checkPermission() {
        var link = `http://localhost:8080/api/calendar-permission?username=${user.username}`;
        await axios.get(link)
            .then(res => {
                setDeniedPermission(false);
            })
            .catch((err) => {
                setDeniedPermission(true);
            });
    }

    //testing if capacity is a number
    function validateNumbers(e) {
        const re = /^[0-9\b]+$/;
        // if value is not blank, then test the regex

        if (e.target.value === '' || re.test(e.target.value)) {
            setCapacity(e.target.value);
        }
        else {
            setCapacity("");
            alert("capacity is a number");
        }
    }


    const PREFIX = 'Demo';

    const classes = {
        icon: `${PREFIX}-icon`,
        textCenter: `${PREFIX}-textCenter`,
        header: `${PREFIX}-header`,
        commandButton: `${PREFIX}-commandButton`,
    };


    const StyledAppointmentTooltipHeader = styled(AppointmentTooltip.Header)(() => ({
        [`&.${classes.header}`]: {
            height: '260px',
            backgroundSize: 'cover',
            justifyContent: 'center',
        },
    }));

    const StyledGrid = styled(Grid)(() => ({
        [`&.${classes.textCenter}`]: {
            textAlign: 'center',
        },
    }));

    const StyledAppointmentTooltipCommandButton = styled(AppointmentTooltip.CommandButton)(() => ({
        [`&.${classes.commandButton}`]: {
            backgroundColor: 'rgba(255,255,255,0.65)',
        },
    }));

    const CommandButton = (({
        ...restProps
    }) => (
        <StyledAppointmentTooltipCommandButton {...restProps} className={classes.commandButton} />
    ));

    //Custom appointment tooltip header
    const Header = (({
        children, appointmentData, ...restProps
    }) => (
        <StyledAppointmentTooltipHeader
            {...restProps}
            appointmentData={appointmentData}
        >
            {user.role === "user" &&
                !appointmentData.reserved &&
                <Grid container alignItems="center">
                    <Button
                        startIcon={<CheckBoxIcon />}
                        className={classes.commandButton}
                        size="large"
                        variant="contained"
                        color="success"
                        onClick={() => {

                            handleReserve(appointmentData);
                            }
                        }>
                        Reserve
                    </Button>
                </Grid>
            }
            {user.role === "user" &&
                appointmentData.reserved &&
                <Grid container alignItems="center">
                    <Button
                        startIcon={<DisabledByDefaultIcon />}
                        onClick={() => {
                            if (handleCancel(user, appointmentData)) {
                                appointmentData.reserved = false;
                            }
                        }}
                        className={classes.commandButton}
                        size="large"
                        variant="contained"
                        color="error"
                    >
                        Cancel
                    </Button>
                </Grid>
            }
        </StyledAppointmentTooltipHeader>
    ));

    const Content = (({
        children, appointmentData, ...restProps
    }) => (
        <AppointmentTooltip.Content {...restProps} appointmentData={appointmentData} >
            <Grid container alignItems="center">
                <StyledGrid item xs={2} className={classes.textCenter}>
                    <AccountCircleIcon />
                </StyledGrid>
                <Grid item xs={2}>
                    <span>{appointmentData.trainerFirstName} {appointmentData.trainerLastName}</span>
                </Grid>
            </Grid>
        </AppointmentTooltip.Content>

    ));

    //Handling user reserving a training session
    async function handleReserve(appointmentData) {
        const bodyform = new FormData();
        bodyform.append("username", user.username);
        bodyform.append("id", appointmentData.id);

        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            body: bodyform
        }
        var flag = false;
        await fetch('http://localhost:8080/api/save-reservation', options)
            .then(async res => {
                if (!res.ok) {
                    res.json().then((responseJson) => {
                        alert(responseJson.message);
                        flag =  false;
                      })
                }
                else if (res.ok) {
                    appointmentData.reserved=true;
                    setUser(user => ({
                        ...user,
                        remainingTrainingSessions: user.remainingTrainingSessions - 1,
                    }))
                    var userSessionStorage = sessionStorage.getItem("user")
                    userSessionStorage = JSON.parse(userSessionStorage)
                    userSessionStorage.remainingTrainingSessions = userSessionStorage.remainingTrainingSessions - 1;
                    sessionStorage.setItem("user", JSON.stringify(userSessionStorage));
                    flag =  true;
                }
            }).catch((err) => {
                console.log(err);
                alert(err);
                flag = false;
            });
        console.log(flag)
        return flag;
    }

    //Handling user canceling a reservation
    async function handleCancel(user, appointmentData) {
        const bodyform = new FormData();
        bodyform.append("username", user.username);
        bodyform.append("id", appointmentData.id);

        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            body: bodyform
        }
        await fetch('http://localhost:8080/api/delete-reservation', options)
            .then((res) => {
                if (!res.ok) {
                    alert("An error has happened while trying to cancel you reservation!");
                    return false;
                }
                if (res.ok) {
                    setUser(user => ({
                        ...user,
                        remainingTrainingSessions: user.remainingTrainingSessions + 1,
                    }))
                    var userSessionStorage = sessionStorage.getItem("user")
                    userSessionStorage = JSON.parse(userSessionStorage)
                    userSessionStorage.remainingTrainingSessions = userSessionStorage.remainingTrainingSessions + 1;
                    sessionStorage.setItem("user", JSON.stringify(userSessionStorage));
                    return true;
                }
            })
            .catch((err) => {
                console.log(err);
                alert(err);
                return false;

            });
    }

    //Handling add training
    async function handleAdd(id) {
    	if (capacity === "" || trainingType === "") {
    		alert("You are not allowed to leave parts of the form empty.");
    		return;
    	}
        const data = {
            start: dayjs(dateTime).format('YYYY-MM-DDTHH:mm:ss'),
            trainingType: trainingType,
            trainerUsername: user.username,
            trainerFirstName: user.firstName,
            trainerLastName: user.lastName,
            places: capacity,
            freePlaces: capacity
        };
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)

        };
        await fetch('http://localhost:8080/api/create-training-session', options)
            .then((res) => {
                if (res.ok) {
                    setOpen(false);
                }
                else {
                    console.log(res);
                    alert("Error while adding a training session, probably another training already exists at the selected time.");
                    return;
                }
            });
            setTrainingType("");
            setCapacity("");
            setDateTime(dayjs());
        getData();

    }

    return (
        <>
            {deniedPermission &&
                <div style={{ marginTop: '100px', textAlign: 'center', fontSize: '20px' }}>
                    <h1>Please wait for one of our trainers to</h1>
                    <h1>assign you exercises.</h1>
                </div>}
            {!deniedPermission &&
            <div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    {user != null && (user.role === "trainer" || user.role === "admin") &&
                        <Button variant="outlined" onClick={handleClickOpen}>
                            Add Training
                        </Button>
                    }
                </div>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Add training</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                        </DialogContentText>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                label="Date&Time picker"
                                value={dateTime}
                                onChange={handleChange}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                        {types != null &&
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                                <InputLabel id="demo-simple-select-standard-label">Training type</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    name="Training type"
                                    id="demo-simple-select"
                                    label="trainingType"
                                    onChange={(newValue) => { setTrainingType(newValue.target.value); }}
                                >
                                    {
                                        types.map(type =>
                                            <MenuItem key={type} value={type}>
                                                {type}
                                            </MenuItem>
                                        )
                                    }
                                </Select>
                            </FormControl>
                        }

                        <TextField
                            style={{ width: 100 }}
                            autoFocus
                            margin="dense"
                            id="capacity"
                            label="Capacity"
                            type="email"
                            fullWidth
                            variant="standard"
                            onChange={validateNumbers}
                            value={capacity || ''}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleAdd}>Add</Button>
                    </DialogActions>
                </Dialog>

            </div>
            }
            <Box display="inline-block">
                <Paper>
                    {(appointments != null) &&
                    !(deniedPermission) &&
                        <Scheduler
                            data={appointments}
                            firstDayOfWeek={1}
                            heigh={50}

                        >
                            <ViewState
                                currentDate={currentDate}
                                onCurrentDateChange={changeCurrentDate}
                            />
                            <WeekView
                                startDayHour={8}
                                endDayHour={23}
                            />
                            <Toolbar />
                            <DateNavigator />
                            <TodayButton />
                            <Appointments />
                            <AppointmentTooltip
                                headerComponent={Header}
                                contentComponent={Content}
                                commandButtonComponent={CommandButton}
                                showCloseButton
                            />
                        </Scheduler>
                    }
                </Paper>
            </Box>
        </>
    );
}
