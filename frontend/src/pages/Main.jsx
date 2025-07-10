import React, { useEffect, useState } from "react";
import Home from "./Homepage";
import AboutPage from "./About";
import ContactUs from './ContactUs';
import AccidentMonitor from './AccidentMonitor'
import ProfilePage from "./Profile"
import Auth from "../components/Auth";
import { getUser, logout, setToken, setUser } from "../utils/api";
import ProfileDropdown from "../components/ProfileDropdown";
import useGeolocation from "../components/GeoLocation";

const Main = () => {
    const [currentPage, setCurrentPage] = useState("home"); 
    const [notification, setNotification] = useState(null); 
    const [showAuth, setShowAuth]       = useState(false);
    const [currentUser, setCurrentUser] = useState(getUser()); 
    const { location, error } = useGeolocation(true); // prompt on mount

  // you can put location into context or props if other components need it
    useEffect(() => {
        console.log("Current location:", location);
        if(!location) console.log("Geolocation error:", error);
    }, [location, error]);

    const renderPage = () => {
        switch (currentPage) {
            case "home":
                return <Home />;
            case "about":
                return <AboutPage />;
            case "contactUs":
                return <ContactUs />;
            case "accidentMonitor":
                return <AccidentMonitor notify={showTemporaryNotification} location={location} />;
            case "profile":
                return currentUser ? (
                    <ProfilePage userProfile={getUser()} />
                ) : (
                    <div className="w-full py-16 text-center text-lg text-gray-600">
                        Please log in first to view your profile.
                    </div>
                );
            default:
                return <Home />;
        }
    };

    // Called when Auth modal is closed
    const onClose = () => {
        setShowAuth(false);
        showTemporaryNotification("Authentication modal closed", "info");
    };

    // Called when user successfully logs in
    const onLoginSuccess = (userData) => {
        console.log("userData", userData);
        setToken(userData.access_token.access_token);       
        setUser(userData.access_token.user);                 
        setCurrentUser(userData.access_token.user);
        setShowAuth(false); // Close auth modal
        showTemporaryNotification(`Welcome back, ${userData.name || "User"}!`, "success");
    };

    // Display temporary notification
    const showTemporaryNotification = (message, type = "info") => {
        console.log("showTemporaryNotification", message, type);
        setNotification({ message, type });

        // Automatically hide after 5 seconds
        setTimeout(() => {
            setNotification(null);
        }, 5000);
    };

    return (
        <div className="min-h-screen bg-gray-100 font-inter py-5 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
            {/* Header Section */}
            <header className="w-full max-w-7xl bg-white p-5 rounded-2xl shadow-md flex justify-between items-center mb-8">

                {/* logo */}
                <div className="flex items-center space-x-2">
                    {/* Logo SVG */}
                    <svg
                        className="w-6 h-6 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 19C8.13 19 5 15.87 5 12C5 8.13 8.13 5 12 5C15.87 5 19 8.13 19 12C19 15.87 15.87 19 12 19ZM12 7L9 12H15L12 7Z" />
                    </svg>

                    <span className="font-bold text-xl text-gray-800">LogiGuardians</span>
                </div>

                {/* Navigation */}
                <nav className="hidden md:flex space-x-8 "> 
                    <button
                        onClick={() => setCurrentPage("home")}
                        className={`${ currentPage === "home" ? "text-blue-600 font-bold" : "text-gray-600 font-semibold"} 
                        hover:text-blue-800 transition-colors duration-200 cursor-pointer md:text-lg text-sm`}
                    >
                        Home
                    </button>
                    <button
                        onClick={() => setCurrentPage("about")}
                        className={`${ currentPage === "about" ? "text-blue-600 font-bold" : "text-gray-600 font-semibold"}  
                        hover:text-blue-800 transition-colors duration-200 cursor-pointer md:text-lg text-sm`}
                    >
                        About
                    </button>
                    <button
                        onClick={() => setCurrentPage("accidentMonitor")}
                        className={`${ currentPage === "accidentMonitor" ? "text-blue-600 font-bold" : "text-gray-600 font-semibold"} 
                        hover:text-blue-800 transition-colors duration-200 cursor-pointer md:text-lg text-sm`}
                    >
                        Accident Monitor
                    </button>
                    <button
                        onClick={() => setCurrentPage("contactUs")}
                        className={`${ currentPage === "contactUs" ? "text-blue-600 font-bold" : "text-gray-600 font-semibold"} 
                        hover:text-blue-800 transition-colors duration-200 cursor-pointer md:text-lg text-sm`}
                    >
                        Contact Us
                    </button>
                    <button
                        onClick={() => setCurrentPage("profile")}
                        className={`${ currentPage === "profile" ? "text-blue-600 font-bold" : "text-gray-600 font-semibold"} 
                        hover:text-blue-800 transition-colors duration-200 cursor-pointer md:text-lg text-sm`}
                    >
                        Profile
                    </button>
                </nav>

                {/* Login / Signup Button */}
                {currentUser ? (
                    <ProfileDropdown
                        currentUser={currentUser}
                        onLogout={() => {
                            logout();    
                            setCurrentUser(null);
                        }}
                    />
                ) : (
                    <button
                        onClick={() => setShowAuth(true)}
                        className="bg-orange-500 hover:bg-orange-600 cursor-pointer text-white font-semibold py-2 px-5 rounded-full shadow-md transition-colors duration-200"
                    >
                        Login / Signup
                    </button>
                )}

                {showAuth && (
                    <Auth
                        onClose={onClose}
                        onLoginSuccess={onLoginSuccess}
                        showTemporaryNotification={showTemporaryNotification}
                    />
                )}

            </header>

            {notification && (
                <div
                    className={`fixed top-5 z-50 rounded-lg px-4 py-2 shadow-lg transition-all duration-300
                    ${notification.type === "success" ? "bg-green-100 text-green-800" :
                    notification.type === "error" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}`}
                >
                    {notification.message}
                </div>
            )}

            {/* Page Content */}
            {renderPage()}

        </div>
    );
};

export default Main;
