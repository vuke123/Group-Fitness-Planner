import React, { useMemo, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Rezervacija from './Pages/Rezervacija'
import Login from './Pages/Login'
import Registration from './Pages/Registration'
import ProfilePage from './Pages/ProfilePage'
import Homepage from './Pages/Homepage'
import Header from './Pages/Header';
import Users from './Pages/Users';
import { UserContext } from './UserContext';
import CoachRegistration from './Pages/CoachRegistration';
import {Navigate} from "react-router-dom"
import AllUsers from './Pages/AllUsers';

function App() {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  
  React.useEffect(() => {
    var userSessionStorage = sessionStorage.getItem("user")
    userSessionStorage = JSON.parse(userSessionStorage)
    if (userSessionStorage != null) {
      setUser(userSessionStorage)
      setLoading(false)
      setLoggedIn(true)
    }
  }, []);
  React.useEffect(() => {
    if(loggedIn == false) setLoading(false)

  });
  
  const value = useMemo(() => ({ user, setUser }), [user, setUser]);
  
  return (
    <>
      {loading ? <div>Loading...</div> : (
        <Router>
          <UserContext.Provider value={value}>
            <Header />
            <Routes>
              <Route path="/" element={<><Homepage /></>} />
              <Route path="/login" element={user==null?<Login />:<Navigate to="/profilepage"/>} />
              <Route path="/registration" element={user==null? <Registration />:<Navigate to="/profilepage" />} />
              <Route path="/profilepage" element={user!= null ? <ProfilePage />:<Navigate to="/login" />} />
              {user != null &&
              <>
              <Route path="/calendar" element={user.role == "trainer" || user.role == "user" ? <Rezervacija />:<Navigate to="/login"/>} />
              <Route path="/allusers" element={user.role == "admin" ? <AllUsers />:<Navigate to ="/profilepage" />} />
              <Route path="/users" element={user.role == "trainer" ? <Users />:<Navigate to="/profilepage" />} />
              <Route path="/trainerregistration" element={user.role == "admin" ? <CoachRegistration />:<Navigate to="/profilepage"/> } />
             </> }
             {user == null && 
             <>
              <Route path="/allusers" element={<Navigate to ="/login" />} />
              <Route path="/users" element={<Navigate to="/login" />} />
              <Route path="/trainerregistration" element={<Navigate to="/login" />} />
              <Route path="/calendar" element={<Navigate to="/login"/>} />
              <Route path="/profilepage" element={<Navigate to="/login" />} />
              <Route path="/*" element={<Navigate to="/registration" />} />
             </>}
            </Routes>
          </UserContext.Provider>
        </Router>
      )}
    </>
  );
  
}

export default App;
