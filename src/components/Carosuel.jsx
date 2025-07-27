import React, { useState } from 'react'

import Arrow from './Arrow'

const Carousel = ({ slides }) => {
    const [current, setCurrent] = useState(0)

    const prev = _ => setCurrent((current - 1 + slides.length) % slides.length)
    const next = _ => setCurrent((current + 1) % slides.length)

    return (
        <div className="relative max-w-4xl w-full mx-auto flex flex-col items-center px-6 py-12">
            <div className="w-full min-h-[220px] flex flex-col items-center text-center text-white select-none relative">
                <h2 className="text-5xl font-thin mb-4 bg-gradient-to-r from-indigo-400 via-purple-500 to-blue-400 bg-clip-text text-transparent tracking-wide">
                    {slides[current].title}
                </h2>
                <div className="max-w-xl text-lg font-light text-gray-300">
                    {slides[current].content}
                </div>
            </div>

            <div className="absolute top-1/2 left-0 -translate-y-1/2">
                <Arrow direction="left" onClick={prev} />
            </div>
            <div className="absolute top-1/2 right-0 -translate-y-1/2">
                <Arrow direction="right" onClick={next} />
            </div>

            <div className="flex space-x-3 mt-8">
                {slides.map((_, i) => (
                <div
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`w-3 h-3 rounded-full cursor-pointer transition ${
                    i == current ? 'bg-indigo-600/50' : 'bg-purple-700/30'
                    }`}
                />
                ))}
            </div>
        </div>
    )

}

export default Carousel