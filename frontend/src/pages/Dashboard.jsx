import { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const USER_ID = user?.id;

  useEffect(() => {
    if (!USER_ID) return;

    axios.get(`${import.meta.env.VITE_API_URL}/api/register/${USER_ID}`)
      .then(res => {
        setMyEvents(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [USER_ID]);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 px-8 pb-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 border-l-4 border-primary-500 pl-4">
          My Registered Events
        </h2>

        {!loading && myEvents.length === 0 && (
          <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg mb-4">You haven't registered for any events yet.</p>
            <Link to="/events" className="text-primary-600 font-medium hover:text-primary-700 hover:underline">
              Browse Upcoming Events &rarr;
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {myEvents.map((reg, index) => (
            <div key={reg._id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <Card
                title={reg.eventId?.title || "Event Title"}
                description={reg.eventId?.description}
                footer={
                  <div className="w-full flex justify-between text-sm text-gray-500">
                    <span>📅 {reg.eventId?.date || 'TBA'}</span>
                    <span>📍 {reg.eventId?.venue || 'Campus'}</span>
                  </div>
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
