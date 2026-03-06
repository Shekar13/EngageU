import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

export default function ChangePassword() {
    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setMessage("");

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match");
            setIsLoading(false);
            return;
        }

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/auth/change-password`,
                { currentPassword, newPassword },
                { headers: { userid: user?.id } }
            );
            setMessage(res.data.msg);

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            // Optional: Redirect to dashboard after a bit
            setTimeout(() => {
                navigate("/dashboard");
            }, 3000);

        } catch (err) {
            setError(err.response?.data?.msg || "Failed to change password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-20 md:pt-24 px-4 md:px-8 pb-12 flex justify-center items-start">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md mt-10 animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Change Password</h2>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm flex items-center">
                        <svg className="w-5 h-5 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        {error}
                    </div>
                )}

                {message && (
                    <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-6 text-sm flex items-center">
                        <svg className="w-5 h-5 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all duration-200"
                            placeholder="••••••••"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all duration-200"
                            placeholder="••••••••"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            minLength="6"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all duration-200"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength="6"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full mt-4"
                        disabled={isLoading}
                    >
                        {isLoading ? "Updating..." : "Change Password"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
