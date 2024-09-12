import { atom } from "jotai";

const pictures = [
    "Book_cover.png",
    "image1.jpg" , 
    "image2.jpg" , 
    "image3.jpg" , 
    "image4.jpg" , 
    "image5.avif" , 
    "image6.jpg" , 
    "image7.jpg" ,
    "image8.jpg" ,
    "Book_end.png"
]


export const pageAtom = atom(0);

export const pages = [
 {
    front : pictures[0], 
    back : pictures[0]
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
        front: pictures[pictures.length-1], 
        back : pictures[pictures.length-1]
    });



    }


