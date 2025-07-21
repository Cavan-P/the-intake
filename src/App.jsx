import { useState, useEffect, useRef } from 'react'
import { Routes, Route, useNavigate, useParams } from 'react-router-dom'

//CSS
import './App.css'

//Components


//Pages
import Landing from "./pages/Landing"

function App() {
  return (
    <Routes>
      //Landing page (CTA, sign in, sign up)
      <Route path='/' element={<Landing /> } />
    </Routes>
  )
}

export default App
