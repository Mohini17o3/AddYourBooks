import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import Leaderboard from './Leaderboard'; 
import { useUser } from './userStateContext';
import { useNavigate } from 'react-router-dom';


ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const AnalyticsForBooks = () => {
    const [data, setData] = useState({ years: [], months: [], booksRead: [], average_rating: [], average_reading_speed: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const url =  import.meta.env.VITE_BACKEND_URL ;
    const token = localStorage.getItem("token");
    const {user} = useUser();
    const navigate  = useNavigate() ;

    useEffect(() => {
        if(!token) {
            console.error("No token found , redirecting to login page");
            alert("Please login");
            navigate('/login');
            return ; 
            
          }
        console.log("Fetching analytics data...");
        axios.get(`${url}/api/reading-stats`  , {headers : {Authorization : `Bearer ${token}`}})
            .then(response => {
                console.log(response.data);            
                setData(response.data);
                setSelectedYear(response.data.years[0]); // Default to the first year
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching analytics:', error);
                setError('Failed to load data');
                setLoading(false);
            });
    }, []);

    // Handle year selection change
    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    // Find the index for the selected year
    const yearIndex = data.years.indexOf(selectedYear);

    const booksReadData = {
        labels: data.months[yearIndex] || [],
        datasets: [
            {
                label: 'Books Read',
                data: data.booksRead[yearIndex] || [],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }
        ]
    };

    // Display single values separately if needed
    if (loading) return <p className='text-white flex items-center justify-center font-bold text-6xl font-zeyada'>Loading...</p>;
    if (error) return <p className='text-white font-zeyada'>{error}</p>;

    return (

        <>
        <h2 className="text-3xl font-zeyada text-white mb-4 text-center"> Have a quick look at your rank , keep going {user?.name || "reader"} ! </h2>
        
        <div className="p-8 text-white flex items-center justify-center flex-col mx-auto m-4 rounded-lg shadow-md shadow-gray-200 w-full bg-gradient-to-b from-[#281d38] to-[#260d24] ">
                <Leaderboard  />
            <h2 className="text-2xl font-semibold mb-4 font-zeyada">Reading Analytics</h2>         
            <div className="mb-6">
                <label htmlFor="year" className="block text-black font-medium mb-2">Select Year</label>
                <select
                    id="year"
                    value={selectedYear}
                    onChange={handleYearChange}
                    className="p-2 border border-gray-300 bg-white text-black rounded"
                >
                    {data.years.map((year) => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>

            <div className="chart-container p-4 mb-6">
                <h3 className="text-xl font-medium mb-2">Books Read per Month</h3>
                <Bar data={booksReadData} />
            </div>

            <div className="summary-container mb-6">
                <h3 className="text-xl font-medium mb-2">Average Rating</h3>
                <p>{data.average_rating[yearIndex] || 'N/A'}</p>

                <h3 className="text-xl font-medium mb-2">Average Reading Speed (days)</h3>
                <p>{data.average_reading_speed[yearIndex] || 'N/A'}</p>
            </div>
        </div>
        </>
    );
};

export default AnalyticsForBooks;
