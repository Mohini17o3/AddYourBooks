import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons'; 
import { Link } from 'react-router-dom';

const BookList = () => {
  const [booksRead, setBooksRead] = useState([]);
  const [booksToRead, setBooksToRead] = useState([]);

  useEffect(() => {
    axios.get('https://addyourbooks.onrender.com/api/books')
      .then(response => {
        setBooksRead(response.data.read || []);
        setBooksToRead(response.data.to_read || []);
      })
      .catch(error => console.error('Error fetching books:', error));
  }, []);

  function handleClick(title , author , status) {
    axios.delete('https://addyourbooks.onrender.com/api/remove-books' , {data : {title , author}})
    .then(response => {
      if(status === 'read'){
            setBooksRead(booksRead.filter(book => !(book.title === title  && book.author === author ) ));
      } else {
        setBooksToRead (booksToRead.filter (book => !(book.title === title && book.author === author) ));
      }
    }) 
    .catch(error => console.error('Error removing book' , error));
  }


  return (
    <div className="p-6 min-h-screen">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-zeyada text-white mb-4">My Reading List</h1>
      </div>
      
      <section className="mb-8">
        <h2 className="text-3xl font-zeyada text-white mb-4">Books Read By Me</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {booksRead.map((book) => (
            <div key={book.title} className="bg-white p-4 rounded-lg shadow-lg flex flex-col ">
            <div className='text-right' onClick={ () => handleClick(book.title,  book.author , 'read')}> <FontAwesomeIcon className='cursor-pointer' icon={faTimes} /></div>
            <div className='flex justify-center'>
             <img src={book.cover_url} alt={book.title} className="w-32 h-48 object-cover mb-4 rounded-md" />
             </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800">{book.title}</h3>
                <p className="text-gray-600">by {book.author}</p>
              </div>
            </div>
          ))}

        </div>
        <Link to="/addBooks">

        <button className='mt-6 text-black' > Add More</button>
       </Link>
      </section>

      <section>
        <h2 className="text-3xl font-zeyada text-white mb-4">Books I Want to Read</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {booksToRead.map((book) => (
            <div key={book.title} className="bg-white p-4 rounded-lg shadow-lg flex flex-col ">
            <div className='text-right' onClick={()=> handleClick(book.title, book.author , 'to_read')}> <FontAwesomeIcon className='cursor-pointer' icon={faTimes} /></div>
            <div className='flex justify-center'>
             <img src={book.cover_url} alt={book.title} className="w-32 h-48 object-cover mb-4 rounded-md" />
             </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800">{book.title}</h3>
                <p className="text-gray-600">by {book.author}</p>
              </div>
            </div>
          ))}
        </div>
        
        <Link to="/addBooks">
    <button className='mt-6 text-black' > Add More</button>  
    </Link>   
      </section>
    </div>
  );
};

export default BookList;
