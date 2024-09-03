import React from "react";

function Landing() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full text-black">
            <div className="text-center">
                <h1 className="text-6xl font-bold mb-8 text-gray-400">Welcome to Your Reading List</h1>
                <p className="text-4xl text-white mb-8 font-zeyada font-semibold">
                    Organize your books, track your reading progress, and dive into your next adventure.
                </p>
                <div className="flex space-x-4">
                    <button 
                    className="text-white font-semibold py-2 px-4 rounded-lg"
                    onClick={()=>( window.location.assign("/addBooks") )}
                    >
                        Get Started
                    </button>
                    <button className="bg-transparent hover:bg-white hover:text-gray-900 border border-white text-white font-semibold py-2 px-4 rounded-lg">
                        Learn More
                    </button>
                </div>
            </div>
            <div className="mt-16">
                {/* Placeholder for Three.js objects */}
            </div>
        </div>
    );
}

export default Landing;
