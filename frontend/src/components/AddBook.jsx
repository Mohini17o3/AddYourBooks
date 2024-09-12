import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const AddBook = () => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [status, setStatus] = useState('read');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const navigate = useNavigate();

    const fetchCoverUrl = async (title, author) => {
        try {
            const query = `${title}+inauthor:${author}`.replace(/ /g, '+');
            const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
            const book = response.data.items ? response.data.items[0] : null;
            if (book && book.volumeInfo && book.volumeInfo.imageLinks) {
                return book.volumeInfo.imageLinks.thumbnail;
            }
        } catch (error) {
            console.error('Error fetching cover URL:', error);
        }
        return ''; // Default to empty if not found
    };

    const handleSubmit = async () => {
        const cover_url = await fetchCoverUrl(title, author);
        
        axios.post('https://addyourbooks.onrender.com/api/add-book', {
            title,
            author,
            status,
            cover_url,
            start_date: startDate,
            end_date: endDate,
            rating,
            review,
           date_added: new Date().toISOString()
        }).then(response => {
            setTitle('');
            setAuthor('');
            setStatus('read');
            setStartDate('');
            setEndDate('');
            setRating(0);
            setReview('');
            navigate('/books');
        }).catch(error => {
            console.error('Error adding book:', error);
        });
    };

    return (
        <div className="bg-brown-300 p-8 rounded-lg shadow-lg m-6 max-w-lg mx-auto">
           <div className="mb-6 flex justify-center">
             <img src="Books.webp" alt="Books" className="w-32 h-32 object-cover rounded-full shadow-md" />
            </div>
             <h1 className="text-4xl font-zeyada text-white text-center mb-6">Add a New Book </h1>
            <p className="text-2xl font-zeyada text-white text-center mb-6">Yo! Mind the spellings.</p>
            <div className="mb-4">
                <label className="block text-white text-xl font-bold mb-2">Title:</label>
                <input
                    className="w-full p-3 rounded-lg bg-gray-600 text-white"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter book title"
                />
            </div>
            <div className="mb-4">
                <label className="block text-white text-xl font-bold mb-2">Author:</label>
                <input
                    className="w-full p-3 rounded-lg bg-gray-600 text-white"
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Enter author's name"
                />
            </div>

            <div className="mb-6">
                <label className="block text-white text-xl font-bold mb-2">Status:</label>
                <select
                    className="w-full p-3 rounded-lg bg-gray-600 text-white"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="read">Read</option>
                    <option value="to_read">To Read</option>
                </select>
            </div>
            
            <p className="font-zeyada text-white text-xl mb-6"> 🫡 Continue below if you've read the book</p>
            <div className="mb-4">
                <label className="block text-white text-xl font-bold mb-2"> Remember the Start Date? </label>
                <input
                    className="w-full p-3 rounded-lg bg-gray-600 text-white"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="Remember when you started reading ?"
                />
            </div>
            <div className="mb-4">
                <label className="block text-white text-xl font-bold mb-2">And End Date ?</label>
                <input
                    className="w-full p-3 rounded-lg bg-gray-600 text-white"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="And when did you complete it ? "
                />
            </div>
            <div className="mb-4">
                <label className="block text-white text-xl font-bold mb-2">What do you rate it (0-5):</label>
                <input
                    className="w-full p-3 rounded-lg bg-gray-600 text-white"
                    type="number"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    
                />
            </div>
            <div className="mb-4">
                <label className="block text-white text-xl font-bold mb-2"> Thoughts about the book :</label>
                <textarea
                    className="w-full p-3 rounded-lg bg-gray-600 text-white"
                    type="number"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder=" 💭"
                />
            </div>
        
            <button
                onClick={handleSubmit}
                className="w-full bg-purple-900 hover:bg-purple-800 text-white p-3 rounded-lg font-semibold"
            >
                Add Book
            </button>


        </div>
    );
};


export default AddBook;
