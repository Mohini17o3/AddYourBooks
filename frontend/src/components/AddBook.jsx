import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const AddBook = () => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [status, setStatus] = useState('read');
    const [coverUrl, setCoverUrl] = useState('');
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
        
        axios.post('http://localhost:5000/api/add-book', {
            title,
            author,
            status,
            cover_url,
            date_added: new Date().toISOString()
        }).then(response => {
            setTitle('');
            setAuthor('');
            setStatus('read');
            navigate('/books');
        }).catch(error => {
            console.error('Error adding book:', error);
        });
    };

    return (
        <div className="flex items-center flex-col">
            <h1>Add a Book</h1>

            <div className="flex items-center mb-4 mt-4">
                <input
                    className="text-white p-4 rounded-lg"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                />
            </div>

            <div className="flex items-center mb-6">
                <input
                    className="text-white p-4 rounded-lg"
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Author"
                />
            </div>

            <select
                className="text-white mb-6 p-2 rounded-lg"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
            >
                <option value="read">Read</option>
                <option value="to_read">To Read</option>
            </select>
            <button onClick={handleSubmit}>Add Book</button>
        </div>
    );
};

export default AddBook;
