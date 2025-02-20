import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'; 
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import App from "./App.jsx"
import './index.css'
import BookList from './components/BookList.jsx'
import AddBook from './components/AddBook.jsx'
import Landing from './components/Landing.jsx'
import SearchBar from './components/SearchBar.jsx';
import TopBooks from './components/topBooks.jsx';
import { Analytics } from "@vercel/analytics/react"
import AnalyticsForBooks from './components/Analytics.jsx';
import Login from './components/Login.jsx';
import SignUp from './components/SignUp.jsx';
import Recommendations from './components/Recommendations.jsx';

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
        element : <AnalyticsForBooks />
      
      }, 
      {
        path :"/books" , 
        element: <BookList status="read" />
      
      },
      {
        path: "/addBooks",
        element : <AddBook />
      },  
      {
        path : "/searchBar",
        element : <SearchBar />
      },
      {
        path : "/signUp",
        element : <SignUp />
      }, 
      {
        path : "/login",
        element : <Login />
      }, 
      {
        path : "/topBooks",
        element :<TopBooks/>
      },
      {
        path : "/recommendations",
        element :<Recommendations />
      }

    ]

    
  },
 

]);

const root = createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
  <Analytics />
    <RouterProvider router={router} />
    </StrictMode>
)
