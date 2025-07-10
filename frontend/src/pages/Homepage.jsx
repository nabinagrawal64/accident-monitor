import { Settings, Box } from "lucide-react"; // Importing icons from lucide-react
import { Shield, Truck, AlertTriangle, Activity } from "lucide-react";
const Home = () => {
    
    const features = [
        {
            title: "Real-Time Accident Detection",
            description: "AI-powered monitoring detects accidents instantly, improving driver safety and reducing response time.",
            icon: <Activity size={28} className="text-white" />,
            cardBg: "bg-[#d4edda]",  // Light green
            iconBg: "bg-[#28a745]",  // Green
        },
        {
            title: "Instant Emergency Alerts",
            description: "Automatic emergency notifications with location data help dispatch services act without delay.",
            icon: <AlertTriangle size={28} className="text-white" />,
            cardBg: "bg-[#ffeeba]",  // Light yellow
            iconBg: "bg-[#ffc107]",  // Orange
        },
        {
            title: "Fleet Safety Optimization",
            description: "Real-time tracking and accident insights boost safety and reduce logistics disruptions.",
            icon: <Shield size={28} className="text-white" />,
            cardBg: "bg-[#cfe2f3]",  // Light blue
            iconBg: "bg-[#007bff]",  // Blue
        },
        {
            title: "Delivery Efficiency Boost",
            description: "Minimize delays, reduce costs, and improve customer satisfaction with smart incident handling.",
            icon: <Truck size={28} className="text-white" />,
            cardBg: "bg-[#f8d7da]",  // Light red
            iconBg: "bg-[#dc3545]",  // Red
        }
    ]

    return( 
        <div className="bg-white rounded-2xl p-5">
            {/* Hero Section */}
            <section className="w-full max-w-7xl h-96 bg-[url('https://png.pngtree.com/background/20230427/original/pngtree-delivery-truck-in-motion-driving-down-a-street-picture-image_2495825.jpg')] bg-cover opacity-95 bg-center rounded-2xl flex items-center relative overflow-hidden mb-8">
                {/* Overlay for darkening the image */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent/60 rounded-2xl"></div>
                <div className="relative z-10 p-8 pl-16 text-white">
                    
                {/* Yellow underline */}
                <div className="w-16 h-1 bg-yellow-400 mb-3 rounded-full"></div>
                    <h1 className="text-5xl font-extrabold mb-2 leading-tight">
                        LogiGuardians
                    </h1>
                    <h2 className="text-4xl font-semibold leading-tight">
                        |Real-Time Accident Detection System
                    </h2>
                </div>
            </section>

            {/* Feature Section (overlapping) */}
            <section className="relative mx-auto w-[96%] max-w-7xl -mt-20 z-20 bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-8">
                    Seamless Integration
                </h3>

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6  mx-auto mt-10">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`flex justify-between items-center p-6 rounded-xl shadow-md ${feature.cardBg}`}
                        >   
                            {/* Left text section */}
                            <div>
                                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                                    {feature.title}
                                </h4>
                                <p className="text-gray-500 text-base">{feature.description}</p>
                            </div>

                            { /* Right icon section */}
                            <div
                                className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center ${feature.iconBg}`}
                            >
                                {feature.icon}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
export default Home;
