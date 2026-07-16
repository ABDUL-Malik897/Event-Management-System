import React, { useState } from 'react';
import API from "../api/api";
import useAuthContext from "../hooks/useAuthContext";
import { useNavigate , Link } from "react-router-dom";

const Signup = () => {

    const navigate = useNavigate()
    const { dispatch } = useAuthContext()
    const [formData, setFormData] = useState({
        username: "",
        email : "",
        password : ""
    })
    const [loading , setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,[e.target.name] : e.target.value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            const response = await API.post("/auth/signup" ,formData);
            const authData = {
                token : response.data.token,
                user : response.data.user
            }
            localStorage.setItem("user", JSON.stringify(authData))
            dispatch({
                type : "LOGIN",
                payload : authData
            })
            navigate("/")
        } catch (error) {
            alert(error.response?.data?.message ||"Something went Wrong");
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{maxWidth : "40vh", margin : "5vh auto" }}>
            <h1>Signup</h1>
            <form onSubmit={handleSubmit}>
                <input 
                    type='text'
                    name='username'
                    placeholder='Username...'
                    value={formData.username}
                    onChange={handleChange}
                />
                <br />
                <br />
                <input 
                    type='email'
                    name='email'
                    placeholder='Email...'
                    value={formData.email}
                    onChange={handleChange}
                />
                <br />
                <br />
                <input 
                    type='password'
                    name='password'
                    placeholder='Password'
                    value={formData.password}
                    onChange={handleChange}
                />
                <br />
                <br />
                <button type='submit' disabled={loading}>
                    {
                        loading ? "Creating..." : "Signup"
                    }
                </button>
            </form>
            <br />
            <p>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    )
};

export default Signup;