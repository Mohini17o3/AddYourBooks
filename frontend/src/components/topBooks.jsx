import React, { useEffect, useState } from "react";
import axios from 'axios' ;
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons'; 
const TopBooks = () => {
  const nav = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen , setModalOpen] = useState(false) ;
  const [bookDetail , showBookDetail] = useState(null) ;
  const key = import.meta.env.VITE_books_api ;
  const url = import.meta.env.VITE_BACKEND_URL;

  
    useEffect(()=>{
         fetch(`${url}/api/topBooks`)
          .then((response)=>{
             if(!response.ok){
              throw new Error("Network response error");
             }
                return response.json();
          })
          .then((response)=>{
            setBooks(response) ;
            setLoading(false);
          })
          .catch ((e)=>{
             setLoading(false);

          })

    } , []) ; 

    if(loading){
     return <div className="relative flex justify-center items-center text-white text-6xl font-bold font-zeyada"> Loading .. </div>
    }

    async function handleClick(bookTitle) {
      try {
  const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=intitle:${bookTitle}&key=${key}`)
     if(response.data.items && response.data.items.length > 0 ) {
      showBookDetail(response.data.items[0]) ;
      console.log(bookDetail);
      setModalOpen(true) ;
    }
    } 
    catch(e){
      console.log(e) ;
    }
    
  }

  function readBook(title , author) {
    nav("/addBooks" , {state: {title : title, author : author}})
  }
   return (
    <>
     <h1 className="lg:text-6xl font-bold font-zeyada flex justify-center items-center mt-8 text-white"> Some Popular Books</h1>  
   <div className="p-14 sm:p-2 flex items-center justify-center flex-col lg:m-20">
   <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-20 lg:p-8">
     {books.map((book ,index )=>(
      <div key={index} className="shadow-lg shadow-gray-200 p-8 rounded-md grid md:grid-cols-2 gap-2 font-semibold cursor-pointer border border-gray-200 border-2 justify-center items-center">
     
       <img 
       className="rounded-md border border-8 border-white lg:text-2xl w-48" 
       src={book['Image-URL-M']} 
       alt={book['Book-Title']}>
       </img>
{/* ============book details ================ */}
        <div className=" flex flex-col md:justify-between text-white md:text-xl">{book['Book-Title']}
               <div className="md:h-36 mt-8 mb-6">   
               <p className="text-gray-400">Author : {book['Book-Author']}</p>
               <p className="text-gray-400 ">Votes : {book['num_rating']}</p>
               <p className="text-gray-400 ">Rating : {book['avg_rating']}</p>
               </div>
               <button
                className="text-white hover:bg-white hover:text-violet-600 transition mb-4 border border-white border-4 "
                onClick={()=>{ handleClick(book['Book-Title']) } } >
                Know more 
                </button>     
          <button 
          className="text-white hover:bg-white hover:text-violet-600 transition border border-white border-4"
          onClick={()=>readBook(book['Book-Title']  , book['Book-Author'])}>
          Read
          </button>

      </div>
    </div>  
     ))}
   </div>  
   
{/*  ======== modal ===== */}
{modalOpen &&  
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[999] p-6">
    <div className=" relative bg-white p-4 sm:p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden ">

    <div className="absolute top-4 right-4">
  <FontAwesomeIcon  className="text-gray-600 hover:text-red-500 text-xl cursor-pointer"
 icon={faTimes} onClick={() => setModalOpen(false)}
 />
  </div>


      <h2 className="text-xl sm:text-2xl font-bold mb-2 text-center">{bookDetail.volumeInfo.title}</h2>
       <h3 className="text-md sm:text-lg font-semibold mb-2 text-center">
        By: {bookDetail.volumeInfo.authors ? bookDetail.volumeInfo.authors.join(", ") : "--"}
      </h3>
    {bookDetail.volumeInfo.subtitle ? 
      <p className="font-bold font-zeyada mb-4 lg:text-lg text-center">"{bookDetail.volumeInfo.subtitle}"</p> : <p></p>
    }
    <h2 className="font-bold mb-4 lg:text-lg text-center">About:</h2> 

    <div className="bg-violet-100 p-4 rounded-md overflow-y-auto max-h-[40vh] text-sm text-violet-800 font-semibold leading-relaxed">
        {bookDetail.volumeInfo.description?.length > 500
          ? bookDetail.volumeInfo.description.slice(0, 600)
          : bookDetail.volumeInfo.description}
        .....
      </div>

      <div className='flex items-center justify-center'>       
        {bookDetail.saleInfo?.buyLink ? (
  <div className="flex flex-row gap-4 mb-4">    
  <a
    href={bookDetail.saleInfo.buyLink}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-violet-500 text-sm text-white px-4 py-2 rounded mt-2 inline-block flex h-fit hover:bg-violet-300"
  >
    Buy 
    </a>
    <a
    href={bookDetail.volumeInfo.infoLink}
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-400 underline px-4 py-2 text-sm"
  >
    View on Google Books
  </a>
  </div>     
) : (
  <a
    href={bookDetail.volumeInfo.infoLink}
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-400 underline justify-center flex items-center"
  >
    View on Google Books
  </a>
)} 

</div>
  
     </div> 
    </div>
    
     }  
    
   </div>

   </> 
   );
  
};

export default TopBooks;
