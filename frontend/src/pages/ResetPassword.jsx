import { useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import Button from "../components/Button";

export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setMessage("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/reset-password/${token}`, { password });
            setMessage(res.data.msg);

            // Redirect to login after 3 seconds on success
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.msg || "Failed to reset password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-50 to-purple-50 px-4 pt-20 md:pt-0">
            <div className="glass-card p-8 rounded-2xl w-full max-w-md animate-fade-in">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">Reset Password</h2>
                    <p className="text-gray-500 mt-2">Enter your new password below</p>
                </div>

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

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all duration-200"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                        className="w-full mt-2"
                        disabled={isLoading || message !== ""}
                    >
                        {isLoading ? "Resetting..." : "Reset Password"}
                    </Button>
                </form>

                <p className="text-center mt-6 text-gray-600 text-sm">
                    <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold hover:underline">
                        Back to Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
