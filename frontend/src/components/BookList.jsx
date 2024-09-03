import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BookList = () => {
  const [booksRead, setBooksRead] = useState([]);
  const [booksToRead, setBooksToRead] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/books')
      .then(response => {
        setBooksRead(response.data.read || []);
        setBooksToRead(response.data.to_read || []);
      })
      .catch(error => console.error('Error fetching books:', error));
  }, []);

  return (
    <div className="p-6 min-h-screen">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-zeyada text-white mb-4">My Reading List</h1>
      </div>
      
      <section className="mb-8">
        <h2 className="text-3xl font-zeyada text-white mb-4">Books Read By Me</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {booksRead.map((book) => (
            <div key={book.title} className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
              <img src={book.cover_url} alt={book.title} className="w-32 h-48 object-cover mb-4 rounded-md" />
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800">{book.title}</h3>
                <p className="text-gray-600">by {book.author}</p>
              </div>
            </div>
          ))}

        </div>
        <button className='mt-6' onClick={()=>window.location.assign('/addBooks')}> Add More</button>

      </section>

      <section>
        <h2 className="text-3xl font-zeyada text-white mb-4">Books I Want to Read</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {booksToRead.map((book) => (
            <div key={book.title} className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
              <img src={book.cover_url} alt={book.title} className="w-32 h-48 object-cover mb-4 rounded-md" />
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800">{book.title}</h3>
                <p className="text-gray-600">by {book.author}</p>
              </div>
            </div>
          ))}
        </div>
    <button className='mt-6' onClick={()=>window.location.assign('/addBooks')}> Add More</button>     
      </section>
    </div>
  );
};

export default BookList;
