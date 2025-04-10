import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons'; 

const Recommendations = () => {
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal , setModal] = useState(false) ;
  const [modalContent , setModalContent] = useState("") ;
  const navigate = useNavigate();
  
  const url = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");
  const key = import.meta.env.VITE_books_api ;

  useEffect(() => {
    setLoading(true);
    if (!token) {
      console.error("No token found, redirecting to login page");
      alert("Please login");
      navigate('/login');
      return;
    }

    axios.get(`${url}/api/recommendations`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(response => {
        console.log(response.data);
        setRecommendedBooks(response.data.recommended_books || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching recommendations:', error);
        setLoading(false);
      });
  }, [token]);

  function handleAddBook(title, author) {
     navigate("/addBooks" , {state : {title : title , author : author}});
  }

  async function handleClick(title){
    try {
   const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=intitle:${title}&key=${key}`) ;
   if(response.data.items && response.data.items.length > 0) {
    setModalContent(response.data.items[0].volumeInfo) ;
    setModal(true) ;
   }
    }catch(e) {
      console.log("error" , e) ;
    }

  }

  return (
    <div className="p-6 min-h-screen">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-zeyada text-white mb-4">Recommended Books</h1>
      </div>
      {loading ? (
        <div className="relative flex justify-center items-center text-white text-6xl font-bold font-zeyada">Loading...</div>
      ) : (
        <section>
        <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-8 p-6">
        {recommendedBooks.map((book, index) => (
              <div key={index} className="p-4 shadow-lg rounded-lg flex flex-col items-center border-4 border-white ">
              <img className="rounded-md border border-8 border-white w-48" src={book.image_url} alt={book.title}></img>
                <h3 className="text-xl font-semibold text-white">{book.title}</h3>
                <p className="text-gray-400 mb-4">by {book.author}</p>               
                <button 
    className="text-white hover:bg-white hover:text-violet-600 transition border border-white border-4 m-2"
          onClick={() => handleAddBook(book.title, book.author)}
                >
                 Add Book
                </button>
                <button 
          className="text-white hover:bg-white hover:text-violet-600 transition border border-white border-4"
          onClick={() => handleClick(book.title)}
                >
                 Know More
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
     
  {/*  ======== modal ===== */}
  {modal &&  
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-6">
      <div className=" relative bg-white p-4 sm:p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden ">
  
      <div className="absolute top-4 right-4">
    <FontAwesomeIcon  className="text-gray-600 hover:text-red-500 text-xl cursor-pointer"
   icon={faTimes} onClick={() => setModal(false)}
   />
    </div>
  
  
        <h2 className="text-xl sm:text-2xl font-bold mb-2 text-center">{modalContent.title}</h2>
         <h3 className="text-md sm:text-lg font-semibold mb-2 text-center">
          By: {modalContent.authors ? modalContent.authors.join(", ") : "--"}
        </h3>
      {modalContent.subtitle ? 
        <p className="font-bold font-zeyada mb-4 lg:text-lg text-center">"{modalContent.subtitle}"</p> : <p></p>
      }
      <h2 className="font-bold mb-4 lg:text-lg text-center">About:</h2> 
  
      <div className="bg-violet-100 p-4 rounded-md overflow-y-auto max-h-[40vh] text-sm text-violet-800 font-semibold leading-relaxed">
          {modalContent.description?.length > 500
            ? modalContent.description.slice(0, 600)
            : modalContent.description}
          .....
        </div>
    
       </div> 
      </div>
      
       }  
    </div>
  );
};

export default Recommendations;
