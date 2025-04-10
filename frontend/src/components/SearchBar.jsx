import React, { useEffect } from "react";
import { useState } from "react";
import {useNavigate} from "react-router-dom";
const SearchBar = ()=> {
    const nav = useNavigate();
    const[searchQuery , setSearchQuery] = useState("");
    const [debouncedQuery  , setDebouncedQuery] = useState("") ;
    const [genre , setGenre] = useState("") ;
    const[suggestions , setSuggestions]  = useState([]);
    const [author , setAuthor] = useState('');

//debounce search query input
   useEffect(()=>{
      const handler = setTimeout(()=>{

        setDebouncedQuery(searchQuery) ;
    } , [500]) ;

    // cancel prev timeout if search input changes
    return ()=>{
        clearTimeout(handler) ;
    }
   } , [searchQuery]);


    // api call when query updates 
    useEffect(()=>{
          
    const fetchSuggestions = async(e)=> {
        
        if(!debouncedQuery) {
            setSuggestions([]);
            return ;
        }
        let query = '';
        if (debouncedQuery && genre) {
            query = `${debouncedQuery} ${genre}`;
        }else if (debouncedQuery) {
            query = `intitle:${debouncedQuery} OR inauthor:${debouncedQuery}`;
        }

        let q =  encodeURIComponent(query);
        const url = `https://www.googleapis.com/books/v1/volumes?q=${q}`;
        try {
               const response  = await fetch(url);
               console.log(response);
               if(!response.ok){
                   throw new Error(`Response status : ${response.status}`);
               }
               const data = await response.json();
               setSuggestions(data.items || []);
            }catch(e) {
               console.error( "Error fetching the url",e); 
            }       
    }

    fetchSuggestions(); 

    } ,[debouncedQuery , genre]);


    const handleClick = () => {
         nav('/addBooks'  , {state:{title :searchQuery ,author :author}});
    }

    const handleSuggestions = (title ,author)=> {
        console.log("suggestion showing")
        setSearchQuery(title);
        setAuthor(author);
        setSuggestions([]);
    }


    return (
        <div className="w-screen h-screen bg-image overlay ">
        <div className="flex items-center justify-center h-screen w-screen z-20">
        <div className="p-8 bg-gray-400 rounded-lg shadow-md flex flex-col items-center md:w-3/5 space-y-4 opacity-90 border-white border-6">
        <label className="text-lg font-bold text-violet-900 mt-2">Genre:</label>
<div className="flex flex-wrap gap-2 mt-1">
  {["", "fantasy", "fiction", "romance", "science", "mystery", "horror", "biography"].map((g) => (
    <button
      key={g}
      onClick={() => setGenre(g)}
      className={`px-3 py-1 rounded-full border transition hover:text-white ${
        genre === g
          ? "bg-violet-700 text-white border-violet-700"
          : "bg-white text-violet-700 border-violet-400"
      }`}
    >
      {g === "" ? "All" : g.charAt(0).toUpperCase() + g.slice(1)}
    </button>
  ))}
</div>

    <div className=" relative w-full ">
    <label className="text-lg text-violet-900 font-bold">Search : </label>
    <input name="search" id="search" className="border border-gray-300 rounded h-12 w-full px-4 z-200"
 placeholder="Type to search..." onChange={(e)=> setSearchQuery(e.target.value)} value={searchQuery} ></input>
   <div>
        {
            suggestions.length>0 && searchQuery && (
                <ul className="absolute bg-white border border-gray-300 w-full mt-1 rounded shadow-md z-30 max-h-60 overflow-y-auto">
                {
                        suggestions.map((items , index)=>{
                            return (<li
                             key = {index}
                             className="p-2 hover:bg-gray-200 cursor-pointer"
                             onClick={() => handleSuggestions(items.volumeInfo.title , items.volumeInfo.authors)}>
                               {items.volumeInfo.title} , by <strong>{items.volumeInfo.authors}</strong> 
                            </li>)

                        })
                    }
                </ul>
            )
        } 
        </div>
        </div>  
       <button className="text-white px-6 py-2 rounded shadow hover:bg-violet-700"
 type="submit" onClick={handleClick}>Add</button>
        </div>

       </div>
        </div>
       
    );
}

export default SearchBar ; 