import React, { useState, useEffect } from 'react'
import supabase from '../utils/supabase'

const Home = _ => {
    const [username, setUsername] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(_ => {
        const getUser = async _ => {
            const { data: { session }, error } = await supabase.auth.getSession()

            if(session && session.user) {
                setUsername(session.user.user_metadata?.username || '')
            }

            setLoading(false)
        }

        getUser()
    }, [])

    if(loading){
        return <p className="text-white text-center mt-10">Loading...</p>
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-8">
            <div className="w-full max-w-4xl">
                <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-blue-500 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent">
                    Welcome, {username}!
                </h1>

                <p className="text-center text-gray-400 mb-10">
                    You've successfully logged in. This is your home base. More cool stuff coming soon.
                </p>

                {/* Placeholder for future sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-700 shadow-lg">
                        <h2 className="text-xl font-semibold mb-2">Dashboard</h2>
                        <p className="text-gray-400">Probably hopefully maybe put charts here or something else that will be cool</p>
                    </div>

                    <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-700 shadow-lg">
                        <h2 className="text-xl font-semibold mb-2">Quick Actions</h2>
                        <p className="text-gray-400">shortcuts to something here or something probably</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home

