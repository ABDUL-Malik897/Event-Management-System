import { BrowserRouter , Routes ,Route } from "react-router-dom";
import NotFound from "./Pages/NotFound";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import CreateEvent from "./Pages/CreateEvent";
import AllEvents from "./Pages/AllEvents";
import EventDetails from "./Pages/EventDetails";
import MyBooking from "./Pages/MyBooking";
import TicketDetails from "./Pages/TicketDetails";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/signup" element={<Signup />}/>
        <Route path="/create-event" element={<CreateEvent />}/>
        <Route path="/my-booking" element={<MyBooking />}/>
        <Route path="/events/:id" element={<EventDetails />}/>
        <Route path="/events" element={<AllEvents />}/>
        <Route path="/ticket/:id" element={<TicketDetails />}/>
        <Route path="*" element={<NotFound />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
