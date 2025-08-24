import { React, useState, useEffect } from 'react'
import supabase from '../utils/supabase'
import BackToHome from '../components/BackToHome'

const Account = _ => {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()

            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single()

            setUser(data)
            setLoading(false)
        }
        fetchUser()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white font-thin tracking-wide">
                Loading account info...
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black px-6 py-12 text-white font-thin tracking-wide mx-auto">
            <BackToHome />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:space-x-6 mb-12">
                <div className="flex-shrink-0">
                    {/* Placeholder avatar */}
                    <img className="w-32 h-32 rounded-fulllex items-center justify-center" src={user.avatar_url} />
                </div>

                <div className="mt-4 md:mt-0 flex-1">
                    <h1 className="text-5xl font-thin bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        {user.username}
                    </h1>

                    <p className="text-gray-400 text-sm uppercase tracking-wide mt-1">
                        {`Member since ${new Date(user.created_at).toLocaleDateString()}`}
                    </p>

                    <p className="text-gray-300 mt-4 whitespace-pre-wrap">
                        {user.bio || "No bio set yet."}
                    </p>

                    {/* Titles */}
                    <div className="flex flex-wrap mt-4 gap-2">
                        {user.is_super_admin && (
                            <span className="px-4 py-1 border border-indigo-500 rounded-full text-indigo-400 uppercase text-xs tracking-wide font-semibold">
                                Admin
                            </span>
                        )}
                        {user.custom_titles?.map((title, idx) => (
                            <span key={idx} className="px-4 py-1 border border-indigo-500 rounded-full text-indigo-400 uppercase text-xs tracking-wide font-semibold">
                                {title}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Account Info Form */}
            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-thin bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                        Personal Info
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Username" className="w-full bg-black/20 border border-white/20 px-3 py-2 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        <input type="date" placeholder="Birthday" className="w-full bg-black/20 border border-white/20 px-3 py-2 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        <input type="number" placeholder="Height (in)" className="w-full bg-black/20 border border-white/20 px-3 py-2 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        <input type="number" placeholder="Weight (lbs)" className="w-full bg-black/20 border border-white/20 px-3 py-2 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        <select className="w-full bg-black/20 border border-white/20 px-3 py-2 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                            <option>Male</option>
                            <option>Female</option>
                        </select>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-thin bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                        Goals
                    </h2>
                    <input type="number" placeholder="Daily Calorie Goal" className="w-full bg-black/20 border border-white/20 px-3 py-2 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>

                <div>
                    <h2 className="text-2xl font-thin bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                        Security
                    </h2>
                    <input type="password" placeholder="Change Password" className="w-full bg-black/20 border border-white/20 px-3 py-2 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>

                <button className="mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded text-white text-lg">
                    Save Changes
                </button>
            </div>
        </div>
    )
}

export default Account
