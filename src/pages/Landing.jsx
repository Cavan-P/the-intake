import React, { useState } from 'react'

const Landing = _ => {
    // App.jsx or LandingPage.jsx
return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="flex justify-end p-6 gap-4">
        <button className="text-gray-300 hover:text-white">Log In</button>
        <button className="text-white border border-white px-4 py-2 rounded hover:bg-white hover:text-black transition">Sign Up</button>
      </header>
  
      <main className="flex flex-col items-center justify-center flex-grow text-center px-4">
        <h1 className="text-8xl font-inter tracking-widest bg-gradient-to-br from-blue-400 via-fuchsia-500 to-violet-600 text-transparent bg-clip-text font-thin">
          The Intake
        </h1>
        <p className="text-gray-400 mt-4 text-xl max-w-md font-extralight">
          What you feed your body shapes your machine.
        </p>
        <button className="mt-8 px-6 py-3 bg-white text-black rounded hover:bg-opacity-90 transition">
          Get Started
        </button>
      </main>
    </div>
  )
  
}

export default Landing