import React, { Suspense } from 'react';
import { Canvas } from "@react-three/fiber";
import { Experience } from './Experience';
import { pages, pageAtom } from './pageStore';  
import { useAtom } from "jotai";
import { Link } from 'react-router-dom';


function Landing() {

    const [page , setPage] = useAtom(pageAtom);
    
    return (
        <>

      {/* for buttons of pages */}
     <main>
        <div className="flex flex-row mt-4 items-center justify-center text-black">
            <div className="text-center">
                <h1 className="text-4xl md:text-6xl font-bold mb-8 mt-4 text-gray-400">Welcome to Your Reading List</h1>
                <p className="text-2xl md:text-4xl mb-2 font-zeyada font-semibold text-white">
                    Organize your books, track your reading progress, and dive into your next adventure.
                </p>
 
            </div>
            </div>
<div className='relative w-full h-64 md:h-[100vh]'>
     <Canvas shadows camera= {{ position: [-0.5, 1, 4], fov: 45 }} >
         <group position-y={0}> 
          <Suspense fallback={null}>
            <Experience />
          </Suspense>
         </group>
         </Canvas> 

        </div>        
               <div className="w-full overflow-auto pointer-events-auto flex justify-center">
               <div className="overflow-auto flex items-center gap-4 max-w-full md:p-10">
               {[...pages].map( (_ , index)=> (
           
           <button
           key = {index}
           className={`border-transparent hover:border-white transition-all duration-300 md:px-4 md:py-3 rounded-full md:text-lg uppercase shrink-0 border ${index === page ? "bg-white/90 text-black" : "bg-black/30 text-white"}  `}
           onClick={() => setPage(index)}            
           >   {index === 0 ? "Cover" : `Page ${index}`}
            </button>
            ) )}

            <button
              className={`border-transparent hover:border-white transition-all duration-300 md:px-4 md:py-3 rounded-full  md:text-lg uppercase shrink-0 border ${
                page === pages.length
                  ? "bg-white/90 text-black"
                  : "bg-black/30 text-white"
              }`}
              onClick={() => 
              
              { setPage(pages.length) ;
               console.log(page) ;
               }
               }
            >
              Back Cover
            </button>
         </div>
     </div>
</main>

            <div className="flex items-center justify-center space-x-4 mb-8">
            <p className="font-zeyada text-white md:text-4xl p-4"> What are you waiting for ?</p> 
                    <Link to="/addBooks">
                    <button 
                    className="text-white font-semibold md:py-2 md:px-4  rounded-lg"
                    >
                        Get Started
                    </button>
                    </Link>
 
                </div>

            </>         
    );
}

export default Landing;
