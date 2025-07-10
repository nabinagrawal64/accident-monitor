import { Shield, Cpu, Handshake, Contact } from "lucide-react";

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-gray-100 font-inter py-5 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
            {/* About Page Header */}
            <header className="w-full max-w-7xl bg-white p-5 rounded-2xl shadow-md flex justify-center items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                    About Our Real-Time Accident Detection System
                </h1>
            </header>

            {/* Hero/Introduction Section for About Page */}
            <section className="w-full max-w-7xl h-80 bg-[url('https://blog.falcony.io/hubfs/15%20Types%20of%20Safety%20Incidents%20in%20Logistics%20and%20Transportation.jpg')] bg-contain bg-center rounded-2xl flex items-center justify-center relative overflow-hidden mb-8">
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent rounded-2xl"></div>
                <div className="relative z-10 p-8 text-white text-center">
                    <h2 className="text-4xl font-bold mb-4">
                        Innovating Safety in Logistics
                    </h2>
                    <p className="text-lg max-w-2xl mx-auto text-white/90">
                        Our mission is to revolutionize logistics safety and
                        efficiency through cutting-edge technology, ensuring
                        timely responses and peace of mind for businesses and
                        customers alike.
                    </p>
                </div>
            </section>

            {/* Our Mission Section */}
            <section className="w-full max-w-7xl bg-white p-8 rounded-2xl shadow-lg mb-8">
                <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">
                    Our Mission
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed text-center max-w-3xl mx-auto">
                    To revolutionize logistics safety by providing an AI-powered accident response system that enables real-time detection, rapid alerting, and efficient reporting of vehicular incidents, ensuring the safety of drivers, protection of assets, and continuous trust of customers.
                </p>
            </section>


            {/* Our Values Section */}
            <section className="w-full max-w-7xl bg-white p-8 rounded-2xl shadow-lg mb-8">
                <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">
                    Our Core Values
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* 1. Safety First */}
                    <div className="flex flex-col items-center text-center p-6 bg-red-50 rounded-xl shadow-sm">
                        <Shield size={48} className="text-red-600 mb-4" />
                        <h4 className="text-xl font-semibold text-gray-800 mb-2">
                            Safety First
                        </h4>
                        <p className="text-gray-600 text-base">
                            Prioritizing the well-being of drivers and cargo
                            with real-time monitoring and proactive alerts.
                        </p>
                    </div>

                    {/* 2. Smart Automation */}
                    <div className="flex flex-col items-center text-center p-6 bg-indigo-50 rounded-xl shadow-sm">
                        <Cpu size={48} className="text-indigo-600 mb-4" />
                        <h4 className="text-xl font-semibold text-gray-800 mb-2">
                            Smart Automation
                        </h4>
                        <p className="text-gray-600 text-base">
                            Leveraging AI for intelligent detection, timely
                            decision-making, and operational efficiency.
                        </p>
                    </div>

                    {/* 3. Trust & Transparency */}
                    <div className="flex flex-col items-center text-center p-6 bg-green-50 rounded-xl shadow-sm">
                        <Handshake size={48} className="text-green-600 mb-4" />
                        <h4 className="text-xl font-semibold text-gray-800 mb-2">
                            Trust & Transparency
                        </h4>
                        <p className="text-gray-600 text-base">
                            Ensuring accountability and confidence through
                            accurate reporting and reliable data sharing.
                        </p>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="w-full max-w-7xl bg-white p-8 rounded-2xl shadow-lg text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    Want to Learn More?
                </h3>
                <p className="text-gray-700 text-lg mb-6">
                    Explore how our system can transform your logistics
                    operations.
                </p>
                <button 
                    className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-colors duration-200"
                    onClick={() => window.open("/Aroww-In.pdf", "_blank")}
                >
                    Learn more
                </button>

            </section>
        </div>
    );
};

export default AboutPage;
