// ProfilePage.jsx  —  email read‑only, username/vehicle/driver editable, avatar upload
import { useState } from "react";
import { patchProfile, setUser, getUser } from "../utils/api"; // ✅ only import what you need

const Field = ({ label, readOnly = false, value, onChange, placeholder }) => (
    <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            readOnly={readOnly}
            className={`w-full px-4 py-2 rounded-lg border text-gray-800 shadow-sm transition-all duration-200 
                ${readOnly ? "bg-gray-100 cursor-not-allowed" : "focus:ring-2 focus:ring-blue-400"}`}
        />
    </div>
);

export default function ProfilePage() {
    const storedUser = getUser() || {};
    const [form, setForm] = useState(() => ({
        name:       storedUser.name      ?? "",
        email:      storedUser.email     ?? "",
        vehicleId:  storedUser.vehicleId ?? "",
        driverId:   storedUser.driverId  ?? "",
    }));

    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState("");

    if (!form.email)
        return (
            <p className="text-center p-8 text-gray-600">Loading profile…</p>
        );

    const handleChange = (field) => (e) =>
        setForm({ ...form, [field]: e.target.value });

    /* ------------ Save to backend via patchProfile helper ------------ */
    const handleSave = async () => {
        setSaving(true);
        console.log("form:", form)
        try {
            const result = await patchProfile({
                name: form.name,
                vehicleId: form.vehicleId,
                driverId: form.driverId,
            });

            console.log("patchProfile result:", result);
            setUser(result.user); 
            setMsg(result.msg || "Profile updated!");
        } catch (err) {
            setMsg(err.message || "Save failed");
        } finally {
            setSaving(false);
            setTimeout(() => setMsg(""), 2500);
        }
    };

    /* ------------ UI ------------ */
    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-lg shadow-xl rounded-3xl p-10 animate-fade-in-down transition-all duration-500">
                <h2 className="text-4xl font-extrabold text-center text-indigo-700 mb-10">
                    Your Profile
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                    {/* Avatar Card */}
                    <div className="flex flex-col items-center gap-6 relative">
                        <div className="w-36 h-36 rounded-full bg-indigo-200 text-indigo-700 flex items-center justify-center text-6xl font-bold border-4 border-indigo-500 shadow-lg">
                            {form.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-md w-full text-center">
                            <p className="text-sm text-gray-600 font-medium">Email</p>
                            <p className="text-md font-semibold text-gray-800">{form.email}</p>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-6">
                        <Field label="Full Name" value={form.name} onChange={handleChange("name")} />
                        <Field label="Vehicle ID" value={form.vehicleId} onChange={handleChange("vehicleId")} />
                        <Field label="Driver ID" value={form.driverId} onChange={handleChange("driverId")} />

                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className={`w-full py-3 mt-4 rounded-lg font-semibold text-white shadow-lg transition duration-300 
                                ${saving ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"}`}
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>

                        {msg && (
                            <div className="text-center text-green-700 font-medium">
                                {msg}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
