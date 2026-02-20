import { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card";
import Button from "../components/Button";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeredEventIds, setRegisteredEventIds] = useState(new Set());

  const user = JSON.parse(localStorage.getItem("user"));
  const USER_ID = user?.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/events`);
        setEvents(eventsRes.data);

        if (USER_ID) {
          const regRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/register/${USER_ID}`);
          const regIds = new Set(regRes.data.map(reg => reg.eventId._id));
          setRegisteredEventIds(regIds);
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [USER_ID]);

  const registerEvent = async (eventId) => {
    if (!USER_ID) {
      alert("Please login to register for events");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/register`, {
        userId: USER_ID,
        eventId
      });

      // Update local state to reflect registration immediately
      setRegisteredEventIds(prev => new Set(prev).add(eventId));

      // Refresh events to update spot count
      const eventsRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/events`);
      setEvents(eventsRes.data);

      alert("Registered Successfully 🎉");
    } catch (err) {
      alert(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 px-8 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600 mb-4 animate-fade-in">
            Upcoming Events
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto animate-slide-up">
            Explore and participate in the diverse range of events happening at CBIT.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => {
              const isRegistered = registeredEventIds.has(event._id);

              return (
                <div key={event._id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <Card
                    title={event.title}
                    description={event.description}
                    footer={
                      <div className="w-full">
                        <div className="flex justify-between text-xs text-gray-500 mb-2">
                          <span>📅 {event.date || 'TBA'}</span>
                          <span>📍 {event.venue || 'Campus'}</span>
                        </div>

                        <div className="flex justify-between items-center mb-4">
                          <span className={`text-sm font-bold ${event.isPaid ? 'text-green-600' : 'text-gray-600'}`}>
                            {event.isPaid ? `₹${event.price}` : 'Free'}
                          </span>
                          {event.maxCapacity > 0 && (
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${event.registeredCount >= event.maxCapacity
                              ? 'bg-red-100 text-red-600'
                              : 'bg-blue-50 text-blue-600'
                              }`}>
                              {event.registeredCount >= event.maxCapacity
                                ? 'Sold Out'
                                : `${event.maxCapacity - event.registeredCount} spots left`}
                            </span>
                          )}
                        </div>

                        <Button
                          onClick={() => {
                            if (isRegistered || (event.maxCapacity > 0 && event.registeredCount >= event.maxCapacity)) return;
                            if (event.isPaid) {
                              if (window.confirm(`Proceed to pay ₹${event.price} for ${event.title}?`)) {
                                // Mock payment logic
                                registerEvent(event._id);
                              }
                            } else {
                              registerEvent(event._id);
                            }
                          }}
                          variant={isRegistered ? "secondary" : "primary"}
                          className={`w-full ${isRegistered
                            ? "bg-green-50 text-green-600 border-green-200 cursor-default hover:shadow-none hover:translate-y-0"
                            : (event.maxCapacity > 0 && event.registeredCount >= event.maxCapacity)
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed hover:shadow-none hover:translate-y-0"
                              : ""
                            }`}
                          disabled={isRegistered || (event.maxCapacity > 0 && event.registeredCount >= event.maxCapacity)}
                        >
                          {isRegistered
                            ? "Registered"
                            : (event.maxCapacity > 0 && event.registeredCount >= event.maxCapacity)
                              ? "Sold Out"
                              : event.isPaid ? `Pay & Register` : "Register Now"}
                        </Button>
                      </div>
                    }
                  />
                </div>
              );
            })}
          </div>
        )}

        {!loading && events.length === 0 && (
          <div className="text-center py-20 bg-white/50 rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500">No upcoming events found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
