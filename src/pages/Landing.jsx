import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

//Components
import TaglineFader from "../components/TaglineFader"

const Landing = _ => {
  const navigate = useNavigate()

return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="flex justify-end p-6 gap-4">
        <button 
          className="text-gray-300 hover:text-white hover:cursor-pointer"
          onClick={_ => navigate('/login')}
        >
          Log In
        </button>
        <button
          className="text-white border border-white px-4 py-2 rounded hover:bg-white hover:text-black transition hover:cursor-pointer"
          onClick={_ => navigate('/signup')}
        >
          Sign Up
        </button>
      </header>
  
      <main className="flex flex-col items-center justify-center flex-grow text-center px-4">
        <h1 className="text-8xl font-inter tracking-widest bg-gradient-to-br from-blue-400 via-fuchsia-500 to-indigo-600 text-transparent bg-clip-text font-thin">
          The Intake
        </h1>
        <TaglineFader />
        <button
          className="mt-8 px-6 py-3 bg-white text-black rounded hover:bg-white/90 transition hover:cursor-pointer"
          onClick={_ => navigate('/get-started')}
        >
          Get Started
        </button>
      </main>
    </div>
  )
  
}

export default Landing