import { useState, useEffect } from "react";
import axios from "axios";
import Button from "../../components/Button";

export default function ManageClubs() {
    const [clubs, setClubs] = useState([]);
    const [formData, setFormData] = useState({ name: "", description: "", recruiting: false });
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchClubs();
    }, []);

    const fetchClubs = async () => {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/clubs`);
        setClubs(res.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/clubs`, formData); // Assuming POST /api/clubs
            setFormData({ name: "", description: "", recruiting: false });
            setShowForm(false);
            fetchClubs();
            alert("Club created successfully!");
        } catch (err) {
            alert("Failed to create club");
        }
    };

    const toggleRecruitment = async (club) => {
        // This assumes an update endpoint exists or logic needs implementation
        // For now, let's assume we can PUT /api/clubs/:id
        // If not implemented in backend, this button might just be UI for now.
        // I will add a placeholder alert.
        alert("Toggle recruitment feature requires backend update endpoint. Assuming it exists for UI demo.");
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this club?")) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/clubs/${id}`);
            fetchClubs();
        } catch (err) {
            alert("Failed to delete club. API might not support delete yet.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-24 px-8 pb-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Manage Clubs</h2>
                    <Button onClick={() => setShowForm(!showForm)}>
                        {showForm ? "Cancel" : "+ Add New Club"}
                    </Button>
                </div>

                {showForm && (
                    <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 animate-fade-in border border-gray-100">
                        <h3 className="text-xl font-bold mb-4">Add New Club</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-secondary-500 outline-none transition"
                                placeholder="Club Name"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                            <textarea
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-secondary-500 outline-none transition"
                                placeholder="Description"
                                rows="3"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="recruiting"
                                    checked={formData.recruiting}
                                    onChange={e => setFormData({ ...formData, recruiting: e.target.checked })}
                                    className="w-4 h-4 text-secondary-600 rounded focus:ring-secondary-500"
                                />
                                <label htmlFor="recruiting" className="text-gray-700">Open for Recruitment?</label>
                            </div>
                            <Button type="submit" variant="secondary" className="w-full">Create Club</Button>
                        </form>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {clubs.map((club) => (
                        <div key={club._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                            <div className="flex justify-between items-start mb-4">
                                <h4 className="font-bold text-xl text-gray-800">{club.name}</h4>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${club.recruiting ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                    {club.recruiting ? 'Recruiting' : 'Closed'}
                                </span>
                            </div>
                            <p className="text-gray-600 mb-6 text-sm">{club.description}</p>
                            <div className="flex gap-2 justify-end">
                                <button
                                    onClick={() => handleDelete(club._id)}
                                    className="text-red-500 hover:bg-red-50 px-3 py-1.5 rounded text-sm transition font-medium"
                                >
                                    Delete Club
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
