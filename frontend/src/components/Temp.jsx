import { Bone, BoxGeometry,  Color,  Float32BufferAttribute,  MeshStandardMaterial,  Skeleton,  SkinnedMesh,  Uint16BufferAttribute,  Vector3 } from "three";
import { pages } from "./pageStore";
import { useMemo, useRef } from "react";


const PAGE_WIDTH = 1.28;
const PAGE_HEIGHT = 1.71; // 4:3 aspect ratio
const PAGE_DEPTH = 0.003;
const PAGE_SEGMENTS = 30;
const SEGMENT_WIDTH = PAGE_WIDTH / PAGE_SEGMENTS;




const pageGeometry =  new BoxGeometry(
    PAGE_WIDTH , 
    PAGE_HEIGHT ,
    PAGE_DEPTH ,
    PAGE_SEGMENTS, 
    2
) ;


pageGeometry.translate(PAGE_WIDTH /2 , 0 , 0);



const position = pageGeometry.attributes.position ; 
const vertex = new Vector3();
const skinIndexes = [] ;
const skinWeights = [] ;


for(let i = 0 ; i <position.count ; i++) {
     // GET ALL VERTICES

    vertex.fromBufferAttribute(position , i) ; // get the vertex
    const x = vertex.x ;   // get the x position of the vertex
    const skinIndex = Math.max(0 , Math.floor(x/SEGMENT_WIDTH));
    let skinWeight = (x % SEGMENT_WIDTH) /SEGMENT_WIDTH ;  // value from 0 to 1 , 0 means no impact , 1 means complete impact of the bone obviously

    skinIndexes.push(skinIndex , skinIndex+1 , 0 , 0);
    skinWeights.push(1-skinWeight , skinWeight , 0  , 0);
}
    //attach these above attributes to the gemoetry
pageGeometry.setAttribute("skinIndex" , new Uint16BufferAttribute(skinIndexes , 4));

pageGeometry.setAttribute("skinWeight" , new Float32BufferAttribute(skinWeights , 4) );


const whiteColor = new Color("white");

const pageMaterials = [

    new MeshStandardMaterial({
        color : whiteColor,
    }) ,
    new MeshStandardMaterial({
        color : "#111",
    }) ,
    new MeshStandardMaterial({
        color : whiteColor,
    }) ,
    new MeshStandardMaterial({
        color : whiteColor,
    }) ,
    new MeshStandardMaterial({
        color : "pink",
    }) ,
    new MeshStandardMaterial({
        color : "blue",
    }) ,

]

// create a skinned mesh , since it will be unique for every page , create it inside the component , not as a separate constant 


const Page = ( {number , front , back ,...props} )=>{
 const group = useRef();

 const skinnedMeshRef = useRef() ;

 const manualSkinnedMesh = useMemo(()=>{

    // creating bones 
    const bones = [] ;
for(let i = 0 ; i <= PAGE_SEGMENTS ; i++){
     let bone  = new Bone();
     bones.push(bone);
     if(i===0){
        bone.position.x = 0;
     }else{
        bone.position.x = SEGMENT_WIDTH;
     }
  
  if(i>0) {
    bones[i-1].add(bone);   /// attach the new bone to previous one as a child of it 
  } }

// creating skeleton

const skeleton = new Skeleton(bones);

const materials = pageMaterials ;
const mesh = new SkinnedMesh(pageGeometry , materials);
mesh.castShadow =true;
mesh.receiveShadow=true;
mesh.frustumCulled = false;
mesh.add(skeleton.bones[0]);    // add the root bone to mesh
mesh.bind(skeleton);   // bind skeleton to mesh   
return mesh ; 
}  , []);



 return (
 <group {...props} ref={group} >
  <primitive object = {manualSkinnedMesh} ref={skinnedMeshRef} />

  </group>

       
    )

};

export const Temp = ({...props}) => {
    return (
        <group {...props}>
            {pages.map((pageData , index) =>{

                console.log(pages);
                return (


              index ===0 ? <Page
                    position-x = {index*0.15}
                    key={index}
                    number={index}
                    {...pageData}
                     
                   />   : null
               )
            })}
        </group>
    )
}