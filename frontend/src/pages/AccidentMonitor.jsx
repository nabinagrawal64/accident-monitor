// src/pages/AccidentMonitorPage.jsx
import { useEffect, useState } from "react";
import ActivatePanicButton from "../components/ActivatePanicButton";
import { getToken } from "../utils/api"; // helper you made earlier

const ACC_ENDPOINT =
    import.meta.env.VITE_ACC_ENDPOINT || "https://accident-monitor.onrender.com/accidents";
const POLL_MS = 15_000; // 15‑second refresh

export default function AccidentMonitorPage({ notify, location }) {
    const [accidents, setAccidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /* ───────── fetch helper ─────────────────────────────────────────── */
    const fetchAccidents = async () => {
        try {
            setLoading(true);
            const r = await fetch(ACC_ENDPOINT, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
            const data = await r.json();
            setAccidents(data);
            setError(null);
        } catch (err) {
            setError("Unable to fetch accident data. " + err.message);
        } finally {
            setLoading(false);
        }
    };

    /* ───────── initial & interval fetch ─────────────────────────────── */
    useEffect(() => {
        fetchAccidents(); // first hit
        const id = setInterval(fetchAccidents, POLL_MS);
        return () => clearInterval(id); // cleanup on unmount
    }, []);

    /* ───────── UI ───────────────────────────────────────────────────── */
    return (
        <div className="p-8 md:p-12 animate-fade-in">
            <h2 className="text-4xl font-bold text-indigo-700 mb-8 text-center">
                Accident Monitor AI Dashboard
            </h2>

            <p className="text-lg text-gray-700 mb-6 text-center leading-relaxed">
                Real-time monitoring of delivery‑vehicle incidents. The AI model
                detects accidents automatically and helps trigger rapid
                response.
            </p>

            {/* button */}
            <div className="flex flex-col-reverse justify-center items-center gap-6 mb-10">
                <ActivatePanicButton notify={notify} location={location} />
            </div>

            {/* Table */}
            {!loading && !error && (
                <div className="overflow-x-auto rounded-lg shadow-xl border border-gray-200">
                    {accidents.length > 0 ? (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-indigo-100">
                                <tr>
                                    {[
                                        "Incident ID",
                                        "Vehicle ID",
                                        "Driver ID",
                                        "Location",
                                        "Timestamp",
                                        "Status",
                                        "Damage / Notes",
                                    ].map((h, i) => (
                                        <th
                                            key={h}
                                            scope="col"
                                            className={`px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider ${
                                                i === 0
                                                    ? "rounded-tl-lg"
                                                    : i === 6
                                                    ? "rounded-tr-lg"
                                                    : ""
                                            }`}
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {accidents.map((a) => (
                                    <tr
                                        key={a.id}
                                        className="hover:bg-gray-50 transition duration-150"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {a.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {a.vehicleId}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {a.driverId}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {a.location}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {new Date(
                                                a.timestamp
                                            ).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    a.status === "Reported"
                                                        ? "bg-orange-100 text-orange-800"
                                                        : a.status ===
                                                          "Detected"
                                                        ? "bg-red-100 text-red-800"
                                                        : "bg-green-100 text-green-800"
                                                }`}
                                            >
                                                {a.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {a.damage || a.notes}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-center text-gray-600 p-8 text-lg">
                            No accident incidents to display. Simulate one!
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
