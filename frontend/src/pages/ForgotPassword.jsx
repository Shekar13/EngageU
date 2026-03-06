import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Button from "../components/Button";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setMessage("");

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, { email });
            setMessage(res.data.msg);
        } catch (err) {
            setError(err.response?.data?.msg || "Failed to process request");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-50 to-purple-50 px-4 pt-20 md:pt-0">
            <div className="glass-card p-8 rounded-2xl w-full max-w-md animate-fade-in">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">Forgot Password</h2>
                    <p className="text-gray-500 mt-2">Enter your email to receive a reset link</p>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all duration-200"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full mt-2"
                        disabled={isLoading}
                    >
                        {isLoading ? "Sending..." : "Send Reset Link"}
                    </Button>
                </form>

                <p className="text-center mt-6 text-gray-600 text-sm">
                    Remember your password?{" "}
                    <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
