import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { getToken } from "../utils/api";

const FPS = 2; // how many frames / sec sent to backend
const CONSECUTIVE_N = 5; // 5 ones in a row triggers alert
const PRED_ENDPOINT = "http://localhost:8000/predict";
const REPORT_ENDPOINT = "http://localhost:8000/report-accident";
const STOP_WEB_ENDPOINT = "http://localhost:8000/stop-webcam";

export default function ActivatePanicButton({ notify, location }) {
    const [active, setActive] = useState(false);
    const [counter, setCounter] = useState(0);
    const camRef = useRef(null);
    const token = getToken();
    console.log("token:", token);

    useEffect(() => {
        if (location) return;                 // got it → nothing to do

        const id = setTimeout(() => {
        notify("Location unavailable", "error");   // now outside render
        }, 5000); 

        return () => clearTimeout(id);
    }, [location, notify]);

    // ask cam + gps
    const startMonitoring = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ video: true });
            setActive(true);
        } catch (err) {
            notify("Camera permission denied", err);
        }
    };

    const triggerAccident = async () => {
        if (!location) {
            notify("Location unavailable", "error");
            return;
        }
        const body = {
            lat: location.lat,
            lng: location.lng,
            timestamp: new Date().toISOString(),
        };
        try {
            const res = await fetch(REPORT_ENDPOINT, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });
            console.log("report res:", res);
            if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
            notify("🚨 Accident detected! Authorities notified.", "Please help me!")
            setCounter(0); // reset after reporting
        } catch (err) {
            console.error("Error reporting accident:", err);
            notify("Failed to report accident", "error");
        }
    }

    const deActivate = async() => {
        setActive(false);
        setCounter(0);

        if (camRef.current && camRef.current.video?.srcObject) {
            const stream = camRef.current.video.srcObject;
            const tracks = stream.getTracks();

            tracks.forEach((track) => track.stop()); // 💥 Stop webcam stream
            camRef.current.video.srcObject = null;    // Unlink video
        }
        try {
            const res = await fetch(STOP_WEB_ENDPOINT, {
                method: "POST",
            });
            const data = await res.json();
            console.log("Stop webcam response:", data);
        } catch (err) {
            console.error("Failed to stop webcam on backend:", err);
        }
    };

    // capture + send frames
    useEffect(() => {
        if (!active) return;
        const interval = setInterval(async () => {
            if (!camRef.current) return;
            const imageSrc = camRef.current.getScreenshot();
            if (!imageSrc) return;

            const blob = await (await fetch(imageSrc)).blob();
            const form = new FormData();
            form.append("file", blob, "frame.jpg");

            try {
                const res = await fetch(PRED_ENDPOINT, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,   // ✅ FIX: attach token
                    },
                    body: form,
                });
                const { pred } = await res.json();

                setCounter((c) => {
                    const next = pred === 1 ? c + 1 : 0;
                    if (next >= CONSECUTIVE_N) triggerAccident();
                    return next;
                });
            } catch (e) {
                console.error("predict err", e);
            }
        }, 1000 / FPS);
        return () => clearInterval(interval);
    }, [token, active]); 

    return (
        <>  
            {!active &&
                <button
                    onClick={startMonitoring}
                    className="px-6 py-3 bg-red-600 text-white rounded-full shadow-md"
                >
                    Activate Monitoring Button
                </button>
            }
            
            {active && (
                <div className="flex flex-col gap-10">
                    <div className="mt-4">
                        <Webcam
                            ref={camRef}
                            screenshotFormat="image/jpeg"
                            audio={false}
                            className="w-64 h-48 rounded-md border"
                        />
                        <p className="text-sm mt-2 text-gray-600">
                            Consecutive accident frames: {counter}/{CONSECUTIVE_N}
                        </p>
                    </div>
                    <button
                        onClick={deActivate} // ❗️Always deactivates
                        className="px-2 py-2 bg-red-600 text-white rounded-full shadow-md"
                    >
                        Quit
                    </button>
                </div>
            )}
        </>
    );
}
