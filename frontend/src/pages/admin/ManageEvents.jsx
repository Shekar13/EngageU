import { useState, useEffect } from "react";
import axios from "axios";
import Button from "../../components/Button";

export default function ManageEvents() {
    const [events, setEvents] = useState([]);
    const [clubs, setClubs] = useState([]);
    const [formData, setFormData] = useState({ title: "", description: "", date: "", venue: "", clubId: "" });
    const [showForm, setShowForm] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [eventsRes, clubsRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL}/api/events`),
                axios.get(`${import.meta.env.VITE_API_URL}/api/clubs`)
            ]);

            let fetchedClubs = clubsRes.data;
            let fetchedEvents = eventsRes.data;

            if (user && user.role === "club_admin") {
                fetchedClubs = fetchedClubs.filter(c => c.admins && c.admins.includes(user.id));

                const myClubIds = fetchedClubs.map(c => c._id);
                fetchedEvents = fetchedEvents.filter(e => myClubIds.includes(e.clubId));
            }

            setClubs(fetchedClubs);
            setEvents(fetchedEvents);

            // Default form clubId if list is empty
            if (user?.role === "club_admin" && fetchedClubs.length > 0) {
                setFormData(prev => ({ ...prev, clubId: fetchedClubs[0]._id }));
            }
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/events`, formData, {
                headers: { userid: user?.id }
            });
            setFormData({ title: "", description: "", date: "", venue: "", clubId: clubs.length > 0 && user?.role === "club_admin" ? clubs[0]._id : "" });
            setShowForm(false);
            fetchData();
            alert("Event created successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to create event");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this event?")) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/events/${id}`, {
                headers: { userid: user?.id }
            });
            fetchData();
        } catch (err) {
            alert("Failed to delete event. API might not support delete yet.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-20 md:pt-24 px-4 md:px-8 pb-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Manage Events</h2>
                    <Button onClick={() => setShowForm(!showForm)}>
                        {showForm ? "Cancel" : "+ Add New Event"}
                    </Button>
                </div>

                {showForm && (
                    <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 animate-fade-in border border-gray-100">
                        <h3 className="text-xl font-bold mb-4">Create New Event</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition"
                                placeholder="Event Title"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                            <textarea
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition"
                                placeholder="Description"
                                rows="3"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition"
                                    placeholder="Date (e.g., 25th March, 2026)"
                                    value={formData.date}
                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                                <input
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition"
                                    placeholder="Venue"
                                    value={formData.venue}
                                    onChange={e => setFormData({ ...formData, venue: e.target.value })}
                                    required
                                />
                            </div>

                            <select
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition bg-white"
                                value={formData.clubId || ""}
                                onChange={e => setFormData({ ...formData, clubId: e.target.value })}
                                required
                            >
                                <option value="" disabled>Select Associated Club</option>
                                {clubs.map(c => (
                                    <option key={c._id} value={c._id}>{c.name}</option>
                                ))}
                            </select>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input
                                    type="number"
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition"
                                    placeholder="Max Capacity (0 for unlimited)"
                                    value={formData.maxCapacity || ""}
                                    onChange={e => setFormData({ ...formData, maxCapacity: e.target.value })}
                                />
                                <div className="flex items-center gap-2 p-3 border rounded-lg">
                                    <input
                                        type="checkbox"
                                        id="isPaid"
                                        checked={formData.isPaid}
                                        onChange={e => setFormData({ ...formData, isPaid: e.target.checked })}
                                        className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                                    />
                                    <label htmlFor="isPaid" className="text-gray-700">Paid Event?</label>
                                </div>
                                {formData.isPaid && (
                                    <input
                                        type="number"
                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition"
                                        placeholder="Price (₹)"
                                        value={formData.price || ""}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                    />
                                )}
                            </div>
                            <Button type="submit" className="w-full">Create Event</Button>
                        </form>
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="text-left">
                        {events.map((event) => (
                            <div key={event._id} className="p-4 border-b last:border-b-0 hover:bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center transition gap-2">
                                <div>
                                    <h4 className="font-bold text-lg text-gray-800 break-words">{event.title}</h4>
                                    <p className="text-gray-500 text-sm">{event.date} • {event.venue}</p>
                                </div>
                                <button
                                    onClick={() => handleDelete(event._id)}
                                    className="text-red-500 hover:text-red-700 font-medium text-sm px-3 py-1 rounded hover:bg-red-50 transition self-end sm:self-auto"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                        {events.length === 0 && <p className="p-8 text-center text-gray-400">No events found.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
