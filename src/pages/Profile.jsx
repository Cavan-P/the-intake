import { React, useEffect, useState } from 'react'
import supabase from '../utils/supabase'
import { useParams, useNavigate } from 'react-router-dom'

//Components
import BackToHome from '../components/BackToHome'

const Profile = _ => {

    const param = useParams()
    const slug = param.id

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const navigate = useNavigate()

    const fetchUser = async slug => {
        if(slug.startsWith('tiid_')){
            const uuid = slug.replace('tiid_', '')

            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', uuid)
                .single()

                if(error){
                    console.error("Error fetching user from TIID:", error)
                    setError('User not found or error loading profile')
                }

            return data
        }
        else {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('username', slug)
                .single()

            if(error){
                console.error("Error fetching user from username:", error)
                setError('User not found or error loading profile')
            }

            return data
        }
    }

    useEffect(_ => {
        fetchUser(slug).then(data => {
            if(data) setUser(data)

            setLoading(false)
        })
    }, [slug])

    if(loading){
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white font-thin tracking-wide">
                Loading profile...
            </div>
        )
    }

    if(error){
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white font-thin tracking-wide px-4">
            <BackToHome />
            <p className="text-red-500 text-lg-mt-4">{error}</p>
        </div>
    }

    return (
        <div className="min-h-screen bg-black text-white font-thin tracking-wide px-6 py-12 mx-auto">
            <BackToHome />

            <div className="flex flex-col items-center space-y-6">
                {/*Avatar*/}

                <img
                    src={user.avatar_url || 'https://www.gravatar.com/avatar/?d=mp&s=128'}
                    alt={`${user.username}'s avatar`}
                    className="w-32 h-32 rounded-full border-4 border-gradient-to-r from-blue-400 via-purple-500 to-indigo-600 p-1"
                    style={{
                        borderImageSlice: 1,
                        borderWidth: '4px',
                        borderStyle: 'solid',
                        borderImageSource: 'linear-gradient(to right, #3b82f6, #8b5cf6, #6366f1)',
                    }}
                />

                {/*username*/}
                <h1 className="text-5xl bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
                    {user.username}
                </h1>

                {/* Join Date or Custom Title */}
                <p className="text-gray-400 text-sm uppercase tracking-wide">
                {user.join_title
                    ? user.join_title
                    : `Joined on ${new Date(user.created_at).toLocaleDateString()}`}
                </p>

                {/* Bio */}
                {user.bio && (
                    <p className="text-gray-300 max-w-lg text-center whitespace-pre-wrap">
                        {user.bio}
                    </p>
                )}

                {/* Favorite Macro (just for fun) */}
                {user.favorite_macro && (
                    <p className="mt-4 text-indigo-400 italic">
                        Favorite Macro: {user.favorite_macro}
                    </p>
                )}

                {/* Admin badge if super admin */}
                {user.is_super_admin && (
                    <div className="mt-6 px-4 py-1 border border-indigo-500 rounded-full text-indigo-400 uppercase text-xs tracking-wide font-semibold">
                        Admin
                    </div>
                )}

            </div>
        </div>
    )
}

export default Profile