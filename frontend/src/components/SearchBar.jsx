import React from "react";
import { useState } from "react";
import {useNavigate} from "react-router-dom";
const SearchBar = ()=> {
    const nav = useNavigate();
    const[searchQuery , setSearchQuery] = useState("");
    const[suggestions , setSuggestions]  = useState([]);
    const [author , setAuthor] = useState('');


    const handleChange = async(e)=> {
        const query = e.target.value ;
        setSearchQuery(query);

        if(!query) {
            setSuggestions([]);
            return ;
        }
         const url = `https://www.googleapis.com/books/v1/volumes?q=${query}+intitle+inauthor`;
         try {
            const response  = await fetch(url);
            if(!response.ok){
                throw new Error(`Response status : ${response.status}`);
            }
            const data = await response.json();
            setSuggestions(data.items || []);
         }catch(e) {
            console.error( "Error fetching the url",e); 
         }
    }


    const handleClick = () => {
         nav('/addBooks'  , {state:{title :searchQuery ,author :author}});
    }

    const handleSuggestions = (title ,author)=> {
        setSearchQuery(title);
        setAuthor(author);
        setSuggestions([]);
    }


    return (
        <div className="w-screen h-screen bg-image overlay">
        <div className="flex items-center justify-center h-screen w-screen z-20 relative ">
        <div className="p-8 bg-gray-400 rounded-lg shadow-md flex flex-col items-center md:w-3/5 space-y-4 opacity-90 border-white border-6">
              <label className="text-2xl text-violet-900 font-bold">Search : </label>
          <div className=" relative w-full ">
         <input name="search" id="search" className="border border-gray-300 rounded h-12 w-full px-4 z-200"
 placeholder="Type to search..." onChange={handleChange} value={searchQuery} ></input>
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