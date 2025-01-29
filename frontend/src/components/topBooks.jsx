import React, { useEffect, useState } from "react";
import axios from 'axios' ;
import { useNavigate } from "react-router-dom";

const TopBooks = () => {
      const nav = useNavigate();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen , setModalOpen] = useState(false) ;
  const [bookDetail , showBookDetail] = useState("") ;
  const key = import.meta.env.VITE_books_api ;
 
    useEffect(()=>{
      // https://addyourbooks.onrender.com/
      //"http://localhost:5000/api/topBooks"
         fetch("https://addyourbooks.onrender.com/api/topBooks")
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
             console.log(e);
             setLoading(false);

          })

    } , []) ; 

    if(loading){
     return <div className="relative flex justify-center items-center text-white text-6xl font-bold"> Loading .. </div>
    }

    async function handleClick(bookTitle) {
      try {
  const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=intitle:${bookTitle}&key=${key}`)
     if(response.data.items && response.data.items.length > 0 ) {
      showBookDetail(response.data.items[0].volumeInfo) ;
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
   <div className="p-14 ">
   <h1 className="text-6xl font-bold font-zeyada mb-6 flex justify-center items-center"> Some Popular Books</h1>

   <div className="grid lg:grid-cols-3 sm:grid-cols-1 gap-8 p-8">
     {books.map((book ,index )=>(
      <div key={index} className="bg-violet-200 shadow-lg shadow-gray-200 p-8 rounded-md grid md:grid-cols-2 gap-2 font-semibold cursor-pointer border border-gray-200 border-2 justify-center">
      
       <img 
       className="rounded-md border border-8 border-black text-2xl" 
       src={book['Image-URL-M']} 
       alt={book['Book-Title']}>
       </img>
{/* ============book details ================ */}
        <div className=" flex flex-col md:justify-between md:text-xl">{book['Book-Title']}
               <div className="md:h-36">  
               <p className="text-gray-600">Author : {book['Book-Author']}</p>
               <p className="text-gray-600 ">Votes : {book['num_rating']}</p>
               <p className="text-gray-600 ">Rating : {book['avg_rating']}</p>
               </div>
               <button
                className="text-white hover:bg-white hover:text-violet-600 transition mb-4 border border-white border-4"
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
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 text-xl p-8">
  <div className="bg-violet-200 p-6 rounded-md shadow-md shadow-gray-300 flex flex-col items-center w-auto sm:h-36 sm:w-2/3 md:h-auto sm:text-sm p-4">
    <h2 className="text-2xl font-bold mb-4">{bookDetail.title}</h2>
    <h2 className="font-bold mb-4 text-md"> By: {bookDetail.authors ? bookDetail.authors.join(", ") : "--"}</h2>
    <h2 className="font-bold mb-4 text-md">About:</h2> 
    {bookDetail.subtitle ? 
      <p className="font-bold font-zeyada mb-4 text-lg">"{bookDetail.subtitle}"</p> : <p></p>
    }
    <p className="text-gray-600 mb-4 text-md">{bookDetail.description}</p>
    <button
      className="text-white bg-violet-500 px-4 py-2 rounded-md hover:bg-white hover:text-violet-600 border border-white border-4"
      onClick={() => setModalOpen(false)}
    >
      Close
    </button>
     </div> 
    </div> }  
    
   </div>

   
   );
  
};

export default TopBooks;
