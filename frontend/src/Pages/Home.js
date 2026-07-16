import React from 'react';
import useAuthContext from "../hooks/useAuthContext"

const Home = () => {

const { user } = useAuthContext();

    return (
        <h1>{user ? user.user.username : "Guest"}</h1>
    )
}

export default Home