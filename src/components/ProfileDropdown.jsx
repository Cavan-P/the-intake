import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'

import { ChevronUpIcon } from "@heroicons/react/24/outline"
import { ChevronDownIcon } from "@heroicons/react/24/outline"

const gradientText = 'bg-gradient-to-r from-blue-400 via-pink-500 to-indigo-600 bg-clip-text text-transparent font-thin'

const ProfileDropdown = ({ buttonLabel, items }) => {

    const navigate = useNavigate()

    const [open, setOpen] = useState(false)
    const handleToggle = _ => {
        setOpen(prev => !prev)
    }

    const menuRef = useRef(null)

    useEffect(_ => {
        const handler = (event) => {
            if(open && menuRef.current && !menuRef.current.contains(event.target)){
                setOpen(false)
            }
        }

        document.addEventListener("mousedown", handler)
        document.addEventListener("touchstart", handler)
        return _ => {
            document.removeEventListener("mousedown", handler)
            document.removeEventListener("touchstart", handler)
        }
    }, [open])

    return (
        <div className="relative" ref={menuRef}>
            <button
                type="button"
                className={`inline-flex items-center justify-center rounded-md text-sm h-10 px-4 py-2 hover:cursor-pointer
                            ${gradientText} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                onClick={handleToggle}
            >
                {buttonLabel}
                <span className="ml-3 text-white">
                    {open ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
                </span>
            </button>

            {open && (
                <div className="absolute left-1/2 -translate-x-1/2 top-12 z-50">
                    <ul className="w-56 bg-black border border-gray-800 rounded-md shadow-lg p-1 text-white text-sm font-thin">
                        {items.map((item, index) => (
                            <li
                                key={index}
                                className="relative flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer
                                           hover:bg-gradient-to-r hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700"
                            >
                                {item.icon && <span className="w-5 h-5">{item.icon}</span>}
                                {item.url ? (
                                    <Link
                                        to={item.url}
                                        className="w-full text-left"
                                        onClick={() => setOpen(false)}
                                    >
                                        {item.title}
                                    </Link>
                                ) : (
                                    <button
                                        type="button"
                                        className="w-full text-left bg-transparent border-none p-0"
                                        onClick={() => {
                                            item.action?.()
                                            setOpen(false)
                                        }}
                                    >
                                        {item.title}
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default ProfileDropdown