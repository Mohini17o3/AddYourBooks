import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


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
  {
    modal && 
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-8">
  <div className="bg-[radial-gradient(circle,_#dac7c7,_#cfc6c6_30%,_#cbbaca_60%,_#c7a3be_90%,_#baa3c9_100%,_#9f91ac)] p-6 rounded-lg shadow-md shadow-gray-300 flex flex-col items-center size-fit p-4 border border-white border-2 ">
    <h2 className="lg:text-2xl font-bold md:mb-4">{modalContent.title}</h2>
    <h2 className="font-bold mb-4 lg:text-lg"> By: {modalContent.authors ? modalContent.authors.join(", ") : "--"}</h2>
    <h2 className="font-bold mb-4 lg:text-lg">About:</h2> 
    {modalContent.subtitle ? 
      <p className="font-bold font-zeyada mb-4 lg:text-lg">"{modalContent.subtitle}"</p> : <p></p>
    }
    <p className="text-gray-600 lg:mb-4 lg:text-xl text-sm"> {modalContent.description?.length>500 ?modalContent.description?.slice(0, 600): modalContent.description}.....</p>
    <button
      className="text-white px-4 py-2 rounded-md hover:bg-white hover:text-violet-600 border border-white border-4 mt-4"
      onClick={() => setModal(false)}
    >
      Close
    </button>
     </div> 
    </div>
  }    
    </div>
  );
};

export default Recommendations;
