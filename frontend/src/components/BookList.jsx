import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons'; 
import { Link, useNavigate } from 'react-router-dom';

const BookList = () => {
  const [booksRead, setBooksRead] = useState([]);
  const [booksToRead, setBooksToRead] = useState([]);
  const [isModal , setIsModal] = useState(false);
  const [isBookSelected , setIsSelected] = useState(null);
  const [loading , setLoading] = useState(false) ;
  const navigate = useNavigate();

  const url = import.meta.env.VITE_EXPRESS_BACKEND_URL;
  const token = localStorage.getItem("token");


  useEffect(() => {
  setLoading(true);
    if(!token) {
      console.error("No token found , redirecting to login page");
      alert("Please login");
      navigate('/login');
      return ; 
      
    }
    axios.get(`${url}/api/books/read`,
       {
      headers:{Authorization : `Bearer ${token}`,      
      },
    })
      .then(response => {
        setBooksRead(response.data.books || []);
      })
      .catch(error => console.error('Error fetching books:', error));
    axios.get(`${url}/api/books/toread` , {
      headers : {Authorization : `Bearer ${token}`}
    })
      .then(response => {
        setBooksToRead(response.data.books || []);
        setLoading(false);
      })
      .catch(error => console.error('Error fetching books:', error));
  }, [token]);

  function handleClick(title , author , status) {
    axios.delete(`${url}/api/remove-book` ,
       {
      headers : {Authorization : `Bearer ${token}`} ,data : {title , author ,status} , 
    } 
  )
    .then(response => {
      console.log(response.data);
      if(status === 'read'){
            setBooksRead( (prev)=>
              
              prev.filter(book => !(book.title === title  && book.author === author ) )  
            
            );
      } else {
        setBooksToRead((prev) => prev.filter(book => !(book.title === title && book.author === author)));
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
      {loading ? (<div className="relative flex justify-center items-center text-white text-6xl font-bold font-zeyada"> Loading .. </div>): (       
 <>   
      <section className="mb-8">
        <h2 className="text-3xl font-zeyada text-white mb-4">Books Read By Me</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {booksRead.map((book) => (
            <div key={book.title} className="shadow-lg shadow-gray-200 p-4 rounded-lg shadow-lg flex flex-col ">
            <div className='text-right' onClick={ () => handleClick(book.title,  book.author , 'read')}> <FontAwesomeIcon className='cursor-pointer bg-white p-2 rounded-md' icon={faTimes} /></div>
            <div className='flex justify-center'>
             <img src={book.cover_url} alt={book.title} className="w-32 h-48 object-cover mb-4 rounded-md" />
             </div>
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-white">{book.title}</h3>
                <p className="text-gray-300 mb-4">by {book.author}</p>
                <p className='text-violet-300 mb-4'>My rating  : {book.rating}</p>
                <button className='text-violet-200 cursor-pointer font-bold' onClick={() =>handleMyReview(book)}>My learnings</button>
              </div>
            </div>
          ))}

        </div>
        <Link to="/addBooks">

        <button className='mt-6 text-white'> Add More</button>
       </Link>
      </section>

      <section>
        <h2 className="text-3xl font-zeyada text-white mb-4">Books I Want to Read</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {booksToRead.map((book) => (
            <div key={book.title} className="shadow-lg shadow-gray-200 p-4 rounded-lg shadow-lg flex flex-col ">
            <div className='text-right' onClick={()=> handleClick(book.title, book.author , 'to_read')}> <FontAwesomeIcon className='cursor-pointer bg-white p-2 rounded-md' icon={faTimes} /></div>
            <div className='flex justify-center'>
             <img src={book.cover_url} alt={book.title} className="w-32 h-48 object-cover mb-4 rounded-md" />
             </div>
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-white">{book.title}</h3>
                <p className="text-gray-300 mb-4">by {book.author}</p>
              </div>
            </div>
          ))}
        </div>
        
        <Link to="/addBooks">
    <button className='mt-6 text-white' > Add More</button>  
    </Link>   
      </section>
</>

) } 

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
