import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Analytics = () => {
    const [data, setData] = useState({ years: [], months: [], booksRead: [], average_rating: [], average_reading_speed: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5000/api/reading-stats')
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
    if (loading) return <p className='text-white font-zeyada'>Loading...</p>;
    if (error) return <p className='text-white font-zeyada'>{error}</p>;

    return (
        <div className="p-8 bg-gray-100 flex items-center justify-center flex-col max-w-lg mx-auto m-4 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Reading Analytics</h2>
            
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
    );
};

export default Analytics;
