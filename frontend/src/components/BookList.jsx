import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons'; 
import { Link } from 'react-router-dom';

const BookList = () => {
  const [booksRead, setBooksRead] = useState([]);
  const [booksToRead, setBooksToRead] = useState([]);
  const [isModal , setIsModal] = useState(false);
  const [isBookSelected , setIsSelected] = useState(null);

  useEffect(() => {
    // https://addyourbooks.onrender.com/api/books
   
    axios.get('https://addyourbooks.onrender.com/api/books')
      .then(response => {
        setBooksRead(response.data.read || []);
        setBooksToRead(response.data.to_read || []);
      })
      .catch(error => console.error('Error fetching books:', error));
  }, []);

  function handleClick(title , author , status) {
    //https://addyourbooks.onrender.com/api/remove-books
    axios.delete(' //https://addyourbooks.onrender.com/api/remove-books' , {data : {title , author}})
    .then(response => {
      if(status === 'read'){
            setBooksRead(booksRead.filter(book => !(book.title === title  && book.author === author ) ));
      } else {
        setBooksToRead (booksToRead.filter (book => !(book.title === title && book.author === author) ));
      }
    }) 
    .catch(error => console.error('Error removing book' , error));
  }

  function handleMyReview(book) {
     setIsSelected(book);
     setIsModal(!isModal);
  }

  function closeModal(){
    setIsModal(false);
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
                <p className="text-gray-600 mb-4">by {book.author}</p>
                <p className='text-violet-800 mb-4'>My rating  : {book.rating}</p>
                <p className='text-violet-600 cursor-pointer font-bold' onClick={() =>handleMyReview(book)}>My learnings from the book </p>
              </div>
            </div>
          ))}

        </div>
        <Link to="/addBooks">

        <button className='mt-6 text-black'> Add More</button>
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

 {isModal && isBookSelected && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-auto">
          <div className="bg-white p-6 rounded-lg max-w-4xl w-full lg:w-1/2 md:w-1/2">
            <div className="text-right">
              <FontAwesomeIcon className="cursor-pointer" icon={faTimes} onClick={closeModal} />
            </div>
            <h2 className="text-2xl font-bold text-center mb-4">{isBookSelected.title}</h2>
            <div className="max-h-96 overflow-auto">
        <p className="text-center text-violet-800 font-semibold bg-violet-100 p-4 rounded leading-relaxed whitespace-pre-wrap break-words">
          {isBookSelected.review}
        </p>
      </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookList;
