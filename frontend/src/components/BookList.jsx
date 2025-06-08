import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons'; 
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from './userStateContext';

const BookList = () => {
  const [booksRead, setBooksRead] = useState([]);
  const [booksToRead, setBooksToRead] = useState([]);
  const [isModal , setIsModal] = useState(false);
  const [isBookSelected , setIsSelected] = useState(null);
  const[knowModal , setKnowModal] = useState(false) ;
  const [loadingDesc , setLoadingDesc] = useState("")  ; 
  const [bookDescription , setBookDescription] = useState(null)  ; 
  const[title , setTitle] = useState("") ; 
  const [loading , setLoading] = useState(false) ;
  const {user , accessToken , loading : isUserLoading} = useUser() ;
  const navigate = useNavigate();

  const url = import.meta.env.VITE_EXPRESS_BACKEND_URL;


  useEffect(() => {
    if(isUserLoading) {
      return  ;
    }
    if(!accessToken) {
      console.error("No token found , redirecting to login page");
      alert("Please login");
      navigate('/login');
      return ; 
      
    }
      setLoading(true);
    axios.get(`${url}/api/books/read`,
       {
      headers:{Authorization : `Bearer ${accessToken}`,      
      },
    })
      .then(response => {
        setBooksRead(response.data.books || []);
      })
      .catch(error => console.error('Error fetching books:', error));
      
    axios.get(`${url}/api/books/toread` , {
      headers : {Authorization : `Bearer ${accessToken}`}
    })
      .then(response => {
        setBooksToRead(response.data.books || []);
        setLoading(false);
      })
      .catch(error => console.error('Error fetching books:', error));
  }, [accessToken , isUserLoading]);

  function handleClick(title , author , status) {
    axios.delete(`${url}/api/remove-book` ,
       {
      headers : {Authorization : `Bearer ${accessToken}`} ,data : {title , author ,status} , 
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


  // review fetching 
  function handleMyReview(book) {
     setIsSelected(book);
     console.log(book);
     setIsModal(!isModal);
  }

  // book description for to read books 
  async function handleKnowMore(title) {

     setTitle(title) ;
     setLoadingDesc(true) ;
     setKnowModal(!knowModal) ;

     try {
      const query  = encodeURIComponent(`intitle:${title}`) ;
     const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`;
     const res = await fetch(url) ;
     const data = await res.json() ; 
     console.log(data);
     const desc =  await data?.items?.[0] || " oopsie ! description not avaible for this book right now "; 
      setBookDescription(desc) ;

     }catch(e) {
      console.log(e) ; 
      setBookDescription("Can't fetch description , please try again later") ;
     } finally {
      setLoadingDesc(false) ; 
     }
   }

   // closing the modal 
  function closeModal(){
    setIsModal(false);
  }


  // date formatting function 

  const formatDate =  (date)=>{
      return new Date(date).toLocaleDateString("en-GB" , {
        day : "numeric" , 
        month : "long" , 
        year : "numeric" , 
      })
  }

  return (
    <div className="p-6 min-h-screen">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-zeyada text-white mb-4"> Welcome back to your Reading List {user?.name || "Reader"}</h1>


      </div>
      {loading ? (<div className="relative flex justify-center items-center text-white text-6xl font-bold font-zeyada"> Loading .. </div>): (       
 <>   
      <section className="mb-8">
        <h2 className="text-3xl font-zeyada text-white mb-4">Books Read By Me</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {booksRead.map((book) => (
            <div key={book.title} className="shadow-lg shadow-gray-200 p-2 rounded-lg flex flex-col ">
            <div className='text-right' onClick={ () => handleClick(book.title,  book.author , 'read')}> <FontAwesomeIcon className='cursor-pointer bg-white p-2 rounded-md' icon={faTimes} /></div>
            <div className='flex justify-center'>
             <img src={book.cover_url} alt={book.title} className="w-32 h-48 object-cover mb-4 rounded-md" />
             </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white">{book.title}</h3>
                <p className="text-gray-300 mb-4">by {book.author}</p>
                <p className='text-violet-300 mb-4'>My rating  : {book.rating}</p>
                <p className='text-violet-300 mb-4'>Completed on  : {formatDate(book.end_date)}</p>
                <button className="text-white hover:bg-white hover:text-violet-600 transition border border-white border-4"
 onClick={() =>handleMyReview(book)}>My learnings</button>
              </div>
            </div>
          ))}

        </div>
        <Link to="/addBooks">

        <button  className="text-white hover:bg-white hover:text-violet-600 transition border border-white border-4 mt-6"
> Add More</button>
       </Link>
      </section>

      <section>
        <h2 className="text-3xl font-zeyada text-white mb-4">Books I Want to Read</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {booksToRead.map((book) => (
            <div key={book.title} className="shadow-lg shadow-gray-200 p-4 rounded-lg shadow-lg flex flex-col ">
            <div className='text-right' onClick={()=> handleClick(book.title, book.author , 'to_read')}> <FontAwesomeIcon className='cursor-pointer bg-white p-2 rounded-md' icon={faTimes} /></div>
            <div className='flex justify-center'>
             <img src={book.cover_url} alt={book.title} className="w-32 h-48 object-cover mb-4 rounded-md" />
             </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white">{book.title}</h3>
                <p className="text-gray-300 mb-4">by {book.author}</p>
                <button  className="text-white hover:bg-white hover:text-violet-600 transition border border-white border-4"
 onClick={() => handleKnowMore(book.title)}> Know More</button>
              </div>
            </div>
          ))}
        </div>
        
        <Link to="/addBooks">
    <button className="text-white hover:bg-white hover:text-violet-600 transition border border-white border-4 mt-6"
> Add More</button>  
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

    {knowModal && title && bookDescription && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-auto">
    <div className="bg-white p-6 rounded-lg max-w-4xl w-full lg:w-1/2 md:w-1/2">
      <div className="text-right">
        <FontAwesomeIcon className="cursor-pointer" icon={faTimes} onClick={() => setKnowModal(false)} />
      </div>
      <h2 className="text-2xl font-bold text-center mb-4">{title}</h2>
      <div className="max-h-96 overflow-auto">
      
        {loadingDesc ? (
          <p className="text-center text-violet-500">Loading description...</p>
        ) : (
          <p className="text-center text-violet-800 font-semibold bg-violet-100 p-4 rounded leading-relaxed whitespace-pre-wrap break-words">
            {bookDescription.volumeInfo.description}
          </p>
        )}
        
      </div>

      <div className='flex items-center justify-center '>       
        {bookDescription.saleInfo?.buyLink ? (
 <div className='flex flex-row gap-4 mb-4 items-center justify-center'>          
  <a
    href={bookDescription.saleInfo.buyLink}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-violet-500 text-sm text-white px-4 py-2 rounded mt-2 inline-block flex h-fit hover:bg-violet-300"
  >
    Buy 
  </a>
  <a
    href={bookDescription.volumeInfo.infoLink}
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-400 underline text-sm "
  >
    View on Google Books
  </a>
  </div>
) : (
  <a
    href={bookDescription.volumeInfo.infoLink}
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
)}


    </div>
  );
};

export default BookList;
