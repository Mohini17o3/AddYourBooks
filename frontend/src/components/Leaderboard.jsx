import React, { useEffect, useState } from "react";
import { useUser } from "./userStateContext";

function Leaderboard() {
  const { user } = useUser();
  const [leaderboard, setLeaderboard] = useState([]);
  const token = localStorage.getItem("token");
  const url = import.meta.env.VITE_EXPRESS_BACKEND_URL;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`${url}/leaderboard` , {
            headers: {
                Authorization: `Bearer ${token}`,
              },
            
        }); // Update endpoint as per your backend
        const data = await res.json();


        setLeaderboard(data);
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="relative z-5 md:pt-20 pt-12 h-fit mb-14 p-4 rounded-md border-md border-gray-300 text-white w-screen ">
    <h1 className="text-3xl font-bold mb-8 text-center font-zeyada">📊 Leaderboard</h1>

    <div className="flex flex-col gap-4 md:max-w-2xl mx-auto">
      {leaderboard.map((entry) => {
        const isCurrentUser = entry.userName === user?.name;

        return (
          <div
            key={entry.userName}
            className={`w-full flex items-center cursor-pointer justify-between px-6 py-4 rounded-xl shadow-md transition-all duration-200
              ${
                isCurrentUser
                  ? "bg-violet-200 text-black font-semibold shadow-lg scale-[1.02]"
                  : "bg-white/10 hover:bg-white/20"
              }`}
          >
            <span className="w-1/6 text-center md:text-xl">{entry.rank} </span>
            <span className="w-3/6 text-left md:text-lg relative z-10
">
              {isCurrentUser ? "👑 You" : entry.userName}
            </span>
            <span className="w-2/6 lg:text-right md:text-md font-mono text-sm">
              📚 {entry.readCount}
            </span>
          </div>
        );
      })}
    </div>
  </div>
  );
}

export default Leaderboard;
