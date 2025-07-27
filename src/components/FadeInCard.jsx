import React, { useEffect, useRef, useState } from 'react'

const FadeInCard = ({ title, children }) => {
    const ref = useRef()
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true)
                    observer.disconnect()
                }
            },
            { threshold: 0.1 }
        )
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [])

    return (
        <div
            ref={ref}
            className={`transition-opacity duration-1000 transform ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            } bg-gradient-to-br from-indigo-500/30 via-purple-500/30 to-pink-700/30 p-[2px] rounded-2xl my-8 max-w-2xl w-full mx-auto`}
        >
            <div className="bg-gradient-to-br from-[#281e2f] to-[#2a3140] text-white rounded-[calc(1rem-1px)] shadow-xl p-6">
                <h2 className="text-2xl font-semibold tracking-wide mb-3">{title}</h2>
                <div className="text-sm leading-relaxed text-white/80">{children}</div>
            </div>
        </div>
    )
}

export default FadeInCard
