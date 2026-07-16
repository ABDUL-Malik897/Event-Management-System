import React, { useEffect, useState } from 'react'
import API from "../api/api"
import EventCard from '../components/EventCard'

const AllEvents = () => {

    const [events , setEvent] = useState([])
    const [loading ,setLoading] = useState(true)

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await API.get("/events")
                setEvent(response.data.events)
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false)
            }
        }
        fetchEvents()
    },[])
    if (loading) {
        return <h2>Loading.....</h2>
    }

    return (
        <div style={{ width:"80%",margin:"3vh auto"}}>
            <h1>All Events</h1>
            {
                events.length === 0 ? (
                    <h2>No Events Found</h2>
                ) : (
                events.map((event) => (
                    <EventCard
                        key={event._id}
                        event={event}
                    />
                )))
            }
        </div>
    )
}

export default AllEvents