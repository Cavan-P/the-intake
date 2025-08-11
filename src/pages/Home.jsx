import React, { useState, useEffect } from 'react'
import supabase from '../utils/supabase'
import { useNavigate } from 'react-router-dom'

import ProfileDropdown from '../components/ProfileDropdown'

import { UserIcon } from '@heroicons/react/24/outline'
import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/outline'

const Home = _ => {
    const [username, setUsername] = useState('')
    const [loading, setLoading] = useState(true)
    const [avatarURL, setAvatarURL] = useState('')
    const [tiid, setTiid] = useState('')

    const navigate = useNavigate()

    useEffect(() => {
        
        let subscription = null

        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()

            if(session && session.user) {

                const { data, error } = await supabase
                    .from('users')
                    .select('username, avatar_url')
                    .eq('id', session.user.id)
                    .single()

                if(error){
                    console.error('Error fetching user profile:', error)
                    setUsername(session.user.user_metadata?.username || '')
                    setAvatarURL(session.user.user_metadata?.avatar_url || '')
                    setTiid(session.user.id)
                }
                else {
                    setUsername(data.username)
                    setAvatarURL(data.avatar_url)
                    setTiid(session.user.id)
                }
            

                setLoading(false)
            }
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
                <ProfileDropdown 
                    buttonLabel={(
                        <div 
                            className="flex items-center space-x-4"
                        >
                            <img
                                src={avatarURL || 'https://www.gravatar.com/avatar/?d=mp&s=48'}
                                alt="Profile"
                                className="w-12 h-12 rounded-full border border-white/30"
                            />
                            <span className="text-lg font-extralight tracking-wide text-white">{username || 'User'}</span>
                        </div>
                    )}
                    items={[
                        { title: "Profile", url: `/profile/tiid_${tiid}`, icon: <UserIcon /> },
                        { title: "Settings", url: "/settings", icon: <Cog6ToothIcon /> },
                        { title: "About", url: "/about", icon: <InformationCircleIcon /> },
                        { title: "Log Out", action: handleLogout, icon: <ArrowLeftStartOnRectangleIcon /> },
                    ]}
                />

                

                <nav className="flex space-x-6 text-white/70 font-light tracking-wide">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="hover:text-indigo-500 transition cursor-pointer"
                    >
                        Dashboard
                    </button>
                    <button
                        onClick={() => navigate('/log')}
                        className="hover:text-indigo-500 transition cursor-pointer"
                    >
                        Daily Log
                    </button>
                    <button
                        onClick={() => navigate('/recipes')}
                        className="hover:text-indigo-500 transition cursor-pointer"
                    >
                        Recipes
                    </button>
                    <button
                        onClick={() => navigate('/ingredients')}
                        className="hover:text-indigo-500 transition cursor-pointer"
                    >
                        Ingredients
                    </button>
                    <button
                        onClick={() => navigate('/reports')}
                        className="hover:text-indigo-500 transition cursor-pointer"
                    >
                        Reports
                    </button>
                </nav>
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
                            onClick={() => navigate('/ingredients')}
                            className="px-5 py-2 rounded bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 text-white font-thin hover:brightness-110 transition"
                        >
                            View Your Ingredients
                        </button>
                        <button
                            onClick={() => navigate('/recipes')}
                            className="my-5 px-5 py-2 rounded bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 text-white font-thin hover:brightness-110 transition"
                        >
                            View Your Recipes
                        </button>
                    </section>
                </div>
            </main>
        </div>
    )
}

export default Home
