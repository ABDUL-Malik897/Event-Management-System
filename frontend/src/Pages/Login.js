import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../api/api'
import useAuthContext from '../hooks/useAuthContext'

const Login = () => {

    const navigate = useNavigate()
    const { dispatch } = useAuthContext()
    const [formData, setFormData] = useState({
        email :"",
        password : ""
    })
    const [loading ,setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev, [e.target.name] : e.target.value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            const response = await API.post("/auth/login", formData)
            const authData = {
                token  : response.data.token,
                user : response.data.user
            }
            localStorage.setItem("user",JSON.stringify(authData))
            dispatch({
                type : "LOGIN",
                payload : authData
            })
            navigate("/")
        } catch (error) {
            alert(error.response?.data?.message || "Login Failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ maxWidth:"40vh" , margin:"5vh auto"}}>
            <h1>Login Page</h1>
            <form onSubmit={handleSubmit}>
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
                        loading ? "Loggin in..." : "Login"
                    }
                </button>
            </form>
            <br />
            <p>
                Don't have an account? <Link to='/signup'>Signup</Link>
            </p>
        </div>
    )
}

export default Login;