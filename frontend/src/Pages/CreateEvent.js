import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import API from '../api/api';

const CreateEvent = () => {

    const navigate = useNavigate()
    const [formData , setFormData] = useState({
        title : "",
        description: "",
        category: "Other",
        date: "",
        time: "",
        venue: "",
        city: "",
        ticketPrice: "",
        totalSeats: "",
        banner: "",
    })
    const [loading ,setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev , [e.target.name] : e.target.value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const user  = JSON.parse(localStorage.getItem("user"))
            const response = await API.post("/events", formData , {
                headers : {
                    Authorization : `Bearer ${user.token}`
                }
            })
            alert(response.data.message)
            navigate("/")
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ width:"50vh", margin:"3vh auto"}}>
            <h1>CreateEvent</h1>
            <form onSubmit={handleSubmit}>
                <input 
                    type='text'
                    name='title'
                    placeholder='Event Title'
                    value={formData.title}
                    onChange={handleChange}
                />
                <br /><br />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleChange}
                />
                <br /><br />
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                >
                <option>Music</option>
                <option>Sports</option>
                <option>Workshop</option>
                <option>Conference</option>
                <option>Festival</option>
                <option>College</option>
                <option>Other</option>
                </select>
                <br /><br />
                <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                />
                <br /><br />
                <input
                    type="text"
                    name="time"
                    placeholder="10:00 AM"
                    value={formData.time}
                    onChange={handleChange}
                />
                <br /><br />
                <input
                    type="text"
                    name="venue"
                    placeholder="Venue"
                    value={formData.venue}
                    onChange={handleChange}
                />
                <br /><br />
                <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                />
                <br /><br />
                <input
                    type="number"
                    name="ticketPrice"
                    placeholder="Ticket Price"
                        value={formData.ticketPrice}
                    onChange={handleChange}
                />
                <br /><br />
                <input
                    type="number"
                    name="totalSeats"
                    placeholder="Total Seats"
                    value={formData.totalSeats}
                    onChange={handleChange}
                />
                <br /><br />
                <input
                    type="text"
                    name="banner"
                    placeholder="Banner URL"
                    value={formData.banner}
                    onChange={handleChange}
                />
                <br /><br />
                <button disabled={loading}>
                    {
                        loading ? "Creating..." : "Create Event"
                    }
                </button>
            </form>
        </div>
    )
}

export default CreateEvent