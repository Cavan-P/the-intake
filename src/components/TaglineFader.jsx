import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const taglines = [
    "What you feed your body shapes your machine.",
    "Precision fueling for peak performance.",
    "Smart tracking, stronger living.",
    "Fuel your machine with purpose.",
    "Your intake drives your output.",
    "Feed the engine that moves you.",
    "Efficiency starts with what you eat."
]

const TaglineFader = _ => {
    const [index, setIndex] = useState(0)

    useEffect(_ => {
        const interval = setInterval(_ => {
            setIndex(prev => (prev + 1) % taglines.length)
        }, 7000)

        return _ => clearInterval(interval)
    }, [taglines.length])

    return (
        <div className="relative w-full flex items-center justify-center">
            <AnimatePresence mode="wait">
                <motion.p
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-center text-white mt-4 text-xl max-w-md font-extralight tracking-wide"
                >
                    {taglines[index]}
                </motion.p>
            </AnimatePresence>
        </div>
    )
}

export default TaglineFader