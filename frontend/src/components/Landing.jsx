import React, { Suspense } from 'react';
import {atom , useAtom} from "jotai";
import { Canvas } from "@react-three/fiber";
import { Experience } from './Experience';
import { Loader } from '@react-three/drei';


const pictures = [
    "Book_cover.png", 
    "image1.jpg" , 
    "image2.jpg" , 
    "image3.jpg" , 
    "image4.jpg" , 
    "image5.avif" , 
    "image6.jpg" , 
    "image7.jpg" ,
     "Book_end.png"
    
]


export const pageAtom = atom(0);

export const pages = [
 {
    front : pictures[0], 
    back : pictures[1]
 },

];

for(let i = 1 ; i<pictures.length-1 ;i+=2) 
    {

    pages.push({
    front : pictures[i % pictures.length] ,
    back : pictures[(i+1) % pictures.length],
});

pages.push(
    {
        front: pictures[pictures.length-2], 
        back : pictures[pictures.length-1],
    }
)

}

function Landing() {

    const [page , setPage] = useAtom(pageAtom);
    
    return (
        <>
        <Loader />  
        <div>

        <div className="flex flex-row mt-4 items-center justify-center text-black">
            <div className="text-center">
                <h1 className="text-6xl font-bold mb-8 mt-4 text-gray-400">Welcome to Your Reading List</h1>
                <p className="text-4xl text-white mb-8 font-zeyada font-semibold">
                    Organize your books, track your reading progress, and dive into your next adventure.
                </p>
 
            </div>
            </div>
            <div className="flex items-center justify-center">
</div>

       <Canvas  shadows camera= {{position:[-0.5 , 1, 4]  , fov : 45} }>
        <group position-y={0}> 
           <Suspense fallback={null}>
            <Experience />
           </Suspense>
        </group>
        </Canvas>
           
      {/* for buttons of pages */}

               <div className="mt-16 w-[100vw] h-[100vh] pointer-events-auto flex justify-center overflow-auto">
               <div className="overflow-auto flex items-center gap-4 max-w-full p-10">
               {[...pages].map( (_ , index)=> (
           
           <button
           key = {index}
           className={`border-transparent hover:border-white transition-all duration-300 px-4 py-3 rounded-full text-lg uppercase shrink-0 border ${index === page ? "bg-white/90 text-black" : "bg-black/30 text-white"}  `}
           onClick={() => setPage(index)}            
           >   {index === 0 ? "Cover" : `Page ${index}`}
            </button>
            ) )}

            <button
              className={`border-transparent hover:border-white transition-all duration-300  px-4 py-3 rounded-full  text-lg uppercase shrink-0 border ${
                page === pages.length
                  ? "bg-white/90 text-black"
                  : "bg-black/30 text-white"
              }`}
              onClick={() => setPage(pages.length)}
            >
              Back Cover
            </button>
         </div>
            </div>


            <div className="flex items-center justify-center space-x-4 mb-8">
            <p className="font-zeyada text-white text-4xl"> What are you waiting for ?</p>
                    <button 
                    className="text-white font-semibold py-2 px-4 rounded-lg"
                    onClick={()=>( window.location.assign("/addBooks") )}
                    >
                        Get Started
                    </button>
                    {/* <button className="bg-transparent hover:bg-white hover:text-gray-900 border border-white text-white font-semibold py-2 px-4 rounded-lg">
                        Learn More
                    </button> */}
                </div>
            </div>

            </>         
    );
}

export default Landing;
