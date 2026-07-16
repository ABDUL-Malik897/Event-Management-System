import React, { useCallback, useEffect, useState, useRef } from 'react'
import { useParams } from "react-router-dom";
import API from "../api/api"
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const TicketDetails = () => {

    const { id } = useParams()
    const [booking , setBooking] = useState(null)
    const [loading ,setLoading] = useState(true)
    const ticketRef = useRef()

    const fetchBooking = useCallback(
        async () => {
        try {
            const response = await API.get("/booking/my")
            const current = response.data.bookings.find(booking => booking._id === id)
            setBooking(current)
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    },[id])

    useEffect(() => {
        fetchBooking()
    },[fetchBooking])

    if (loading) {
        return <h2>Loading...</h2>
    }
    if (!booking) {
        return <h2>Booking Not Found</h2>
    }

    const downloadTicket = async () => {
        const element = ticketRef.current
        const canvas = await html2canvas(element)
        const imgData = canvas.toDataURL("image/png")
        const pdf = new jsPDF("p", "mm", "a4")
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const imgHeight = (canvas.height * pdfWidth) / canvas.width
        pdf.addImage(imgData,"PNG",0,0,pdfWidth,imgHeight)
        pdf.save(`${booking.event.title}.pdf`)
    }

    return (
        <div  ref={ticketRef} style={{ width:"80%",margin:"3vh auto"}}>
            <img
                src={booking.event.banner || "https://via.placeholder.com/800x300"}
                alt=''
                width='100%'
                height='300'
            />
            <h1>{booking.event.title}</h1>
            <p>Venue : {booking.event.venue}</p>
            <p>Date : {new Date(booking.event.date).toLocaleDateString()}</p>
            <hr />
            <h2>Tickets</h2>
            {
                booking.tickets.map((ticket, index) => (
                    <div key={index} style={{ border: "1px solid gray", marginBottom : "2vh" , padding : "2vh"}}>
                        <h3>Ticket #{index + 1}</h3>
                        <img
                            src={ticket.qrCode}
                            width='200'
                            alt=''
                        />
                        <p>
                            Checked In : {
                                ticket.checkedIn ? "Yes" : "No"
                            }
                        </p>
                        <p>
                            Seat : {
                                ticket.seatNumber || "Not Assigned"
                            }
                        </p>
                        <button onClick={downloadTicket}>Download Ticket</button>
                    </div>
                ))
            }
        </div>
    )
}

export default TicketDetails