import { pages } from "./Landing";
import { useRef } from "react";
const Page = ({number , front , back , ...props})=>{
  const group = useRef();

  return (
    <group {...props} ref={group}>
    <mesh scale={0.1}>
       <ambientLight />
      <boxGeometry />   
      <meshBasicMaterial color="red" />  
    </mesh>
  </group>
  )

}



function Book ({...props}) {

  return (
      <group{...props}>

    {  [...pages].map(
      
  (pageData , index) => 
        index == 0 ?        
     ( <Page 
        position-x ={index*0.5}
         key = {index} 
         number={index}
          {...pageData} />
      )
      : null
    

  )}
      </group>
  );


}

export default Book ; 