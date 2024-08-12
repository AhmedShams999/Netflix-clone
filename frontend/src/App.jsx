import { Navigate, Route, Routes } from "react-router-dom"

import LoginPage from "./pages/LoginPage"
import SignUpPage from "./pages/SignUpPage"
import Spinner from "./components/Spinner"
import Footer from "./components/Footer"
import{ Toaster } from 'react-hot-toast';
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import Home from "./pages/home/Home"
import { createContext, useContext, useState } from "react"
import WatchPage from "./pages/WatchPage"
import SearchPage from "./pages/SearchPage"
import HistoryPage from "./pages/HistoryPage"
import NotFoundPage from "./pages/NotFoundPage"
import PersonPage from "./pages/PersonPage"

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);


function App() {
  const[contentType,setContentType]= useState("movie")
  const {data:authUser,isLoading,isError,error} = useQuery({
    queryKey: ["authUser"],
    queryFn: async()=>{
      try {
        // const res = await fetch("/api/v1/auth/me")
        // const data = await res.json()
        // console.log(data)
        // if(!res.ok) throw new Error(data || "Something went wrong")
        const res = await axios.get("/api/v1/auth/me")
        // console.log(res.data)
        return res.data
      } catch (error) {
        // console.log(error.response.data)
        if(error.message.includes("401")){
          return error.response.data
        }
        throw new Error(error.message)
      }
    },
    retry: false,
  })
  // console.log(authUser)
  if(isLoading){
    return(
      <div className="h-screen flex justify-center items-center">
        <Spinner />
      </div>
    )
  }

  // TODO make a /actor/name route 

  return (
    <AuthContext.Provider value={{contentType,setContentType}}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!authUser.success?<LoginPage />:<Navigate to={"/"} />} />
        <Route path="/signup" element={!authUser.success?<SignUpPage />:<Navigate to={"/"} />} />
        <Route path="/watch/:id" element={authUser.success?<WatchPage />:<Navigate to={"/login"} />} />
        <Route path="/search" element={authUser.success?<SearchPage />:<Navigate to={"/login"} />} />
        <Route path="/history" element={authUser.success?<HistoryPage />:<Navigate to={"/login"} />} />
        <Route path="/person/:name/:id" element={authUser.success?<PersonPage />:<Navigate to={"/login"} />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
      <Toaster />
    </AuthContext.Provider>
  )
}

export default App
