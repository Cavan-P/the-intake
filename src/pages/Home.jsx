import React, { useState, useEffect } from 'react'
import supabase from '../utils/supabase'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const [username, setUsername] = useState('')
    const [loading, setLoading] = useState(true)
    const [avatarURL, setAvatarURL] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()

            if(session && session.user) {
                setUsername(session.user.user_metadata?.username || '')
                setAvatarURL(session.user.user_metadata?.avatar_url || '')
            }

            setLoading(false)
        }

        getUser()
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/login')
    }

    if (loading) {
        return <p className="text-white text-center mt-10">Loading...</p>
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center px-6 py-8">
            <header className="w-full max-w-4xl flex items-center justify-between mb-10">
                <div className="flex items-center space-x-4">
                    <img
                        src={avatarURL || 'https://www.gravatar.com/avatar/?d=mp&s=48'}
                        alt="Profile"
                        className="w-12 h-12 rounded-full border border-white/30"
                    />
                    <span className="text-lg font-extralight tracking-wide">{username || 'User'}</span>
                </div>

                <nav className="flex space-x-6 text-white/70 font-light tracking-wide">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="hover:text-indigo-500 transition"
                    >
                        Dashboard
                    </button>
                    <button
                        onClick={() => navigate('/settings')}
                        className="hover:text-indigo-500 transition"
                    >
                        Settings
                    </button>
                </nav>

                <button
                    onClick={handleLogout}
                    className="border border-red-700 text-red-600 px-4 py-2 rounded hover:bg-red-600 hover:text-white transition cursor-pointer font-light"
                >
                    Log Out
                </button>
            </header>

            <main className="w-full max-w-4xl text-center">
                <h1 className="text-5xl font-thin tracking-wide bg-gradient-to-r from-blue-400 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent mb-8">
                    Welcome, {username}!
                </h1>

                <p className="text-white/70 mb-12 font-extralight tracking-wide max-w-xl mx-auto">
                    You've successfully logged in. This is your home base. More cool stuff coming soon.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <section className="bg-white/5 rounded-lg p-6 font-light tracking-wide">
                        <h2 className="text-xl mb-3 font-semibold text-white/90">Dashboard</h2>
                        <p className="text-white/60">
                            Probably hopefully maybe put charts here or something else that will be cool.
                        </p>
                    </section>

                    <section className="bg-white/5 rounded-lg p-6 font-light tracking-wide flex flex-col items-center">
                        <h2 className="text-xl mb-3 font-semibold text-white/90">Quick Actions</h2>
                        <button
                            onClick={() => navigate('/ingredients')} // or whatever your route is
                            className="px-5 py-2 rounded bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 text-white font-thin hover:brightness-110 transition"
                        >
                            View Your Ingredients
                        </button>
                    </section>
                </div>
            </main>
        </div>
    )
}

export default Home
