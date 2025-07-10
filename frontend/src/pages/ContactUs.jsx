const ContactUsPage = () => {
    const teamMembers = [
        {
            name: "Aman Singh",
            role: "Project Lead & ML Integration",
            description: "Passionate about AI & ML,with a focus on real world applications in safety and automation.",
            image: "./aman.jpg", // Purple
            github: "https://github.com/AmanSingh-layman"
        },
        {
            name: "Nabin Agrawal",
            role: "Web Development Lead",
            description: "Skilled in creating seamless user experiences and robust system architectures",
            image: "./nabin.jpg", // Blue
            github: "https://github.com/nabinagrawal64"
        },
    ];

    return (
        <div className="p-8 md:p-5 animate-fade-in">
            <h2 className="text-4xl font-bold text-indigo-700 mb-8 text-center">
                Contact Us
            </h2>

            {/* text */}
            <p className="text-lg text-gray-700 mb-10 text-center leading-relaxed">
                We are a team of four dedicated individuals passionate about
                creating innovative solutions to real-world problems. Learn more
                about us and our contributions to the Smart Delivery Accident
                Response System.
            </p>

            {/* description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {teamMembers.map((member, index) => (
                    <div
                        key={index}
                        className="bg-indigo-50 rounded-xl shadow-lg p-6 flex flex-col items-center text-center transform transition duration-300 hover:scale-105 hover:shadow-xl"
                    >
                        <img
                            src={member.image}
                            alt={member.name}
                            className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-indigo-300 shadow-md"
                        />
                        <h3 className="text-2xl font-bold text-purple-800 mb-2">
                            {member.name}
                        </h3>
                        <p className="text-indigo-600 font-semibold mb-3">
                            {member.role}
                        </p>
                        <p className="text-gray-700 text-base leading-relaxed">
                            {member.description}
                        </p>
                        {/* github */}
                        <div className="mt-4 flex space-x-3">
                            <a
                                href={member.github}
                                className="text-gray-600 hover:text-blue-500 transition duration-300"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.417 2.865 8.163 6.837 9.504.499.09.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.474-1.11-1.474-.907-.655.07-.645.07-.645 1.007.07 1.532 1.03 1.532 1.03.89 1.529 2.341 1.085 2.91.828.092-.64.354-1.085.64-1.336-2.22-.253-4.555-1.119-4.555-4.931 0-1.09.39-1.984 1.029-2.683-.103-.253-.446-1.274.097-2.659 0 0 .84-.269 2.75 1.025A9.395 9.395 0 0112 6.838c.85.008 1.7.11 2.502.329 1.909-1.294 2.747-1.025 2.747-1.025.546 1.385.202 2.406.099 2.659.64.699 1.029 1.593 1.029 2.683 0 3.823-2.338 4.673-4.563 4.925.359.309.678.92.678 1.855 0 1.336-.012 2.417-.012 2.747 0 .268.18.581.687.482C21.137 20.17 24 16.42 24 12.017 24 6.484 19.522 2 12 2Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ContactUsPage;
