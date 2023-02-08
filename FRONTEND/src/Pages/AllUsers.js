import React, { useEffect, useState } from "react";
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Typography from '@mui/joy/Typography';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import axios from "axios";

function AllUsers() {

    const [allusers, setAllUsers] = React.useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/api/allusers')
            .then(res => {
                console.log(res.data)
                setAllUsers(res.data)
            })
            .catch(err => {
                console.log(err);
            })
    }, [])

    let userList = []
    let trainerList = []
    allusers.forEach((user, index) => {
        if (user.role == "user") {
            userList.push(
                <ListItem key={index}>
                    <ListItemDecorator sx={{ alignSelf: 'flex-start' }}>
                        <Avatar>
                            <AccountCircleOutlinedIcon sx={{ color: "#1976d2" }} />
                        </Avatar>
                    </ListItemDecorator>
                    <ListItemContent>
                        <Typography fontWeight="xl">{user.username}</Typography>
                    </ListItemContent>
                </ListItem>
            )
        }
        else if (user.role == "trainer") {
            trainerList.push(
                <ListItem key={index}>
                    <ListItemDecorator sx={{ alignSelf: 'flex-start' }}>
                        <Avatar>
                            <AccountCircleOutlinedIcon sx={{ color: "#1976d2" }} />
                        </Avatar>
                    </ListItemDecorator>
                    <ListItemContent>
                        <Typography fontWeight="xl">{user.username}</Typography>
                    </ListItemContent>
                </ListItem>
            )
        }
    })

    return (

        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                width: 800,
                margin: 'auto',
                flexDirection: 'column',
                marginTop: "50px"
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
                    marginBottom: '20px'
                }}
            >
                {userList}
            </List>
            <Typography
                level="body4"
                textTransform="uppercase"
                fontWeight="xl"
                mb={1}
                sx={{ letterSpacing: '0.15rem', margin: "10px" }}
            >
                Coaches
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
                {trainerList}
            </List>
        </Box>

    );

}

export default AllUsers;