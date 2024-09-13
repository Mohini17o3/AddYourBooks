import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import App from "./App.jsx"
import './index.css'
import BookList from './components/BookList.jsx'
import AddBook from './components/AddBook.jsx'
import Landing from './components/Landing.jsx'
import Analytics from './components/Analytics.jsx'


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children : [ 

      {
        path:"/" , 
        element : <Landing />
      
      }, 

      {
        path:"/analytics" , 
        element : <Analytics />
      
      }, 
      {
        path :"/books" , 
        element: <BookList status="read" />
      
      },
      {
        path: "/addBooks",
        element : <AddBook />
      }
    ]

    
  },
 

]);



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
    </StrictMode>
)
