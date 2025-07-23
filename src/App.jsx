import { useState, useEffect, useRef } from 'react'
import { Routes, Route, useNavigate, useParams } from 'react-router-dom'

//CSS
import './App.css'

//Components


//Pages
import Landing from "./pages/Landing"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import GetStarted from "./pages/Get-Started"
import Home from "./pages/Home"

function App() {
  return (
    <Routes>
      //Landing page (CTA, sign in, sign up)
      <Route path='/' element={<Landing /> } />
      <Route path='login' element={<Login /> } />
      <Route path='signup' element={<Signup /> } />
      <Route path='get-started' element={<GetStarted /> } />
      <Route path='/home' element={<Home /> } />
    </Routes>
  )
}

export default App
