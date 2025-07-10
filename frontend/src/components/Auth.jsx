import { useState } from "react";
import { signup, login, setToken } from "../utils/api";

const AuthModal = ({ onClose, onLoginSuccess, showTemporaryNotification }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleAuth = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // login or signup based on current mode
            const data = isLogin
                ? await login(email, password)
                : await signup(email, password);
            
                console.log("data", data);

            if (data) {
                setToken(data.access_token);
                onLoginSuccess?.({ email, access_token: data });
                showTemporaryNotification?.(
                    isLogin ? "Logged in!" : "Account created & logged in!",
                    "success"
                );
                onClose();
            } else {
                setError(data?.detail || "Something went wrong.");
            }
        } catch (err) {
            setError(err.message || "Network error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in-up">
                {/* cross button */}
                <button
                    onClick={onClose}
                    className="absolute cursor-pointer top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold"
                >
                    &times;
                </button>

                {/* text */}
                <h2 className="text-3xl font-bold text-center text-indigo-700 mb-8">
                    {isLogin ? "Login" : "Sign Up"}
                </h2>

                {/* form */}
                <form onSubmit={handleAuth} className="space-y-6">
                    {/* email */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>

                    {/* password */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-center text-sm italic">{error}</p>
                    )}

                    {/* submit button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 cursor-pointer rounded-lg text-white font-semibold shadow-md transition ${
                            loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-indigo-600 hover:bg-indigo-700"
                        }`}
                    >
                        {loading ? "Please wait…" : isLogin ? "Login" : "Create Account"}
                    </button>
                </form>
                
                {/* toggle link */}
                <div className="text-center mt-6">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-indigo-600 hover:text-indigo-800 cursor-pointer font-semibold text-sm"
                    >
                        {isLogin
                            ? "Don't have an account? Sign Up"
                            : "Already have an account? Login"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
