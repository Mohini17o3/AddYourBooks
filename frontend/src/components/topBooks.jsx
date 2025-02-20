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
             console.log(e);
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
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-8">
  <div className="bg-[radial-gradient(circle,_#dac7c7,_#cfc6c6_30%,_#cbbaca_60%,_#c7a3be_90%,_#baa3c9_100%,_#9f91ac)] p-6 rounded-lg shadow-md shadow-gray-300 flex flex-col items-center size-fit p-4 border border-white border-2 ">
    <h2 className="lg:text-2xl font-bold md:mb-4">{bookDetail.title}</h2>
    <h2 className="font-bold mb-4 lg:text-lg"> By: {bookDetail.authors ? bookDetail.authors.join(", ") : "--"}</h2>
    <h2 className="font-bold mb-4 lg:text-lg">About:</h2> 
    {bookDetail.subtitle ? 
      <p className="font-bold font-zeyada mb-4 lg:text-lg">"{bookDetail.subtitle}"</p> : <p></p>
    }
    <p className="text-gray-600 lg:mb-4 lg:text-xl text-sm"> {bookDetail.description?.length>500 ?bookDetail.description?.slice(0, 600): bookDetail.description}.....</p>
    <button
      className="text-white px-4 py-2 rounded-md hover:bg-white hover:text-violet-600 border border-white border-4 mt-4"
      onClick={() => setModalOpen(false)}
    >
      Close
    </button>
     </div> 
    </div> }  
    
   </div>

   </> 
   );
  
};

export default TopBooks;
