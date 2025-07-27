import React from 'react'
import FadeInCard from '../components/FadeInCard'
import BackToLanding from '../components/BackToLanding'

const GetStarted = _ => {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center px-6 py-16 space-y-12">
            <h1 className="text-6xl tracking-widest text-center bg-gradient-to-r from-indigo-400 via-purple-500 to-blue-400 text-transparent bg-clip-text font-thin my-0">
                Performace Starts Here
            </h1>
            <h2 className="font-thin text-center text-gray-300 tracking-wider text-lg">
                Fuel with purpose.  Grow with consistency.
            </h2>

            <FadeInCard title="Track Your Macros">
                <p className="text-sm text-gray-300">
                    Log what you eat and see your progress in real-time. Stay on top of your protein, carbs,
                    fats, and calories with zero fluff.
                </p>
            </FadeInCard>

            <FadeInCard title="Save Recipes and Ingredients">
                <p className="text-sm text-gray-300">
                    Store your go-to meals and custom ingredients. No more re-entering every detail each time
                    you eat.
                </p>
            </FadeInCard>

            <FadeInCard title="See the Bigger Picture">
                <p className="text-sm text-gray-300">
                    Charts and graphs (coming soon!) give you insight into your daily, weekly, and monthly
                    eating patterns.
                </p>
            </FadeInCard>

            <FadeInCard title="Built for Simplicity">
                <p className="text-sm text-gray-300">
                    The Intake is made to stay out of your way. Tap a few buttons, get back to your life. No
                    ads, no dopamine traps.
                </p>
            </FadeInCard>

            <FadeInCard title="Ready to Roll?">
                <p className="text-sm text-gray-300">
                    Sign up and start fueling your body like the machine it is. Whether you're bulking, cutting,
                    or cruising—The Intake's got you.
                </p>
                <div className="mt-6">
                    <a
                        href="/signup"
                        className="inline-block px-6 py-2 rounded border border-indigo-500 text-indigo-400 hover:bg-indigo-500 hover:text-black transition duration-200"
                    >
                        Sign Up
                    </a>
                </div>
            </FadeInCard>

            <BackToLanding />
        </div>
    )
}

export default GetStarted
