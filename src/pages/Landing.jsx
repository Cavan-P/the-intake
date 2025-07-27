import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

//Components
import TaglineFader from "../components/TaglineFader"
import Carousel from '../components/Carosuel'

const Landing = _ => {
  const navigate = useNavigate()

  const slides = [
    {
      title: "",
      content: (
        <>
            <h1 className="text-8xl font-inter tracking-widest bg-gradient-to-br from-blue-400 via-fuchsia-500 to-indigo-600 text-transparent bg-clip-text font-thin">
                The Intake
            </h1>
            <TaglineFader />
          </>
      )
    },
    {
      title: "",
      content: (
        <>
            <h1 className="text-8xl font-inter tracking-wide bg-gradient-to-br from-blue-400 via-fuchsia-500 to-indigo-600 text-transparent bg-clip-text font-thin">
                The Mission
            </h1>
            <p className="text-center text-white/80 mt-4 text-sm font-extralight tracking-wide">
                The goal when I set out on this project was simple - a way to quickly and accurately track what I eat.  I've tried various macro tracking apps and
                none of them worked for me.  After exercising consistently for just over a year, I decided it was finally time to make healther eating habits.  
                I knew I had to create a plan as far as what I needed to eat, but all of the options for <i>how</i> I do so seemed either too expensive,
                too tedious, or too complicated.  So, I settled on creating The Intake, designed to fit my workflow.<br/>
                Forever simple.  Forever accurate.  Forever free.
            </p>
        </>
      )
    },
    {
      title: "",
      content: (
        <>
            <h1 className="text-8xl font-inter tracking-wide bg-gradient-to-br from-blue-400 via-fuchsia-500 to-indigo-600 text-transparent bg-clip-text font-thin">
                The Journey
            </h1>
            <p className="text-center text-white/80 mt-4 text-sm font-extralight tracking-wide">
                I broke my arm in the fall of 2023.  After a few weeks of physical therapy and some doctor-prescribed mobility exercises, my range of motion
                was pretty much back to normal, but strength left much to be desired.  I wasn't very strong or fit to begin with, so I was a little bit
                glad when my brother dragged me to the gym with him.  Once I got consistent with workouts, I started wondering: how many calories should I be
                eating? How much protein do I actually get?  What even counts as healthy?  I had tried and failed more than once
                to track my food intake with different apps and even just on paper, but nothing worked for me.  Fast forward a year when I reached a good 
                starting over point in life and decided: time to actually get my diet together.  I wanted to be as accurate as possible, making sure to
                track the exact foods I was eating, not something similar from some global database.  And so it began: the quest to create a simple and accurate
                macro tracker that's not hidden behind a ten-foot paywall, because tools for a healthy lifestyle should be available for everyone.
            </p>
        </>
      )
    },
    {
      title: "",
      content: (
        <>
            <h1 className="text-8xl font-inter tracking-wide bg-gradient-to-br from-blue-400 via-fuchsia-500 to-indigo-600 text-transparent bg-clip-text font-thin">
                The Features
            </h1>
            <ul className="text-left text-white/80 mt-4 text-sm font-extralight tracking-wide ml-auto mr-auto space-y-2 list-disc">
                <li>Add custom ingredients with exact macros, brand names, and serving sizes - no more guessing from crowdsourced junk.</li>
                <li>Create, save, and share full recipes with friends, or just future you when you forget what you made last Tuesday.</li>
                <li>Track full meals by combining saved recipes and ingredients - build once, log forever.</li>
                <li>Log meals with one tap, and view daily macro breakdowns without digging through five menus.</li>
                <li>Export your ingredient and recipe data any time - it's your data, not some company's locked vault.</li>
                <li>Set custom macro goals based on your fitness needs - cutting, bulking, maintaining, you name it.</li>
                <li>Completely free to use, with no upsells, locked features, or “premium” paywalls in sight.</li>
            </ul>
        </>
      )
    },
    {
      title: "",
      content: (
        <>
            <h1 className="text-8xl font-inter tracking-wide bg-gradient-to-br from-blue-400 via-fuchsia-500 to-indigo-600 text-transparent bg-clip-text font-thin">
                The Thanks
            </h1>
            <p className="text-center text-white/80 mt-4 text-sm font-extralight tracking-wide">
                This project started because I needed it for me, and it finished because I needed it for you.  I'm grateful you're here and hope it makes
                tracking your macros a little easier.  If you have feedback, ideas, or just want to say hi, I'd love to hear from you.  Regardless of whether 
                you choose to stick around or not, thank you for taking the time to check out The Intake.<br/><br/>
                <span className="text-left block">- Cavan</span>
            </p>
        </>
      )
    },
  ]

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

                <Carousel slides={slides} />

                <button
                    className="mt-8 px-6 py-3 bg-transparent text-indigo-500 rounded border border-indigo-500 hover:bg-gradient-to-r hover:from-indigo-500 hover:via-purple-600 hover:to-blue-500 hover:text-white transition duration-300 cursor-pointer"
                    onClick={() => navigate('/get-started')}
                >
                    Get Started
                </button>


            </main>
        </div>
    )
  
}

export default Landing