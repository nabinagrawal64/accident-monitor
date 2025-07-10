import React, { useState, useRef, useEffect } from "react";
import { UserCircle } from "lucide-react";
// import { clearToken } from "../utils/api";

function ProfileDropdown({ currentUser, onLogout }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    // close when clicking outside
    useEffect(() => {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-2 text-indigo-700 focus:outline-none"
            >
                <UserCircle className="w-7 h-7" />
                <span className="hidden md:inline">{currentUser.name}</span>
            </button>
        
            {open && (
                <div className="absolute right-0 mt-3 w-40 bg-white rounded-lg shadow-lg py-2 z-50">
                    <button
                        onClick={() => {
                            onLogout();
                            setOpen(false);
                        }}
                        className="block w-full cursor-pointer text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}

export default ProfileDropdown;